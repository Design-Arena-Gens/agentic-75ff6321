# Personal Agent Workspace

A Next.js web application that lets you orchestrate a lightweight personal AI agent without relying on external LLM services. Capture todos, jot quick notes, and draft automations using natural-language prompts. The agent maps your request to an internal function library and maintains state directly in the browser.

## Features

- Conversational interface that classifies intents (todos, notes, automations, summaries, help)
- Live state panels for open/completed tasks, notes, and drafted automations
- Latency simulation to mimic async agent behaviour for a more natural feel
- Fully client-side implementation — deploy ready for Vercel without environment secrets

## Tech Stack

- Next.js 14 (App Router)
- React 18 with client components for interactive experience
- TypeScript with strict typing for predictable state transitions

## Getting Started

```bash
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser. Type a request such as “add a todo to call the design team” to see the agent in action.

## Deployment

The project is configured for production builds on Vercel:

```bash
npm run build
npm start
```

Deploy with the provided Vercel token: `vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-75ff6321`.

## Roadmap Ideas

- Persist agent state to Supabase or local storage
- Wire automations to actual webhooks or scripts through API routes
- Integrate with an LLM provider for richer planning assistance
