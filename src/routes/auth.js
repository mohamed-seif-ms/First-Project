const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const { asyncWrap } = require('../middleware/errorHandler');

// GET /auth/login - Get OAuth URL
router.get('/login', (req, res) => {
  const redirectUri = req.query.redirect_uri || `${req.protocol}://${req.get('host')}/auth/callback`;
  const url = authService.getOAuthUrl(redirectUri);
  res.json({ success: true, url });
});

// GET /auth/callback - OAuth callback handler
router.get('/callback', asyncWrap(async (req, res) => {
  const { code, redirect_uri } = req.query;
  if (!code) return res.status(400).json({ success: false, error: 'Missing code parameter' });

  const redirectUri = redirect_uri || `${req.protocol}://${req.get('host')}/auth/callback`;
  const tokenData = await authService.exchangeCodeForToken(code, redirectUri);
  res.json({ success: true, data: tokenData });
}));

// POST /auth/long-lived-token - Exchange for long-lived token
router.post('/long-lived-token', asyncWrap(async (req, res) => {
  const { short_lived_token } = req.body;
  if (!short_lived_token) return res.status(400).json({ success: false, error: 'Missing short_lived_token' });

  const data = await authService.getLongLivedToken(short_lived_token);
  res.json({ success: true, data });
}));

// GET /auth/inspect - Inspect a token
router.get('/inspect', asyncWrap(async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ success: false, error: 'Missing token' });

  const data = await authService.inspectToken(token);
  res.json({ success: true, data });
}));

// GET /auth/me - Get current user
router.get('/me', asyncWrap(async (req, res) => {
  const token = req.headers['x-access-token'] || req.query.access_token;
  const data = await authService.getMe(token);
  res.json({ success: true, data });
}));

// GET /auth/ad-accounts - List accessible ad accounts
router.get('/ad-accounts', asyncWrap(async (req, res) => {
  const token = req.headers['x-access-token'] || req.query.access_token;
  const data = await authService.getAdAccounts(token);
  res.json({ success: true, data });
}));

// GET /auth/pages - List managed pages
router.get('/pages', asyncWrap(async (req, res) => {
  const token = req.headers['x-access-token'] || req.query.access_token;
  const data = await authService.getPages(token);
  res.json({ success: true, data });
}));

module.exports = router;
