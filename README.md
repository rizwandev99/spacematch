# spacematch

AI-powered office space finder for startups.

Search for office space in San Francisco, New York, and Boston using natural language. Powered by AI that understands what your team actually needs.

![spacematch screenshot](https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80)

## Features

- 🔍 **AI Search** — Describe what you need in plain English, get matched listings with reasoning
- 🏢 **40+ Listings** — Verified office spaces across SF, NYC, and Boston with real pricing
- 📊 **Compare** — Side-by-side comparison of your top picks
- 💾 **Save** — Bookmark listings for later
- 📅 **Book Tours** — Request tours directly through the app
- 📱 **Responsive** — Works on mobile, tablet, and desktop

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Backend**: tRPC, Next.js API Routes
- **Database**: PostgreSQL (Neon) + Drizzle ORM
- **AI**: Vercel AI SDK + OpenAI (GPT-4o-mini)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) database (free tier works)
- An [OpenAI](https://platform.openai.com) API key

### Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/spacematch.git
cd spacematch

# Install dependencies
npm install

# Copy env file and add your credentials
cp .env.example .env.local

# Push the schema to your database
npx drizzle-kit push

# Seed the database with sample listings
npx tsx scripts/seed.ts

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/          # Next.js pages and API routes
├── components/   # React components
├── db/           # Drizzle schema and database connection
├── hooks/        # Custom React hooks
├── lib/          # Utilities and constants
├── server/       # tRPC routers
└── trpc/         # tRPC client setup
```

## How the AI Search Works

The app uses Vercel AI SDK's tool-calling feature. When a user types a natural language query:

1. The message is sent to GPT-4o-mini with a system prompt
2. The AI decides to call the `searchListings` tool with structured parameters (city, budget, team size, etc)
3. The tool queries the Postgres database via Drizzle ORM
4. Results are returned to the AI, which writes a natural language summary explaining why each listing matches
5. The response streams back to the frontend in real-time

## License

MIT
