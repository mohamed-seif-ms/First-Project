const express = require('express');
const router = express.Router();
const adsService = require('../services/adsService');
const { asyncWrap } = require('../middleware/errorHandler');

// ─── Campaigns ───────────────────────────────────────────────────

router.get('/campaigns', asyncWrap(async (req, res) => {
  const data = await adsService.getCampaigns(req.query.fields);
  res.json({ success: true, data });
}));

router.post('/campaigns', asyncWrap(async (req, res) => {
  const data = await adsService.createCampaign(req.body);
  res.status(201).json({ success: true, data });
}));

router.patch('/campaigns/:id', asyncWrap(async (req, res) => {
  const data = await adsService.updateCampaign(req.params.id, req.body);
  res.json({ success: true, data });
}));

router.delete('/campaigns/:id', asyncWrap(async (req, res) => {
  const data = await adsService.deleteCampaign(req.params.id);
  res.json({ success: true, data });
}));

// ─── Ad Sets ─────────────────────────────────────────────────────

router.get('/adsets', asyncWrap(async (req, res) => {
  const data = await adsService.getAdSets(req.query.campaign_id, req.query.fields);
  res.json({ success: true, data });
}));

router.post('/adsets', asyncWrap(async (req, res) => {
  const data = await adsService.createAdSet(req.body);
  res.status(201).json({ success: true, data });
}));

// ─── Ads ─────────────────────────────────────────────────────────

router.get('/ads', asyncWrap(async (req, res) => {
  const data = await adsService.getAds(req.query.adset_id, req.query.fields);
  res.json({ success: true, data });
}));

router.post('/ads', asyncWrap(async (req, res) => {
  const data = await adsService.createAd(req.body);
  res.status(201).json({ success: true, data });
}));

// ─── Creatives ────────────────────────────────────────────────────

router.post('/creatives', asyncWrap(async (req, res) => {
  const data = await adsService.createAdCreative(req.body);
  res.status(201).json({ success: true, data });
}));

// ─── Audiences ────────────────────────────────────────────────────

router.get('/audiences', asyncWrap(async (req, res) => {
  const data = await adsService.getCustomAudiences();
  res.json({ success: true, data });
}));

router.post('/audiences', asyncWrap(async (req, res) => {
  const data = await adsService.createCustomAudience(req.body);
  res.status(201).json({ success: true, data });
}));

module.exports = router;
