# Deployment Checklist

This document outlines the steps to deploy Mario Health Frontend to production.

## Pre-Deployment Checklist

### 1. Supabase Setup

- [ ] Create Supabase project
- [ ] Set up database tables:
  - [ ] `providers` table
  - [ ] `procedures` table
  - [ ] `doctors` table
  - [ ] `test_locations` table
- [ ] Configure Row Level Security (RLS) policies
- [ ] Set up database indexes for performance
- [ ] Configure CORS settings in Supabase dashboard

### 2. Environment Variables

- [ ] Get Supabase project URL
- [ ] Get Supabase anonymous key
- [ ] Configure environment variables in Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Build Verification

- [ ] Run `npm run build` locally to verify build succeeds
- [ ] Check for TypeScript errors: `npx tsc --noEmit`
- [ ] Run linter: `npm run lint`
- [ ] Test production build locally: `npm run start`

## Vercel Deployment

### 1. Connect Repository

- [ ] Push code to GitHub/GitLab/Bitbucket
- [ ] Import project in Vercel dashboard
- [ ] Connect repository

### 2. Configure Build Settings

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### 3. Set Environment Variables

In Vercel project settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Deploy

- [ ] Trigger deployment
- [ ] Monitor build logs for errors
- [ ] Verify deployment URL works

## Post-Deployment

### 1. Verify Functionality

- [ ] Test homepage redirects to `/search`
- [ ] Test search functionality
- [ ] Test provider detail pages
- [ ] Test authentication flow (login/signup)
- [ ] Test mobile responsiveness

### 2. Performance

- [ ] Check Core Web Vitals in Vercel Analytics
- [ ] Verify images are optimized
- [ ] Check bundle size in build output

### 3. Monitoring

- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure analytics (Vercel Analytics, Google Analytics)
- [ ] Set up uptime monitoring

## Database Setup

### Required Tables

Run these SQL commands in Supabase SQL Editor:

```sql
-- Providers table
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialty TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  phone TEXT,
  website TEXT,
  rating NUMERIC(3,2),
  review_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Procedures table
CREATE TABLE procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  family TEXT,
  description TEXT,
  cpt_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doctors table
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  specialty TEXT,
  credentials TEXT,
  bio TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Test Locations table
CREATE TABLE test_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_providers_name ON providers(name);
CREATE INDEX idx_providers_specialty ON providers(specialty);
CREATE INDEX idx_providers_city ON providers(city);
CREATE INDEX idx_procedures_name ON procedures(name);
CREATE INDEX idx_procedures_category ON procedures(category);
```

### Row Level Security

```sql
-- Enable RLS
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_locations ENABLE ROW LEVEL SECURITY;

-- Public read access (adjust based on your requirements)
CREATE POLICY "Public read access" ON providers FOR SELECT USING (true);
CREATE POLICY "Public read access" ON procedures FOR SELECT USING (true);
CREATE POLICY "Public read access" ON doctors FOR SELECT USING (true);
CREATE POLICY "Public read access" ON test_locations FOR SELECT USING (true);
```

## Troubleshooting

### Build Errors

- Check TypeScript errors: `npx tsc --noEmit`
- Verify all imports are correct
- Check for missing environment variables

### Runtime Errors

- Check Vercel function logs
- Verify Supabase connection
- Check CORS configuration in Supabase

### Database Connection Issues

- Verify environment variables are set correctly
- Check Supabase project status
- Verify RLS policies allow public access (if needed)

## Rollback Procedure

1. Go to Vercel dashboard
2. Navigate to Deployments
3. Select previous working deployment
4. Click "Promote to Production"

## Next Steps

- Set up CI/CD pipeline
- Configure custom domain
- Set up staging environment
- Implement monitoring and alerting

