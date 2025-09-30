import express from 'express';
import { auth } from '../middleware/auth';
import {
  scheduleMessage,
  startUserOnboarding,
  cancelScheduledMessage,
  getWorkflowStatus,
} from '../temporal/client';

const router = express.Router();

// Schedule a message
router.post('/schedule-message', auth, async (req, res) => {
  try {
    const { channelId, content, scheduledAt, recurring } = req.body;
    
    const workflowId = await scheduleMessage({
      messageId: nanoid(),
      channelId,
      userId: req.user.id,
      content,
      scheduledAt: new Date(scheduledAt),
      recurring,
    });

    res.json({
      success: true,
      workflowId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel scheduled message
router.delete('/schedule-message/:workflowId', auth, async (req, res) => {
  try {
    await cancelScheduledMessage(req.params.workflowId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get workflow status
router.get('/workflow/:workflowId/status', auth, async (req, res) => {
  try {
    const status = await getWorkflowStatus(req.params.workflowId);
    res.json({ status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;