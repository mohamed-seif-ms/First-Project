const fs = require('fs');
const path = require('path');
const authService = require('../services/authService');
const adsService = require('../services/adsService');
const insightsService = require('../services/insightsService');
const pagesService = require('../services/pagesService');
const leadsService = require('../services/leadsService');

// Maps Claude tool_use calls → actual Meta API service calls
async function executeTool(toolName, toolInput) {
  switch (toolName) {
    // ─── Auth ────────────────────────────────────────────────────────────────
    case 'get_ad_accounts':
      return authService.getAdAccounts();

    case 'get_pages':
      return authService.getPages();

    // ─── Campaigns ───────────────────────────────────────────────────────────
    case 'get_campaigns':
      return adsService.getCampaigns();

    case 'create_campaign':
      return adsService.createCampaign({
        name: toolInput.name,
        objective: toolInput.objective,
        status: toolInput.status || 'PAUSED',
        dailyBudget: toolInput.daily_budget,
      });

    case 'update_campaign':
      return adsService.updateCampaign(toolInput.campaign_id, {
        name: toolInput.name,
        status: toolInput.status,
        daily_budget: toolInput.daily_budget,
      });

    // ─── Insights ────────────────────────────────────────────────────────────
    case 'get_account_insights':
      return insightsService.getAccountInsights({
        datePreset: toolInput.date_preset || 'last_30d',
        since: toolInput.since,
        until: toolInput.until,
      });

    case 'get_campaign_insights':
      return insightsService.getCampaignInsights(toolInput.campaign_id, {
        datePreset: toolInput.date_preset || 'last_30d',
      });

    case 'get_page_insights':
      return insightsService.getPageInsights(undefined, {
        period: toolInput.period || 'day',
        since: toolInput.since,
        until: toolInput.until,
      });

    case 'get_audience_breakdown':
      return insightsService.getAudienceBreakdown({
        datePreset: toolInput.date_preset || 'last_30d',
      });

    // ─── Pages ───────────────────────────────────────────────────────────────
    case 'get_page_info':
      return pagesService.getPageInfo();

    case 'get_posts':
      return pagesService.getPosts();

    case 'create_text_post':
      return pagesService.createTextPost(toolInput.message);

    case 'create_photo_post':
      return pagesService.createPhotoPost({
        imageUrl: toolInput.image_url,
        imageCaption: toolInput.caption,
      });

    case 'schedule_post':
      return pagesService.schedulePost({
        message: toolInput.message,
        scheduledTime: toolInput.scheduled_time,
      });

    case 'create_instagram_post':
      return pagesService.createInstagramPost({
        igAccountId: toolInput.ig_account_id,
        imageUrl: toolInput.image_url,
        caption: toolInput.caption,
      });

    // ─── Leads ───────────────────────────────────────────────────────────────
    case 'get_lead_forms':
      return leadsService.getLeadForms();

    case 'get_leads': {
      if (toolInput.form_id) {
        const raw = await leadsService.getLeadsByForm(toolInput.form_id);
        return (raw.data || []).map((l) => leadsService.parseLeadData(l));
      }
      return leadsService.getAllLeadsByPage();
    }

    case 'export_leads_csv': {
      const leads = await leadsService.getAllLeadsByPage();
      const csv = leadsService.exportLeadsAsCsv(leads);
      const filePath = path.join(process.cwd(), 'leads_export.csv');
      fs.writeFileSync(filePath, csv, 'utf8');
      return { message: `CSV exported successfully`, path: filePath, total: leads.length };
    }

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}

module.exports = { executeTool };
