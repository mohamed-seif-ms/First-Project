const axios = require('axios');
const metaConfig = require('../config/meta');

class AdsService {
  constructor() {
    this.token = metaConfig.accessToken;
    this.adAccountId = metaConfig.adAccountId;
    this.baseUrl = metaConfig.graphUrl;
  }

  // ─── Campaigns ───────────────────────────────────────────────

  async getCampaigns(fields = 'id,name,status,objective,daily_budget,lifetime_budget') {
    const response = await axios.get(
      `${this.baseUrl}/act_${this.adAccountId}/campaigns`,
      {
        params: { fields, access_token: this.token },
      }
    );
    return response.data;
  }

  async createCampaign({ name, objective, status = 'PAUSED', dailyBudget, lifetimeBudget }) {
    const body = {
      name,
      objective,
      status,
      special_ad_categories: [],
      access_token: this.token,
    };

    if (dailyBudget) body.daily_budget = dailyBudget;
    if (lifetimeBudget) body.lifetime_budget = lifetimeBudget;

    const response = await axios.post(
      `${this.baseUrl}/act_${this.adAccountId}/campaigns`,
      body
    );
    return response.data;
  }

  async updateCampaign(campaignId, updates) {
    const response = await axios.post(`${this.baseUrl}/${campaignId}`, {
      ...updates,
      access_token: this.token,
    });
    return response.data;
  }

  async deleteCampaign(campaignId) {
    const response = await axios.delete(`${this.baseUrl}/${campaignId}`, {
      params: { access_token: this.token },
    });
    return response.data;
  }

  // ─── Ad Sets ─────────────────────────────────────────────────

  async getAdSets(campaignId = null, fields = 'id,name,status,daily_budget,targeting,start_time,end_time') {
    const endpoint = campaignId
      ? `${this.baseUrl}/${campaignId}/adsets`
      : `${this.baseUrl}/act_${this.adAccountId}/adsets`;

    const response = await axios.get(endpoint, {
      params: { fields, access_token: this.token },
    });
    return response.data;
  }

  async createAdSet({
    campaignId,
    name,
    dailyBudget,
    billingEvent = 'IMPRESSIONS',
    optimizationGoal = 'REACH',
    targeting,
    startTime,
    endTime,
    status = 'PAUSED',
  }) {
    const response = await axios.post(
      `${this.baseUrl}/act_${this.adAccountId}/adsets`,
      {
        campaign_id: campaignId,
        name,
        daily_budget: dailyBudget,
        billing_event: billingEvent,
        optimization_goal: optimizationGoal,
        targeting: targeting || { geo_locations: { countries: ['SA'] } },
        start_time: startTime,
        end_time: endTime,
        status,
        access_token: this.token,
      }
    );
    return response.data;
  }

  // ─── Ads ─────────────────────────────────────────────────────

  async getAds(adSetId = null, fields = 'id,name,status,creative,adset_id') {
    const endpoint = adSetId
      ? `${this.baseUrl}/${adSetId}/ads`
      : `${this.baseUrl}/act_${this.adAccountId}/ads`;

    const response = await axios.get(endpoint, {
      params: { fields, access_token: this.token },
    });
    return response.data;
  }

  async createAd({ adSetId, name, creativeId, status = 'PAUSED' }) {
    const response = await axios.post(
      `${this.baseUrl}/act_${this.adAccountId}/ads`,
      {
        adset_id: adSetId,
        name,
        creative: { creative_id: creativeId },
        status,
        access_token: this.token,
      }
    );
    return response.data;
  }

  // ─── Ad Creatives ─────────────────────────────────────────────

  async createAdCreative({ name, pageId, message, link, imageUrl, callToAction }) {
    const response = await axios.post(
      `${this.baseUrl}/act_${this.adAccountId}/adcreatives`,
      {
        name,
        object_story_spec: {
          page_id: pageId || metaConfig.pageId,
          link_data: {
            message,
            link,
            picture: imageUrl,
            call_to_action: callToAction || { type: 'LEARN_MORE' },
          },
        },
        access_token: this.token,
      }
    );
    return response.data;
  }

  // ─── Audiences ────────────────────────────────────────────────

  async getCustomAudiences() {
    const response = await axios.get(
      `${this.baseUrl}/act_${this.adAccountId}/customaudiences`,
      {
        params: {
          fields: 'id,name,subtype,approximate_count,description',
          access_token: this.token,
        },
      }
    );
    return response.data;
  }

  async createCustomAudience({ name, description, subtype = 'CUSTOM' }) {
    const response = await axios.post(
      `${this.baseUrl}/act_${this.adAccountId}/customaudiences`,
      {
        name,
        description,
        subtype,
        access_token: this.token,
      }
    );
    return response.data;
  }
}

module.exports = new AdsService();
