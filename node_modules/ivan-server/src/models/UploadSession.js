// server/src/models/UploadSession.js
// Example Sequelize model (adjust to your ORM)

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const UploadSession = sequelize.define('UploadSession', {
  uploadId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalChunks: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  receivedChunks: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending',
  },
  finalPath: {
    type: DataTypes.STRING,
  }
});

export default UploadSession;
