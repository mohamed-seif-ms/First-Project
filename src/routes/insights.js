const express = require('express');
const router = express.Router();
const insightsService = require('../services/insightsService');
const { asyncWrap } = require('../middleware/errorHandler');

// GET /insights/account - Account-level insights
router.get('/account', asyncWrap(async (req, res) => {
  const data = await insightsService.getAccountInsights(req.query);
  res.json({ success: true, data });
}));

// GET /insights/campaigns/:id - Campaign insights
router.get('/campaigns/:id', asyncWrap(async (req, res) => {
  const data = await insightsService.getCampaignInsights(req.params.id, req.query);
  res.json({ success: true, data });
}));

// GET /insights/adsets/:id - Ad set insights
router.get('/adsets/:id', asyncWrap(async (req, res) => {
  const data = await insightsService.getAdSetInsights(req.params.id, req.query);
  res.json({ success: true, data });
}));

// GET /insights/page - Page insights
router.get('/page', asyncWrap(async (req, res) => {
  const { page_id, ...options } = req.query;
  if (options.metrics && typeof options.metrics === 'string') {
    options.metrics = options.metrics.split(',');
  }
  const data = await insightsService.getPageInsights(page_id, options);
  res.json({ success: true, data });
}));

// GET /insights/audience - Audience breakdown
router.get('/audience', asyncWrap(async (req, res) => {
  const data = await insightsService.getAudienceBreakdown(req.query);
  res.json({ success: true, data });
}));

// POST /insights/report - Create async report
router.post('/report', asyncWrap(async (req, res) => {
  const data = await insightsService.createAsyncReport(req.body);
  res.status(202).json({ success: true, data });
}));

// GET /insights/report/:id - Get async report status
router.get('/report/:id', asyncWrap(async (req, res) => {
  const data = await insightsService.getAsyncReportStatus(req.params.id);
  res.json({ success: true, data });
}));

// GET /insights/report/:id/results - Get async report results
router.get('/report/:id/results', asyncWrap(async (req, res) => {
  const data = await insightsService.getAsyncReportResults(req.params.id);
  res.json({ success: true, data });
}));

module.exports = router;
