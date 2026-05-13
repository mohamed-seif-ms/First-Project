const axios = require('axios');
const metaConfig = require('../config/meta');

class LeadsService {
  constructor() {
    this.token = metaConfig.accessToken;
    this.pageId = metaConfig.pageId;
    this.adAccountId = metaConfig.adAccountId;
    this.baseUrl = metaConfig.graphUrl;
  }

  // ─── Lead Forms ───────────────────────────────────────────────

  async getLeadForms(pageId = this.pageId) {
    const response = await axios.get(`${this.baseUrl}/${pageId}/leadgen_forms`, {
      params: {
        fields: 'id,name,status,leads_count,created_time,questions',
        access_token: this.token,
      },
    });
    return response.data;
  }

  async getLeadFormById(formId) {
    const response = await axios.get(`${this.baseUrl}/${formId}`, {
      params: {
        fields: 'id,name,status,leads_count,created_time,questions,privacy_policy',
        access_token: this.token,
      },
    });
    return response.data;
  }

  async createLeadForm({
    name,
    pageId = this.pageId,
    questions = [],
    privacyPolicyUrl,
    thankYouPage,
    locale = 'ar_AR',
  }) {
    const defaultQuestions = [
      { type: 'FULL_NAME' },
      { type: 'EMAIL' },
      { type: 'PHONE' },
    ];

    const response = await axios.post(`${this.baseUrl}/${pageId}/leadgen_forms`, {
      name,
      questions: questions.length > 0 ? questions : defaultQuestions,
      privacy_policy: { url: privacyPolicyUrl || 'https://example.com/privacy' },
      thank_you_page: thankYouPage || {
        title: 'شكراً!',
        body: 'سنتواصل معك قريباً',
      },
      locale,
      access_token: this.token,
    });
    return response.data;
  }

  // ─── Leads Data ───────────────────────────────────────────────

  async getLeadsByForm(formId) {
    const response = await axios.get(`${this.baseUrl}/${formId}/leads`, {
      params: {
        fields: 'id,created_time,field_data,ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name',
        access_token: this.token,
      },
    });
    return response.data;
  }

  async getLeadById(leadId) {
    const response = await axios.get(`${this.baseUrl}/${leadId}`, {
      params: {
        fields: 'id,created_time,field_data,ad_id,ad_name,form_id',
        access_token: this.token,
      },
    });
    return response.data;
  }

  // Parse field_data array into a clean key-value object
  parseLeadData(lead) {
    const parsed = {
      id: lead.id,
      created_time: lead.created_time,
      ad_name: lead.ad_name,
      campaign_name: lead.campaign_name,
    };

    if (lead.field_data) {
      lead.field_data.forEach(({ name, values }) => {
        parsed[name] = values && values.length === 1 ? values[0] : values;
      });
    }

    return parsed;
  }

  async getAllLeadsByPage(pageId = this.pageId) {
    // Get all forms first
    const formsRes = await this.getLeadForms(pageId);
    const forms = formsRes.data || [];

    const allLeads = [];

    for (const form of forms) {
      const leadsRes = await this.getLeadsByForm(form.id);
      const leads = (leadsRes.data || []).map((lead) => ({
        ...this.parseLeadData(lead),
        form_id: form.id,
        form_name: form.name,
      }));
      allLeads.push(...leads);
    }

    return allLeads;
  }

  // ─── Lead Webhooks ────────────────────────────────────────────

  subscribePageToLeads(pageId = this.pageId) {
    return axios.post(`${this.baseUrl}/${pageId}/subscribed_apps`, {
      subscribed_fields: 'leadgen',
      access_token: this.token,
    });
  }

  // ─── CRM Export ───────────────────────────────────────────────

  exportLeadsAsCsv(leads) {
    if (!leads || leads.length === 0) return '';

    const headers = Object.keys(leads[0]);
    const rows = leads.map((lead) =>
      headers.map((h) => JSON.stringify(lead[h] ?? '')).join(',')
    );

    return [headers.join(','), ...rows].join('\n');
  }
}

module.exports = new LeadsService();
