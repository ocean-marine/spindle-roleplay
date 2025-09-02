import { VercelRequest, VercelResponse } from '@vercel/node';
import { get } from '@vercel/edge-config';

// Note: Direct Edge Config mutation is only possible through the Vercel API
// We'll use the Vercel API to update Edge Config values

// Type for custom prompt data
interface CustomPromptData {
  content: string;
  createdAt: string;
  updatedAt: string;
  name?: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        await handleGet(req, res);
        break;
      case 'POST':
        await handlePost(req, res);
        break;
      case 'PUT':
        await handlePut(req, res);
        break;
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Custom prompts API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Get custom prompt by key
async function handleGet(req: VercelRequest, res: VercelResponse): Promise<void> {
  const { key = 'custom-prompt1' } = req.query;
  
  try {
    const promptData = await get(key as string) as CustomPromptData | null;
    
    if (!promptData) {
      res.status(404).json({ error: 'Custom prompt not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: promptData
    });
  } catch (error) {
    console.error('Error reading from Edge Config:', error);
    res.status(500).json({ 
      error: 'Failed to read custom prompt',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Save custom prompt
async function handlePost(req: VercelRequest, res: VercelResponse): Promise<void> {
  const { content, name, key = 'custom-prompt1' } = req.body;

  if (!content || typeof content !== 'string') {
    res.status(400).json({ error: 'Content is required and must be a string' });
    return;
  }

  const promptData: CustomPromptData = {
    content: content.trim(),
    name: name || undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    await updateEdgeConfig(key as string, promptData);
    
    res.status(201).json({
      success: true,
      message: 'Custom prompt saved successfully',
      data: promptData
    });
  } catch (error) {
    console.error('Error writing to Edge Config:', error);
    res.status(500).json({ 
      error: 'Failed to save custom prompt',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Update custom prompt
async function handlePut(req: VercelRequest, res: VercelResponse): Promise<void> {
  const { content, name, key = 'custom-prompt1' } = req.body;

  if (!content || typeof content !== 'string') {
    res.status(400).json({ error: 'Content is required and must be a string' });
    return;
  }

  try {
    // Get existing data to preserve createdAt
    const existingData = await get(key as string) as CustomPromptData | null;
    
    const promptData: CustomPromptData = {
      content: content.trim(),
      name: name || existingData?.name || undefined,
      createdAt: existingData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await updateEdgeConfig(key as string, promptData);
    
    res.status(200).json({
      success: true,
      message: 'Custom prompt updated successfully',
      data: promptData
    });
  } catch (error) {
    console.error('Error updating Edge Config:', error);
    res.status(500).json({ 
      error: 'Failed to update custom prompt',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Function to update Edge Config using Vercel API
async function updateEdgeConfig(key: string, data: CustomPromptData): Promise<void> {
  const EDGE_CONFIG_ID = process.env.EDGE_CONFIG_ID || 'ecfg_ud3e1vvx0cwmz3vpmj41v8kzz0y1';
  const VERCEL_ACCESS_TOKEN = process.env.VERCEL_ACCESS_TOKEN;

  if (!VERCEL_ACCESS_TOKEN) {
    throw new Error('VERCEL_ACCESS_TOKEN environment variable is required');
  }

  const response = await fetch(
    `https://api.vercel.com/v1/edge-config/${EDGE_CONFIG_ID}/items`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${VERCEL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            operation: 'upsert',
            key: key,
            value: data
          }
        ]
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to update Edge Config: ${response.status} ${errorData}`);
  }
}