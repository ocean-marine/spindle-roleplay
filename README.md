# OpenAI Realtime Console

This is an example application showing how to use the [OpenAI Realtime API](https://platform.openai.com/docs/guides/realtime) with [WebRTC](https://platform.openai.com/docs/guides/realtime-webrtc).

**🎯 Now fully migrated to TypeScript** - Enhanced with comprehensive type safety for improved development experience and code reliability.

## Installation and usage

Before you begin, you'll need an OpenAI API key - [create one in the dashboard here](https://platform.openai.com/settings/api-keys). Create a `.env` file from the example file and set your API key in there:

```bash
cp .env.example .env
```

Running this application locally requires [Node.js](https://nodejs.org/) to be installed. Install dependencies for the application with:

```bash
npm install
```

Start the application server with:

```bash
npm run dev
```

This should start the console application on [http://localhost:3000](http://localhost:3000).

### TypeScript Commands

For TypeScript development:

```bash
# Type checking
npm run type-check

# Linting (includes TypeScript files)
npm run lint
```

This application is a minimal template that uses [express](https://expressjs.com/) to serve the React + TypeScript frontend contained in the [`/client`](./client) folder. The server is configured to use [vite](https://vitejs.dev/) to build the React frontend with full TypeScript support.

This application shows how to send and receive Realtime API events over the WebRTC data channel and configure client-side function calling. You can also view the JSON payloads for client and server events using the logging panel in the UI.

## TypeScript Migration

This codebase has been fully migrated from JavaScript to TypeScript, providing:

- **Type Safety**: Comprehensive interface definitions for API responses, component props, and data structures
- **Better IDE Support**: Enhanced autocomplete, refactoring, and error detection
- **Runtime Error Reduction**: Catch type-related issues at build time instead of runtime
- **Improved Maintainability**: Self-documenting code with explicit type definitions

### Key TypeScript Features Added

- Full API typing with NextJS types
- Interface definitions for all data structures
- Strict TypeScript configuration
- Type-safe utility functions
- Proper typing for React components and hooks

For a more comprehensive example, see the [OpenAI Realtime Agents](https://github.com/openai/openai-realtime-agents) demo built with Next.js, using an agentic architecture inspired by [OpenAI Swarm](https://github.com/openai/swarm).

## Previous WebSockets version

The previous version of this application that used WebSockets on the client (not recommended in browsers) [can be found here](https://github.com/openai/openai-realtime-console/tree/websockets).

## License

MIT
