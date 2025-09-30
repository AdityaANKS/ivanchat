import chunkUploadSocket from './chunkUploadSocket.js';

export default (io) => {
  chunkUploadSocket(io);
};