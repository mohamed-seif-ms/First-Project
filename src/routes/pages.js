const express = require('express');
const router = express.Router();
const pagesService = require('../services/pagesService');
const { asyncWrap } = require('../middleware/errorHandler');

// GET /pages/info - Page info
router.get('/info', asyncWrap(async (req, res) => {
  const data = await pagesService.getPageInfo(req.query.page_id, req.query.fields);
  res.json({ success: true, data });
}));

// GET /pages/posts - Get page posts
router.get('/posts', asyncWrap(async (req, res) => {
  const data = await pagesService.getPosts(req.query.page_id);
  res.json({ success: true, data });
}));

// POST /pages/posts/text - Create text post
router.post('/posts/text', asyncWrap(async (req, res) => {
  const { message, page_id } = req.body;
  if (!message) return res.status(400).json({ success: false, error: 'message is required' });

  const data = await pagesService.createTextPost(message, page_id);
  res.status(201).json({ success: true, data });
}));

// POST /pages/posts/photo - Create photo post
router.post('/posts/photo', asyncWrap(async (req, res) => {
  const data = await pagesService.createPhotoPost(req.body);
  res.status(201).json({ success: true, data });
}));

// POST /pages/posts/video - Create video post
router.post('/posts/video', asyncWrap(async (req, res) => {
  const data = await pagesService.createVideoPost(req.body);
  res.status(201).json({ success: true, data });
}));

// POST /pages/posts/link - Create link post
router.post('/posts/link', asyncWrap(async (req, res) => {
  const data = await pagesService.createLinkPost(req.body);
  res.status(201).json({ success: true, data });
}));

// POST /pages/posts/schedule - Schedule a post
router.post('/posts/schedule', asyncWrap(async (req, res) => {
  const data = await pagesService.schedulePost(req.body);
  res.status(201).json({ success: true, data });
}));

// GET /pages/posts/scheduled - Get scheduled posts
router.get('/posts/scheduled', asyncWrap(async (req, res) => {
  const data = await pagesService.getScheduledPosts(req.query.page_id);
  res.json({ success: true, data });
}));

// DELETE /pages/posts/:id - Delete a post
router.delete('/posts/:id', asyncWrap(async (req, res) => {
  const data = await pagesService.deletePost(req.params.id);
  res.json({ success: true, data });
}));

// GET /pages/posts/:id/comments - Get post comments
router.get('/posts/:id/comments', asyncWrap(async (req, res) => {
  const data = await pagesService.getComments(req.params.id);
  res.json({ success: true, data });
}));

// POST /pages/comments/:id/reply - Reply to a comment
router.post('/comments/:id/reply', asyncWrap(async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ success: false, error: 'message is required' });

  const data = await pagesService.replyToComment(req.params.id, message);
  res.status(201).json({ success: true, data });
}));

// GET /pages/instagram - Get connected Instagram account
router.get('/instagram', asyncWrap(async (req, res) => {
  const data = await pagesService.getInstagramAccount(req.query.page_id);
  res.json({ success: true, data });
}));

// POST /pages/instagram/post - Create Instagram post
router.post('/instagram/post', asyncWrap(async (req, res) => {
  const data = await pagesService.createInstagramPost(req.body);
  res.status(201).json({ success: true, data });
}));

module.exports = router;
