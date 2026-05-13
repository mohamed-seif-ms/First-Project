const express = require('express');
const router = express.Router();
const leadsService = require('../services/leadsService');
const { asyncWrap } = require('../middleware/errorHandler');

// GET /leads/forms - Get all lead forms
router.get('/forms', asyncWrap(async (req, res) => {
  const data = await leadsService.getLeadForms(req.query.page_id);
  res.json({ success: true, data });
}));

// GET /leads/forms/:id - Get specific lead form
router.get('/forms/:id', asyncWrap(async (req, res) => {
  const data = await leadsService.getLeadFormById(req.params.id);
  res.json({ success: true, data });
}));

// POST /leads/forms - Create a lead form
router.post('/forms', asyncWrap(async (req, res) => {
  const data = await leadsService.createLeadForm(req.body);
  res.status(201).json({ success: true, data });
}));

// GET /leads/forms/:id/leads - Get leads from a specific form
router.get('/forms/:id/leads', asyncWrap(async (req, res) => {
  const raw = await leadsService.getLeadsByForm(req.params.id);
  const parsed = (raw.data || []).map((lead) => leadsService.parseLeadData(lead));
  res.json({ success: true, total: parsed.length, data: parsed });
}));

// GET /leads/all - Get all leads from all forms on the page
router.get('/all', asyncWrap(async (req, res) => {
  const leads = await leadsService.getAllLeadsByPage(req.query.page_id);
  res.json({ success: true, total: leads.length, data: leads });
}));

// GET /leads/:id - Get a single lead
router.get('/:id', asyncWrap(async (req, res) => {
  const raw = await leadsService.getLeadById(req.params.id);
  const data = leadsService.parseLeadData(raw);
  res.json({ success: true, data });
}));

// GET /leads/export/csv - Export all leads as CSV
router.get('/export/csv', asyncWrap(async (req, res) => {
  const leads = await leadsService.getAllLeadsByPage(req.query.page_id);
  const csv = leadsService.exportLeadsAsCsv(leads);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
  res.send(csv);
}));

// POST /leads/subscribe - Subscribe page to lead webhook notifications
router.post('/subscribe', asyncWrap(async (req, res) => {
  const { page_id } = req.body;
  await leadsService.subscribePageToLeads(page_id);
  res.json({ success: true, message: 'Page subscribed to lead notifications' });
}));

// POST /leads/webhook - Receive Meta webhook events (leads)
router.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.status(403).json({ success: false, error: 'Forbidden' });
  }
});

router.post('/webhook', express.json(), (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    body.entry?.forEach((entry) => {
      entry.changes?.forEach((change) => {
        if (change.field === 'leadgen') {
          // New lead received — handle it here (e.g., save to DB, send notification)
          console.log('New lead:', JSON.stringify(change.value, null, 2));
        }
      });
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.status(404).end();
  }
});

module.exports = router;
