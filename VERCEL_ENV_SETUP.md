# Vercel Environment Variables Setup

This document explains how to properly configure environment variables for the OpenAI Realtime Console application when deployed on Vercel.

## Required Environment Variables

### Backend API Keys (Server-side only)
These variables are kept secure on the server and never exposed to clients:

- **`OPENAI_API_KEY`**: Your OpenAI API key for Realtime API access
- **`GROQ_API_KEY`**: Your GROQ API key for AI instruction generation

### Optional Environment Variables
- **`VERCEL_ENV`**: Automatically set by Vercel (production, preview, development)

## Setup Instructions

### 1. Via Vercel Dashboard
1. Go to your project's Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:
   - Name: `OPENAI_API_KEY`, Value: `your-openai-api-key`
   - Name: `GROQ_API_KEY`, Value: `your-groq-api-key`
4. Make sure to set them for all environments (Production, Preview, Development)

### 2. Via Vercel CLI
```bash
vercel env add OPENAI_API_KEY
vercel env add GROQ_API_KEY
```

## Security Model

### ✅ Secure Backend Approach (Current)
- API keys are stored as server-side environment variables
- Client makes requests to `/api/token` and `/api/groq` endpoints
- API keys never leave the server environment
- CORS properly configured for client access

### ❌ Previous Insecure Approach (Fixed)
- ~~`VITE_GROQ_API_KEY` exposed API key to client-side~~
- ~~Client-side direct API calls exposed sensitive credentials~~

## Troubleshooting

### API Key Not Found
If you see "API_KEY: Missing" in logs:
1. Verify the environment variable is set in Vercel dashboard
2. Check the variable name matches exactly (case-sensitive)
3. Redeploy after adding environment variables

### GROQ API Issues
- The application now uses secure backend endpoints for GROQ processing
- Remove any `VITE_GROQ_API_KEY` variables as they're no longer needed
- Set only `GROQ_API_KEY` as a server-side environment variable

### Vercel Environment Detection
- `VERCEL_ENV` is automatically set by Vercel
- Possible values: `production`, `preview`, `development`
- This helps with environment-specific configurations

## API Endpoints

### `/api/token` (OpenAI Realtime)
- Method: GET
- Purpose: Generate OpenAI Realtime API session tokens
- Authentication: Uses `OPENAI_API_KEY` server-side

### `/api/groq` (GROQ Processing)
- Method: POST
- Purpose: Generate AI conversation instructions
- Authentication: Uses `GROQ_API_KEY` server-side
- Body: `{ "context": "conversation context" }` or `{ "prompt": "custom prompt" }`

## Testing Environment Variables

Both API endpoints will log the status of environment variables at startup:
- `OPENAI_API_KEY: Set/Missing`
- `GROQ_API_KEY: Set/Missing`
- `VERCEL_ENV: production/preview/development`

Check your Vercel deployment logs to verify all required variables are properly configured.