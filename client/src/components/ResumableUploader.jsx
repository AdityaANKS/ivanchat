import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const CHUNK_SIZE = 50 * 1024 * 1024; // 50 MB

const ResumableUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadId, setUploadId] = useState(null);
  const fileInputRef = useRef(null);

  // if you store uploadId in localStorage, you can resume after reload
  useEffect(() => {
    const savedUploadId = localStorage.getItem('currentUploadId');
    if (savedUploadId) {
      setUploadId(savedUploadId);
    }
  }, []);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await uploadFile(file);
  };

  const uploadFile = async (file) => {
    try {
      setUploading(true);
      setProgress(0);

      let uploadIdFromServer = uploadId;

      // 1. Start upload session if not existing
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      if (!uploadIdFromServer) {
        const startRes = await axios.post('/api/upload/start', {
          fileName: file.name,
          totalChunks,
        });
        uploadIdFromServer = startRes.data.uploadId;
        setUploadId(uploadIdFromServer);
        localStorage.setItem('currentUploadId', uploadIdFromServer);
      }

      // 2. Ask backend which chunks already uploaded
      let uploadedChunks = 0;
      try {
        const statusRes = await axios.get(`/api/upload/status/${uploadIdFromServer}`);
        uploadedChunks = statusRes.data.receivedChunks;
      } catch (err) {
        uploadedChunks = 0;
      }

      // 3. Upload remaining chunks
      for (let i = uploadedChunks; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const blob = file.slice(start, end);

        const formData = new FormData();
        formData.append('chunk', blob);
        formData.append('uploadId', uploadIdFromServer);
        formData.append('chunkIndex', i);

        await axios.post('/api/upload/chunk', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const percent = Math.round(((i + 1) / totalChunks) * 100);
        setProgress(percent);
      }

      // 4. Complete upload
      const completeRes = await axios.post('/api/upload/complete', {
        uploadId: uploadIdFromServer,
      });

      alert(`Upload complete! File saved at: ${completeRes.data.filePath}`);

      // Clear stored state
      localStorage.removeItem('currentUploadId');
      setUploadId(null);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed. You can refresh and resume later.');
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-4 rounded border border-gray-300 bg-white">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        disabled={uploading}
      />
      {uploading && (
        <div className="mt-2">
          <p>Uploading… {progress}%</p>
          <div className="w-full bg-gray-200 rounded">
            <div
              className="bg-green-500 h-2 rounded"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumableUploader;
