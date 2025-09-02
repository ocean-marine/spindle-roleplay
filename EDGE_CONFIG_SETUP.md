# Edge Config Store Setup

This application uses Vercel Edge Config Store to persist custom prompts. To enable this functionality, you need to set up the following environment variables.

## Required Environment Variables

Add these to your Vercel project environment variables:

### `EDGE_CONFIG_ID` (Optional)
- **Default**: `ecfg_ud3e1vvx0cwmz3vpmj41v8kzz0y1`
- **Description**: The ID of your Edge Config Store
- **Example**: `ecfg_ud3e1vvx0cwmz3vpmj41v8kzz0y1`

### `VERCEL_ACCESS_TOKEN` (Required)
- **Description**: Your Vercel API token with permission to update Edge Config
- **How to get**: 
  1. Go to [Vercel Dashboard > Settings > Tokens](https://vercel.com/account/tokens)
  2. Create a new token with appropriate scope
  3. Copy the token value

### `EDGE_CONFIG` (Automatic)
- **Description**: Automatically set by Vercel when Edge Config is connected to your project
- **Format**: `https://edge-config.vercel.com/{config-id}?token={token}`

## Setup Steps

1. **Create Edge Config Store** (if not already created):
   ```bash
   vercel edge-config create custom-prompts
   ```

2. **Connect Edge Config to your project**:
   ```bash
   vercel link
   vercel env add EDGE_CONFIG_ID
   ```

3. **Add Vercel Access Token**:
   ```bash
   vercel env add VERCEL_ACCESS_TOKEN
   ```

4. **Deploy your changes**:
   ```bash
   vercel --prod
   ```

## Usage

Once configured, users can:

- **Save Custom Prompts**: Click the "保存" (Save) button in the prompt modal
- **Load Saved Prompts**: Click the "読み込み" (Load) button to restore previously saved prompts
- **Automatic Persistence**: All custom prompts are automatically saved to Edge Config Store

## API Endpoints

### `GET /api/custom-prompts?key=custom-prompt1`
Retrieve a saved custom prompt.

### `POST /api/custom-prompts`
Save a new custom prompt.

### `PUT /api/custom-prompts`  
Update an existing custom prompt.

## Troubleshooting

- **"VERCEL_ACCESS_TOKEN environment variable is required"**: Add the Vercel access token to your environment variables
- **"Failed to update Edge Config"**: Check that your access token has the correct permissions
- **Prompt not loading**: Verify the Edge Config Store exists and contains data

## Data Structure

Custom prompts are stored with the following structure:

```typescript
interface CustomPromptData {
  content: string;        // The prompt text
  createdAt: string;      // ISO timestamp when first created
  updatedAt: string;      // ISO timestamp when last updated  
  name?: string;          // Optional name for the prompt
}
```