# Zohlar Server

This is a usecase for assistant-ui and langgraph, for a solar company called Zohlar. It's setup as a monorepo-style project, with `frontend` and `backend` directories.
The `frontend` directory contains a Next.js application which allows you to interact with the Zohlar agent via a chat interface.
The backend contains a LangGraph agent which powers the core functionality of the zohlar.

## Deployment

-

## Setup

To setup the zohlar, install dependencies from the root of the monorepo:

```bash
yarn install
```

This will install all dependencies required by both the frontend and backend projects. You can also run shared commands from the root of the project:

```bash
yarn format

yarn build
```

## Environment variables

### Backend

The backend requires Tavily and OpenAI API keys to run. Sign up here:

- Tavily: https://tavily.com/
- OpenAI: https://platform.openai.com/signup

Once you have your API keys, create a `.env` file in the [`./backend`](`./backend`) directory and add the following:

```bash
TAVILY_API_KEY=YOUR_API_KEY
OPENAI_API_KEY=YOUR_API_KEY
```

## Mock API

```bash
cd zohlar-server
yarn install
yarn dev
```

runs at `localhost:3000`

### Frontend

The frontend requires the production, or local deployment of your agent, along with a LangSmith API key (if calling the production endpoint), and finally the name of the agent to interact with (in this case `zohlar`).

For local development, you can find the API endpoint in the bottom left of LangGraph Studio, which defaults to `http://localhost:51497`. You can find the production URL in the deployment page of your LangGraph cloud deployment.

Then, set the variables in a `.env` file inside [`./frontend`](./frontend):

```bash
# Only required for production deployments
# LANGCHAIN_API_KEY=YOUR_API_KEY
LANGGRAPH_API_URL=https://example.com/api # Or your production URL
NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID=zohlar
```

## LangGraph Config

The LangGraph configuration file for the zohlar project is located inside [`./backend/langgraph.json`](./backend/langgraph.json). This file defines the zohlar graph implemented in the project: `zohlar`.

## Credits

This project was inspired by https://github.com/Yonom/assistant-ui-stockbroker by Brace Sproul & Simon Farshid
