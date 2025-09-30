import express from 'express';
import userController from '../controllers/userController.js';
import { authenticateUser } from '../middleware/auth.js';
import { validateUpdateProfile } from '../middleware/validation.js';
import StorageService from '../services/StorageService.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticateUser);

// Profile routes
router.get('/me', userController.getProfile);
router.get('/:userId', userController.getProfile);
router.patch('/profile', validateUpdateProfile, userController.updateProfile);

// Avatar
router.post('/avatar', 
  StorageService.createUploadMiddleware({
    maxSize: 5 * 1024 * 1024,
    maxFiles: 1,
    allowedTypes: ['image/*'],
  }).single('avatar'),
  userController.updateAvatar
);

// Settings
router.get('/settings', userController.getSettings);
router.patch('/settings', userController.updateSettings);

// Block/Unblock
router.post('/:userId/block', userController.blockUser);
router.post('/:userId/unblock', userController.unblockUser);

// Activity
router.get('/:userId/activity', userController.getUserActivity);

// Servers
router.get('/me/servers', userController.getUserServers);

// Friends
router.get('/me/friends', async (req, res) => {
  try {
    // Implementation for getting friends list
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch friends' });
  }
});

// Direct messages
router.get('/me/dms', async (req, res) => {
  try {
    // Implementation for getting DMs
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch DMs' });
  }
});

export default router;