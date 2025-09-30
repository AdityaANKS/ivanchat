import React, { useRef, useState } from 'react';
import config from '../../config/env';
import api from '../../services/api';

const FileUpload = ({ onFileUploaded }) => {
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [uploadController, setUploadController] = useState(null);

  const validateFile = (file) => {
    if (!file) return false;

    // Check file size
    if (file.size > config.upload.maxFileSize) {
      const maxSizeMB = config.upload.maxFileSize / (1024 * 1024);
      setError(`File too large. Maximum size is ${maxSizeMB}MB`);
      return false;
    }

    // Check file type
    const allowedTypes = config.upload.allowedTypes.split(',');
    const isAllowed = allowedTypes.some(type => {
      if (type.includes('*')) {
        return file.type.startsWith(type.replace('*', ''));
      }
      return file.name.endsWith(type);
    });

    if (!isAllowed) {
      setError('File type not allowed');
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (validateFile(file)) {
      await uploadFile(file);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (validateFile(file)) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    // Generate preview for images/videos
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    const controller = new AbortController();
    setUploadController(controller);

    try {
      const response = await api.post(config.api.uploadUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        signal: controller.signal,
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          }
        },
      });

      setUploading(false);
      setProgress(100);
      onFileUploaded(response.data);
      setTimeout(() => {
        setProgress(0);
        setPreview(null);
      }, 1000);
    } catch (err) {
      if (err.name === 'CanceledError') {
        setError('Upload canceled');
      } else {
        setError('Upload failed. Please try again.');
      }
      setUploading(false);
    }
  };

  const handleCancelUpload = () => {
    if (uploadController) {
      uploadController.abort();
      setUploading(false);
      setProgress(0);
    }
  };

  if (!config.features.fileSharing) {
    return null;
  }

  return (
    <div
      className="file-upload-container"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      style={{
        border: '2px dashed #aaa',
        borderRadius: '12px',
        padding: '16px',
        textAlign: 'center',
        transition: 'border-color 0.2s ease-in-out',
        background: uploading ? 'rgba(0,0,0,0.05)' : 'transparent'
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        accept={config.upload.allowedTypes}
        style={{ display: 'none' }}
      />

      {!uploading && (
        <button
          onClick={() => fileInputRef.current.click()}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            background: '#3b82f6',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Attach File
        </button>
      )}

      {uploading && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ marginBottom: '5px' }}>Uploading... {progress}%</div>
          <div
            style={{
              width: '100%',
              height: '6px',
              background: '#eee',
              borderRadius: '4px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: '#3b82f6',
                transition: 'width 0.2s'
              }}
            ></div>
          </div>
          <button
            onClick={handleCancelUpload}
            style={{
              marginTop: '8px',
              background: '#ef4444',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 12px',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {preview && (
        <div style={{ marginTop: '10px' }}>
          {preview && (
            fileInputRef.current?.files[0]?.type.startsWith('video/') ? (
              <video src={preview} controls style={{ maxWidth: '100%', borderRadius: '8px' }} />
            ) : (
              <img src={preview} alt="preview" style={{ maxWidth: '100%', borderRadius: '8px' }} />
            )
          )}
        </div>
      )}

      {error && <div style={{ color: 'red', marginTop: '8px' }}>{error}</div>}

      <p style={{ marginTop: '12px', color: '#555', fontSize: '14px' }}>
        Drag and drop files here or click Attach File.
      </p>
    </div>
  );
};

export default FileUpload;
