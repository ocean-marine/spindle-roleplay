# OpenAI Realtime Console

A modern, interactive console application demonstrating the power of the [OpenAI Realtime API](https://platform.openai.com/docs/guides/realtime) with [WebRTC](https://platform.openai.com/docs/guides/realtime-webrtc) for real-time AI conversations.

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- OpenAI API key - [create one in the dashboard here](https://platform.openai.com/settings/api-keys)

### Setup

First, configure your environment by creating a `.env` file from the example file and setting your API key:

```bash
cp .env.example .env
```

### Installation

Install the required dependencies:

```bash
npm install
```

### Running the Application

Start the development server:

```bash
npm run dev
```

The console application will be available at [http://localhost:3000](http://localhost:3000).

## Features

- 🚀 **Real-time AI Conversations**: Powered by OpenAI's Realtime API with WebRTC
- 🔧 **Function Calling**: Client-side function calling capabilities
- 📊 **Event Logging**: JSON payload viewer for debugging client and server events
- ⚡ **Modern Stack**: Built with Express.js, React, and Vite for optimal performance
- 🎯 **Minimal Template**: Clean, extensible architecture for your own implementations

## Architecture

This application uses a modern web stack:
- **Backend**: [Express.js](https://expressjs.com/) server for API endpoints
- **Frontend**: React application with [Vite](https://vitejs.dev/) for fast development and building
- **Real-time Communication**: WebRTC data channels for low-latency AI interactions

## Related Projects

For a more comprehensive example with advanced features, check out the [OpenAI Realtime Agents](https://github.com/openai/openai-realtime-agents) demo. It's built with Next.js and uses an agentic architecture inspired by [OpenAI Swarm](https://github.com/openai/swarm).

## Migration Notes

**WebSockets Version**: The previous version of this application used WebSockets (not recommended for browser environments). You can find it in the [websockets branch](https://github.com/openai/openai-realtime-console/tree/websockets) if needed for reference.

## License

MIT
