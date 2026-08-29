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

## n8n Integration

This project ships with a ready-to-run [n8n](https://n8n.io) instance (workflow automation) wired up alongside the API server via Docker Compose.

### 1. Configure environment
```bash
cp .env.example .env
# fill in your Meta + Anthropic credentials, and optionally change the n8n basic-auth login
```

### 2. Start both services
```bash
docker compose up -d
```
This starts:
- **app** — this Express server, reachable at `http://localhost:3000`
- **n8n** — the n8n editor, reachable at `http://localhost:5678` (login: `N8N_BASIC_AUTH_USER` / `N8N_BASIC_AUTH_PASSWORD` from `.env`, defaults `admin` / `changeme`)

Inside the shared Docker network, n8n reaches the app at `http://app:3000` (exposed to n8n as the `META_APP_BASE_URL` environment variable).

### 3. Import the example workflows
Open the n8n editor at `http://localhost:5678`, then **Workflows → Import from File** and pick any file from `n8n/workflows/`:

| Workflow | Trigger | What it does |
|----------|---------|---------------|
| `new-leads-sync.json` | Every 15 minutes | Calls `GET /leads/all` and splits out each lead so you can route it to a CRM, spreadsheet, or Slack |
| `daily-insights-report.json` | Daily at 8am | Calls `GET /insights/account` so you can forward the numbers to Slack/email |
| `ask-meta-agent.json` | Webhook (`POST /webhook/ask-meta-agent`) | Forwards `{ "message": "..." }` to `POST /agent/chat` (the Claude-powered agent) and returns its reply |

Each workflow has a placeholder `NoOp`/response node marking where to plug in your destination (Slack, Sheets, email, etc.) — activate the workflow once you've wired that up.

### Running n8n without Docker
If you already run n8n elsewhere (self-hosted or n8n cloud), skip the compose file — just point its HTTP Request nodes at this server's public URL instead of `http://app:3000`, and import the same workflow files.
