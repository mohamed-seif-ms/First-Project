const express = require('express');
const router = express.Router();
const MetaAgent = require('../agent/agent');
const { asyncWrap } = require('../middleware/errorHandler');

// One agent instance per server (stateful conversation)
const agent = new MetaAgent();

// POST /agent/chat - Send a message to the Meta Business AI Agent
router.post('/chat', asyncWrap(async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ success: false, error: 'message is required' });
  }

  const reply = await agent.chat(message.trim());
  res.json({ success: true, reply });
}));

// DELETE /agent/history - Clear conversation history
router.delete('/history', (req, res) => {
  agent.clearHistory();
  res.json({ success: true, message: 'Conversation history cleared' });
});

module.exports = router;
