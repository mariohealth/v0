# Mario Health Frontend

Healthcare price comparison platform built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mario-health-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── (auth)/          # Authentication routes
│   ├── (main)/          # Main application routes
│   └── layout.tsx       # Root layout
├── components/          # React components
│   ├── ui/              # shadcn/ui components
│   └── mario-*.tsx      # Mario Health components
├── lib/                 # Utility functions
│   ├── api/             # API functions
│   ├── supabase/        # Supabase clients
│   └── utils.ts         # Helper functions
└── types/               # TypeScript types
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |

## Features

- **Universal Search**: Search across providers, procedures, and doctors
- **Provider Details**: View provider information, ratings, and appointments
- **Authentication**: Login and signup with Supabase Auth
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type Safety**: Full TypeScript coverage

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.

## License

Private - Mario Health
