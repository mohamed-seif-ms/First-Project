const axios = require('axios');
const metaConfig = require('../config/meta');

class InsightsService {
  constructor() {
    this.token = metaConfig.accessToken;
    this.adAccountId = metaConfig.adAccountId;
    this.baseUrl = metaConfig.graphUrl;
  }

  // ─── Ad Account Insights ──────────────────────────────────────

  async getAccountInsights({
    datePreset = 'last_30d',
    level = 'account',
    fields = 'impressions,clicks,spend,reach,cpm,cpc,ctr,conversions,actions',
    breakdowns = null,
    since = null,
    until = null,
  } = {}) {
    const params = {
      level,
      fields,
      access_token: this.token,
    };

    if (since && until) {
      params.time_range = JSON.stringify({ since, until });
    } else {
      params.date_preset = datePreset;
    }

    if (breakdowns) params.breakdowns = breakdowns;

    const response = await axios.get(
      `${this.baseUrl}/act_${this.adAccountId}/insights`,
      { params }
    );
    return response.data;
  }

  // ─── Campaign Insights ────────────────────────────────────────

  async getCampaignInsights(campaignId, {
    datePreset = 'last_30d',
    fields = 'campaign_name,impressions,clicks,spend,reach,cpm,cpc,ctr,actions',
    since = null,
    until = null,
  } = {}) {
    const params = {
      fields,
      access_token: this.token,
    };

    if (since && until) {
      params.time_range = JSON.stringify({ since, until });
    } else {
      params.date_preset = datePreset;
    }

    const response = await axios.get(
      `${this.baseUrl}/${campaignId}/insights`,
      { params }
    );
    return response.data;
  }

  // ─── Ad Set Insights ──────────────────────────────────────────

  async getAdSetInsights(adSetId, {
    datePreset = 'last_30d',
    fields = 'adset_name,impressions,clicks,spend,reach,cpm,cpc,ctr',
  } = {}) {
    const response = await axios.get(`${this.baseUrl}/${adSetId}/insights`, {
      params: { fields, date_preset: datePreset, access_token: this.token },
    });
    return response.data;
  }

  // ─── Page Insights ────────────────────────────────────────────

  async getPageInsights(pageId = metaConfig.pageId, {
    metrics = [
      'page_impressions',
      'page_reach',
      'page_engaged_users',
      'page_fans',
      'page_views_total',
      'page_post_engagements',
    ],
    period = 'day',
    since = null,
    until = null,
  } = {}) {
    const params = {
      metric: metrics.join(','),
      period,
      access_token: this.token,
    };

    if (since) params.since = since;
    if (until) params.until = until;

    const response = await axios.get(
      `${this.baseUrl}/${pageId}/insights`,
      { params }
    );
    return response.data;
  }

  // ─── Audience Demographics Breakdown ─────────────────────────

  async getAudienceBreakdown({
    datePreset = 'last_30d',
    breakdown = 'age,gender',
  } = {}) {
    const response = await axios.get(
      `${this.baseUrl}/act_${this.adAccountId}/insights`,
      {
        params: {
          fields: 'impressions,clicks,spend,reach',
          breakdowns: breakdown,
          date_preset: datePreset,
          level: 'account',
          access_token: this.token,
        },
      }
    );
    return response.data;
  }

  // ─── Async Insight Reports (for large datasets) ────────────────

  async createAsyncReport({
    level = 'campaign',
    fields = 'campaign_name,impressions,clicks,spend',
    datePreset = 'last_month',
  } = {}) {
    const response = await axios.post(
      `${this.baseUrl}/act_${this.adAccountId}/insights`,
      {
        level,
        fields,
        date_preset: datePreset,
        access_token: this.token,
      }
    );
    return response.data; // returns { report_run_id }
  }

  async getAsyncReportStatus(reportRunId) {
    const response = await axios.get(`${this.baseUrl}/${reportRunId}`, {
      params: { access_token: this.token },
    });
    return response.data;
  }

  async getAsyncReportResults(reportRunId) {
    const response = await axios.get(`${this.baseUrl}/${reportRunId}/insights`, {
      params: { access_token: this.token },
    });
    return response.data;
  }
}

module.exports = new InsightsService();
