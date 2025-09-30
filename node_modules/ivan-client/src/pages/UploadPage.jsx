import ChunkedUploader from './components/ChunkedUploader';

function UploadPage() {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Upload Large File</h1>
      <ChunkedUploader />
    </div>
  );
}

import ResumableUploader from './components/ResumableUploader';

function UploadPage() {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Upload Large File (Resumable)</h1>
      <ResumableUploader />
    </div>
  );
}

export default UploadPage;