const axios = require('axios');
const metaConfig = require('../config/meta');

class AuthService {
  // Build the OAuth URL to redirect users for Meta login
  getOAuthUrl(redirectUri, scopes = []) {
    const defaultScopes = [
      'ads_management',
      'ads_read',
      'pages_manage_posts',
      'pages_read_engagement',
      'leads_retrieval',
      'business_management',
    ];

    const finalScopes = scopes.length > 0 ? scopes : defaultScopes;

    const params = new URLSearchParams({
      client_id: metaConfig.appId,
      redirect_uri: redirectUri,
      scope: finalScopes.join(','),
      response_type: 'code',
    });

    return `https://www.facebook.com/dialog/oauth?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code, redirectUri) {
    const response = await axios.get(`${metaConfig.graphUrl}/oauth/access_token`, {
      params: {
        client_id: metaConfig.appId,
        client_secret: metaConfig.appSecret,
        redirect_uri: redirectUri,
        code,
      },
    });
    return response.data;
  }

  // Exchange short-lived token for long-lived token (60 days)
  async getLongLivedToken(shortLivedToken) {
    const response = await axios.get(`${metaConfig.graphUrl}/oauth/access_token`, {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: metaConfig.appId,
        client_secret: metaConfig.appSecret,
        fb_exchange_token: shortLivedToken,
      },
    });
    return response.data;
  }

  // Validate and inspect a token
  async inspectToken(inputToken, accessToken = metaConfig.accessToken) {
    const response = await axios.get(`${metaConfig.graphUrl}/debug_token`, {
      params: {
        input_token: inputToken,
        access_token: `${metaConfig.appId}|${metaConfig.appSecret}`,
      },
    });
    return response.data;
  }

  // Get current user info
  async getMe(accessToken = metaConfig.accessToken) {
    const response = await axios.get(`${metaConfig.graphUrl}/me`, {
      params: {
        fields: 'id,name,email',
        access_token: accessToken,
      },
    });
    return response.data;
  }

  // Get list of ad accounts accessible to the user
  async getAdAccounts(accessToken = metaConfig.accessToken) {
    const response = await axios.get(`${metaConfig.graphUrl}/me/adaccounts`, {
      params: {
        fields: 'id,name,account_status,currency,timezone_name',
        access_token: accessToken,
      },
    });
    return response.data;
  }

  // Get list of pages the user manages
  async getPages(accessToken = metaConfig.accessToken) {
    const response = await axios.get(`${metaConfig.graphUrl}/me/accounts`, {
      params: {
        fields: 'id,name,access_token,category,fan_count',
        access_token: accessToken,
      },
    });
    return response.data;
  }
}

module.exports = new AuthService();
