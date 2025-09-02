// Service for managing custom prompts with Edge Config Store

interface CustomPromptData {
  content: string;
  createdAt: string;
  updatedAt: string;
  name?: string;
}

interface CustomPromptResponse {
  success: boolean;
  data?: CustomPromptData;
  message?: string;
  error?: string;
}

class CustomPromptsService {
  private baseUrl = '/api/custom-prompts';

  // Get a custom prompt by key
  async getCustomPrompt(key = 'custom-prompt1'): Promise<CustomPromptData | null> {
    try {
      const response = await fetch(`${this.baseUrl}?key=${encodeURIComponent(key)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        return null; // No prompt found
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch custom prompt');
      }

      const result: CustomPromptResponse = await response.json();
      return result.data || null;
    } catch (error) {
      console.error('Error fetching custom prompt:', error);
      throw error;
    }
  }

  // Save a new custom prompt
  async saveCustomPrompt(
    content: string,
    name?: string,
    key = 'custom-prompt1'
  ): Promise<CustomPromptData> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          name,
          key,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save custom prompt');
      }

      const result: CustomPromptResponse = await response.json();
      if (!result.data) {
        throw new Error('No data returned from save operation');
      }

      return result.data;
    } catch (error) {
      console.error('Error saving custom prompt:', error);
      throw error;
    }
  }

  // Update an existing custom prompt
  async updateCustomPrompt(
    content: string,
    name?: string,
    key = 'custom-prompt1'
  ): Promise<CustomPromptData> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          name,
          key,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update custom prompt');
      }

      const result: CustomPromptResponse = await response.json();
      if (!result.data) {
        throw new Error('No data returned from update operation');
      }

      return result.data;
    } catch (error) {
      console.error('Error updating custom prompt:', error);
      throw error;
    }
  }

  // Save or update a custom prompt (handles both create and update)
  async saveOrUpdateCustomPrompt(
    content: string,
    name?: string,
    key = 'custom-prompt1'
  ): Promise<CustomPromptData> {
    try {
      // Try to get existing prompt first
      const existingPrompt = await this.getCustomPrompt(key);
      
      if (existingPrompt) {
        // Update existing prompt
        return await this.updateCustomPrompt(content, name, key);
      } else {
        // Create new prompt
        return await this.saveCustomPrompt(content, name, key);
      }
    } catch (error) {
      console.error('Error saving/updating custom prompt:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const customPromptsService = new CustomPromptsService();
export default customPromptsService;

// Export types
export type { CustomPromptData, CustomPromptResponse };