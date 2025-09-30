import React, { useState, useRef } from 'react';
import axios from 'axios';

const CHUNK_SIZE = 50 * 1024 * 1024; // 50MB chunks

const ChunkedUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadId, setUploadId] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await uploadFile(file);
  };

  const uploadFile = async (file) => {
    try {
      setUploading(true);
      setProgress(0);

      // 1. Start upload session
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      const startRes = await axios.post('/api/upload/start', {
        fileName: file.name,
        totalChunks,
      });
      const uploadIdFromServer = startRes.data.uploadId;
      setUploadId(uploadIdFromServer);

      // 2. Upload each chunk
      for (let i = 0; i < totalChunks; i++) {
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

        setProgress(Math.round(((i + 1) / totalChunks) * 100));
      }

      // 3. Complete upload
      const completeRes = await axios.post('/api/upload/complete', {
        uploadId: uploadIdFromServer,
      });

      alert(`Upload complete! File saved at: ${completeRes.data.filePath}`);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
      setUploadId(null);
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
              className="bg-blue-500 h-2 rounded"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChunkedUploader;
