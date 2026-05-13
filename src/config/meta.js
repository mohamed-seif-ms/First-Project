require('dotenv').config();

const metaConfig = {
  appId: process.env.META_APP_ID,
  appSecret: process.env.META_APP_SECRET,
  accessToken: process.env.META_ACCESS_TOKEN,
  adAccountId: process.env.META_AD_ACCOUNT_ID,
  pageId: process.env.META_PAGE_ID,
  apiVersion: process.env.META_API_VERSION || 'v19.0',
  baseUrl: 'https://graph.facebook.com',
};

metaConfig.graphUrl = `${metaConfig.baseUrl}/${metaConfig.apiVersion}`;

module.exports = metaConfig;
