/**
 * Groq API integration for Kimi K2 instruction generation
 * Now uses secure backend API endpoint instead of client-side API calls
 */

class GroqService {
  constructor() {
    // Backend API endpoint for secure GROQ processing
    this.apiEndpoint = '/api/groq';
  }

  async generateInstructions(prompt) {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.content || '';
    } catch (error) {
      console.error('Groq API request failed:', error);
      throw error;
    }
  }

  async generateDetailedInstructions(context = '') {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.content || '';
    } catch (error) {
      console.error('Groq API request failed:', error);
      throw error;
    }
  }
}

export default new GroqService();