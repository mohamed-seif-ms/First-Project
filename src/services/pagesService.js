const axios = require('axios');
const metaConfig = require('../config/meta');

class PagesService {
  constructor() {
    this.token = metaConfig.accessToken;
    this.pageId = metaConfig.pageId;
    this.baseUrl = metaConfig.graphUrl;
  }

  // ─── Page Info ────────────────────────────────────────────────

  async getPageInfo(pageId = this.pageId, fields = 'id,name,category,fan_count,followers_count,description,website,phone') {
    const response = await axios.get(`${this.baseUrl}/${pageId}`, {
      params: { fields, access_token: this.token },
    });
    return response.data;
  }

  // ─── Posts ────────────────────────────────────────────────────

  async getPosts(pageId = this.pageId, fields = 'id,message,story,created_time,permalink_url,likes.summary(true),comments.summary(true)') {
    const response = await axios.get(`${this.baseUrl}/${pageId}/posts`, {
      params: { fields, access_token: this.token },
    });
    return response.data;
  }

  async createTextPost(message, pageId = this.pageId) {
    const response = await axios.post(`${this.baseUrl}/${pageId}/feed`, {
      message,
      access_token: this.token,
    });
    return response.data;
  }

  async createPhotoPost({ message, imageUrl, imageCaption, pageId = this.pageId }) {
    const response = await axios.post(`${this.baseUrl}/${pageId}/photos`, {
      url: imageUrl,
      caption: imageCaption || message,
      access_token: this.token,
    });
    return response.data;
  }

  async createVideoPost({ title, description, videoUrl, pageId = this.pageId }) {
    const response = await axios.post(`${this.baseUrl}/${pageId}/videos`, {
      title,
      description,
      file_url: videoUrl,
      access_token: this.token,
    });
    return response.data;
  }

  async createLinkPost({ message, link, pageId = this.pageId }) {
    const response = await axios.post(`${this.baseUrl}/${pageId}/feed`, {
      message,
      link,
      access_token: this.token,
    });
    return response.data;
  }

  async schedulePost({ message, scheduledTime, pageId = this.pageId }) {
    const response = await axios.post(`${this.baseUrl}/${pageId}/feed`, {
      message,
      published: false,
      scheduled_publish_time: Math.floor(new Date(scheduledTime).getTime() / 1000),
      access_token: this.token,
    });
    return response.data;
  }

  async deletePost(postId) {
    const response = await axios.delete(`${this.baseUrl}/${postId}`, {
      params: { access_token: this.token },
    });
    return response.data;
  }

  // ─── Comments ─────────────────────────────────────────────────

  async getComments(postId, fields = 'id,message,from,created_time,like_count') {
    const response = await axios.get(`${this.baseUrl}/${postId}/comments`, {
      params: { fields, access_token: this.token },
    });
    return response.data;
  }

  async replyToComment(commentId, message) {
    const response = await axios.post(`${this.baseUrl}/${commentId}/comments`, {
      message,
      access_token: this.token,
    });
    return response.data;
  }

  // ─── Scheduled Posts ──────────────────────────────────────────

  async getScheduledPosts(pageId = this.pageId) {
    const response = await axios.get(`${this.baseUrl}/${pageId}/scheduled_posts`, {
      params: {
        fields: 'id,message,scheduled_publish_time,story',
        access_token: this.token,
      },
    });
    return response.data;
  }

  // ─── Instagram (if connected to page) ────────────────────────

  async getInstagramAccount(pageId = this.pageId) {
    const response = await axios.get(`${this.baseUrl}/${pageId}`, {
      params: {
        fields: 'instagram_business_account',
        access_token: this.token,
      },
    });
    return response.data;
  }

  async createInstagramPost({ igAccountId, imageUrl, caption }) {
    // Step 1: Create media container
    const mediaRes = await axios.post(`${this.baseUrl}/${igAccountId}/media`, {
      image_url: imageUrl,
      caption,
      access_token: this.token,
    });

    const creationId = mediaRes.data.id;

    // Step 2: Publish the container
    const publishRes = await axios.post(`${this.baseUrl}/${igAccountId}/media_publish`, {
      creation_id: creationId,
      access_token: this.token,
    });

    return publishRes.data;
  }
}

module.exports = new PagesService();
