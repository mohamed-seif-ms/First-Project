# Meta Business API Integration

Node.js/Express server for integrating with Meta Business API.

## Features

| Module | Capabilities |
|--------|-------------|
| **Auth** | OAuth login, token exchange, token inspection |
| **Ads** | Campaigns, Ad Sets, Ads, Creatives, Audiences |
| **Insights** | Account/Campaign/Page analytics, async reports |
| **Pages** | Publish posts (text/photo/video/link), schedule, comments, Instagram |
| **Leads** | Lead forms, fetch leads, CRM export (CSV), webhooks |

## Setup

### 1. Clone & Install
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your Meta credentials
```

### 3. Get Meta Credentials
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create a new App → Business type
3. Add **Marketing API** and **Pages API** products
4. Generate a System User token with required permissions:
   - `ads_management`, `ads_read`
   - `pages_manage_posts`, `pages_read_engagement`
   - `leads_retrieval`
   - `business_management`

### 4. Run
```bash
npm start        # Production
npm run dev      # Development (nodemon)
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/login` | Get OAuth URL |
| GET | `/auth/callback` | OAuth callback |
| POST | `/auth/long-lived-token` | Exchange for 60-day token |
| GET | `/auth/me` | Current user info |
| GET | `/auth/ad-accounts` | List ad accounts |
| GET | `/auth/pages` | List managed pages |

### Ads
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/ads/campaigns` | List campaigns |
| POST | `/ads/campaigns` | Create campaign |
| PATCH | `/ads/campaigns/:id` | Update campaign |
| DELETE | `/ads/campaigns/:id` | Delete campaign |
| GET | `/ads/adsets` | List ad sets |
| POST | `/ads/adsets` | Create ad set |
| GET | `/ads/ads` | List ads |
| POST | `/ads/ads` | Create ad |
| POST | `/ads/creatives` | Create ad creative |
| GET | `/ads/audiences` | List custom audiences |
| POST | `/ads/audiences` | Create custom audience |

### Insights
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/insights/account` | Account-level insights |
| GET | `/insights/campaigns/:id` | Campaign insights |
| GET | `/insights/adsets/:id` | Ad set insights |
| GET | `/insights/page` | Page insights |
| GET | `/insights/audience` | Audience breakdown |
| POST | `/insights/report` | Create async report |
| GET | `/insights/report/:id` | Report status |
| GET | `/insights/report/:id/results` | Report results |

### Pages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/pages/info` | Page information |
| GET | `/pages/posts` | Get page posts |
| POST | `/pages/posts/text` | Publish text post |
| POST | `/pages/posts/photo` | Publish photo post |
| POST | `/pages/posts/video` | Publish video post |
| POST | `/pages/posts/link` | Publish link post |
| POST | `/pages/posts/schedule` | Schedule a post |
| GET | `/pages/posts/scheduled` | Get scheduled posts |
| DELETE | `/pages/posts/:id` | Delete a post |
| GET | `/pages/posts/:id/comments` | Get comments |
| POST | `/pages/comments/:id/reply` | Reply to comment |
| GET | `/pages/instagram` | Get Instagram account |
| POST | `/pages/instagram/post` | Post to Instagram |

### Leads / CRM
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/leads/forms` | List lead forms |
| GET | `/leads/forms/:id` | Get lead form |
| POST | `/leads/forms` | Create lead form |
| GET | `/leads/forms/:id/leads` | Get leads from form |
| GET | `/leads/all` | All leads from page |
| GET | `/leads/:id` | Single lead |
| GET | `/leads/export/csv` | Export leads as CSV |
| POST | `/leads/subscribe` | Subscribe to webhooks |
| GET | `/leads/webhook` | Webhook verification |
| POST | `/leads/webhook` | Receive lead events |

## Health Check
```
GET /health
```
