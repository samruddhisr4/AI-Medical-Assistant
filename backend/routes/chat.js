const express = require('express');
const router = express.Router();
const { sendMessage, getHistory, clearHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Protect all routes below

// POST /api/chat - Send a message
router.post('/', sendMessage);

// GET /api/chat/history - Get conversation history
router.get('/history', getHistory);

// DELETE /api/chat/history - Clear conversation
router.delete('/history', clearHistory);

module.exports = router;
