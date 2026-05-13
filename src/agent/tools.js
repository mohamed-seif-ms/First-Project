// Tool definitions for Claude — each tool maps to a Meta Business API call

const metaTools = [
  // ─── Auth ──────────────────────────────────────────────────────────────────
  {
    name: 'get_ad_accounts',
    description: 'Get the list of Meta ad accounts the user has access to',
    input_schema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_pages',
    description: 'Get the list of Facebook Pages the user manages',
    input_schema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },

  // ─── Campaigns ─────────────────────────────────────────────────────────────
  {
    name: 'get_campaigns',
    description: 'Get all ad campaigns from the Meta ad account with their status, budget, and objective',
    input_schema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'create_campaign',
    description: 'Create a new Meta ad campaign',
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Campaign name' },
        objective: {
          type: 'string',
          description: 'Campaign objective',
          enum: [
            'AWARENESS', 'REACH', 'TRAFFIC', 'ENGAGEMENT',
            'LEADS', 'APP_PROMOTION', 'SALES',
          ],
        },
        status: {
          type: 'string',
          enum: ['ACTIVE', 'PAUSED'],
          description: 'Campaign status (default: PAUSED)',
        },
        daily_budget: {
          type: 'number',
          description: 'Daily budget in cents (e.g., 1000 = $10)',
        },
      },
      required: ['name', 'objective'],
    },
  },
  {
    name: 'update_campaign',
    description: 'Update an existing campaign (change name, status, or budget)',
    input_schema: {
      type: 'object',
      properties: {
        campaign_id: { type: 'string', description: 'The campaign ID to update' },
        name: { type: 'string', description: 'New campaign name (optional)' },
        status: { type: 'string', enum: ['ACTIVE', 'PAUSED'], description: 'New status (optional)' },
        daily_budget: { type: 'number', description: 'New daily budget in cents (optional)' },
      },
      required: ['campaign_id'],
    },
  },

  // ─── Insights ──────────────────────────────────────────────────────────────
  {
    name: 'get_account_insights',
    description: 'Get performance analytics for the ad account (impressions, clicks, spend, reach, CTR)',
    input_schema: {
      type: 'object',
      properties: {
        date_preset: {
          type: 'string',
          enum: ['today', 'yesterday', 'last_7d', 'last_14d', 'last_30d', 'last_month', 'this_month'],
          description: 'Time range for insights (default: last_30d)',
        },
        since: { type: 'string', description: 'Start date YYYY-MM-DD (optional, overrides date_preset)' },
        until: { type: 'string', description: 'End date YYYY-MM-DD (optional)' },
      },
      required: [],
    },
  },
  {
    name: 'get_campaign_insights',
    description: 'Get performance analytics for a specific campaign',
    input_schema: {
      type: 'object',
      properties: {
        campaign_id: { type: 'string', description: 'The campaign ID' },
        date_preset: { type: 'string', description: 'Time range (e.g., last_30d, last_7d)' },
      },
      required: ['campaign_id'],
    },
  },
  {
    name: 'get_page_insights',
    description: 'Get Facebook Page analytics (fans, reach, engagement, views)',
    input_schema: {
      type: 'object',
      properties: {
        period: {
          type: 'string',
          enum: ['day', 'week', 'month'],
          description: 'Aggregation period (default: day)',
        },
        since: { type: 'string', description: 'Start date YYYY-MM-DD (optional)' },
        until: { type: 'string', description: 'End date YYYY-MM-DD (optional)' },
      },
      required: [],
    },
  },
  {
    name: 'get_audience_breakdown',
    description: 'Get audience demographic breakdown (age, gender) for ads performance',
    input_schema: {
      type: 'object',
      properties: {
        date_preset: { type: 'string', description: 'Time range (default: last_30d)' },
      },
      required: [],
    },
  },

  // ─── Pages ─────────────────────────────────────────────────────────────────
  {
    name: 'get_page_info',
    description: 'Get Facebook Page information (name, followers, description, category)',
    input_schema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_posts',
    description: 'Get recent posts from the Facebook Page',
    input_schema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'create_text_post',
    description: 'Publish a text post on the Facebook Page',
    input_schema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'The post text content' },
      },
      required: ['message'],
    },
  },
  {
    name: 'create_photo_post',
    description: 'Publish a photo post on the Facebook Page',
    input_schema: {
      type: 'object',
      properties: {
        image_url: { type: 'string', description: 'Public URL of the image' },
        caption: { type: 'string', description: 'Caption for the photo' },
      },
      required: ['image_url'],
    },
  },
  {
    name: 'schedule_post',
    description: 'Schedule a post to be published at a future time on the Facebook Page',
    input_schema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'The post text content' },
        scheduled_time: {
          type: 'string',
          description: 'ISO 8601 datetime for publication (e.g., 2024-12-25T10:00:00)',
        },
      },
      required: ['message', 'scheduled_time'],
    },
  },
  {
    name: 'create_instagram_post',
    description: 'Publish a photo post on the connected Instagram Business account',
    input_schema: {
      type: 'object',
      properties: {
        ig_account_id: { type: 'string', description: 'Instagram Business Account ID' },
        image_url: { type: 'string', description: 'Public URL of the image' },
        caption: { type: 'string', description: 'Caption for the Instagram post' },
      },
      required: ['ig_account_id', 'image_url'],
    },
  },

  // ─── Leads / CRM ──────────────────────────────────────────────────────────
  {
    name: 'get_lead_forms',
    description: 'Get all lead generation forms on the Facebook Page',
    input_schema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_leads',
    description: 'Get all leads (customer contacts) collected from lead forms',
    input_schema: {
      type: 'object',
      properties: {
        form_id: { type: 'string', description: 'Lead form ID (optional, gets all forms if not specified)' },
      },
      required: [],
    },
  },
  {
    name: 'export_leads_csv',
    description: 'Export all leads as a CSV file path',
    input_schema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
];

module.exports = metaTools;
