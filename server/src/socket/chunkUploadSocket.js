// server/src/socket/chunkUploadSocket.js
export default (io) => {
  io.on('connection', (socket) => {
    socket.on('upload-progress', (data) => {
      // data: { uploadId, progress }
      socket.broadcast.emit(`upload-progress-${data.uploadId}`, data.progress);
    });
  });
};
