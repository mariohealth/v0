# Deployment Checklist

This checklist ensures a smooth deployment to production.

## 📋 Pre-Deployment Checks

### Code Quality
- [ ] All tests passing (`npm run test`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No linting errors (`npm run lint`)
- [ ] No console errors in browser DevTools
- [ ] No critical warnings in build output

### Environment Configuration
- [ ] `.env.local` file exists with all required variables:
  - [ ] `NEXT_PUBLIC_API_URL` set to production backend URL
  - [ ] `NEXT_PUBLIC_USE_MOCK_API` set to `false`
  - [ ] All other environment variables configured
- [ ] Verify API URL is accessible and returns 200 OK
- [ ] Test API endpoints manually (see Testing section below)

### Functional Testing
- [ ] All pages load without errors
- [ ] Search functionality works
- [ ] Category navigation works
- [ ] Family navigation works
- [ ] Procedure detail pages load
- [ ] Mobile responsive verified on multiple devices
- [ ] No 404 errors in console
- [ ] No CORS errors in console

### Performance
- [ ] Lighthouse score > 90 for performance
- [ ] API response times < 1000ms
- [ ] No slow API calls (>1000ms) in DevTools
- [ ] Bundle size reasonable (<5MB)

## 🚀 Vercel Deployment Steps

### 1. Environment Variables Setup

Before deploying, configure these environment variables in Vercel:

```bash
# Required
NEXT_PUBLIC_API_URL=https://mario-health-api-72178908097.us-central1.run.app
NEXT_PUBLIC_USE_MOCK_API=false

# Optional - Add these if needed
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_API_MAX_RETRIES=3
NEXT_PUBLIC_API_RETRY_DELAY=1000
```

**How to set in Vercel:**
1. Go to your project in Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable for **Production** environment
4. Save changes

### 2. Build Configuration

Verify these in `package.json`:

```json
{
  "scripts": {
    "build": "next build",
    "start": "next start"
  }
}
```

Vercel automatically detects Next.js and uses these commands.

### 3. Deploy Command

```bash
# Make sure you're on the main branch
git checkout main

# Pull latest changes
git pull origin main

# Push to trigger Vercel deployment
git push origin main
```

Or deploy from Vercel dashboard:
1. Go to your project
2. Click **Deployments** tab
3. Click **Redeploy** on latest deployment

## ✅ Post-Deployment Verification

### Immediate Checks (First 5 minutes)

1. **Check Deployment Status**
   - [ ] Build completed successfully
   - [ ] No build errors in Vercel logs
   - [ ] Deployment shows as "Ready"

2. **Test Application URLs**
   - [ ] Homepage loads: `https://your-app.vercel.app/`
   - [ ] Search page loads: `https://your-app.vercel.app/search`
   - [ ] Category pages load: `https://your-app.vercel.app/category/[slug]`
   - [ ] Family pages load: `https://your-app.vercel.app/family/[slug]`
   - [ ] Procedure pages load: `https://your-app.vercel.app/procedure/[slug]`

3. **Check Browser Console**
   - [ ] No 500 errors in console
   - [ ] No CORS errors
   - [ ] No failed API calls
   - [ ] No resource loading errors

4. **Check Vercel Logs**
   - [ ] No server errors in logs
   - [ ] No runtime exceptions
   - [ ] Build output clean

### Functional Testing (First 30 minutes)

1. **API Integration**
   - [ ] Visit `/api-status` page (if available in prod)
   - [ ] Test search functionality
   - [ ] Test category navigation
   - [ ] Test family navigation
   - [ ] Test procedure detail pages
   - [ ] Check API response times in DevTools

2. **Mobile Testing**
   - [ ] Test on mobile device
   - [ ] Test on tablet
   - [ ] Verify touch targets are adequate
   - [ ] Check pull-to-refresh works
   - [ ] Test keyboard interactions

3. **Edge Cases**
   - [ ] Test with slow 3G network (Network Throttling in DevTools)
   - [ ] Test with no internet (offline mode)
   - [ ] Test error handling (404, 500 pages)
   - [ ] Test search with no results

## 🔄 Rollback Plan

If deployment fails or critical issues are discovered:

### Quick Rollback (Vercel)

1. **Via Vercel Dashboard:**
   - Go to **Deployments** tab
   - Find the previous working deployment
   - Click **"..."** → **Promote to Production**

2. **Via CLI:**
   ```bash
   vercel promote [deployment-url]
   ```

### Database Rollback

If backend database changes are involved:
- [ ] Contact backend team to rollback schema changes
- [ ] Restore database backup if necessary
- [ ] Verify API endpoints still work

### Communication

- [ ] Notify team about rollback
- [ ] Document the issue in GitHub Issues
- [ ] Create follow-up ticket for fixes
- [ ] Update status page if applicable

## 📝 Post-Deployment Tasks

After successful deployment:

- [ ] Update changelog with deployed version
- [ ] Tag release in Git: `git tag v1.0.0 && git push --tags`
- [ ] Notify stakeholders of deployment
- [ ] Monitor error tracking service (if configured)
- [ ] Check analytics for unusual patterns
- [ ] Update project documentation if needed

## 🔍 Monitoring

### What to Watch (First 24 Hours)

1. **Error Rates**
   - Check Vercel error logs
   - Monitor browser console errors
   - Watch for API errors in DevTools

2. **Performance**
   - Monitor API response times
   - Check for slow database queries
   - Watch for memory leaks

3. **User Feedback**
   - Monitor support channels
   - Check social media mentions
   - Review analytics for unusual behavior

## 🆘 Emergency Contacts

- **Frontend Lead**: Arman
- **Backend Lead**: AC
- **DevOps**: DS
- **Vercel Support**: support@vercel.com

## 📚 Additional Resources

- [Vercel Deployment Docs](https://vercel.com/docs/deployments/overview)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [API Integration Guide](./INTEGRATION_GUIDE.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
