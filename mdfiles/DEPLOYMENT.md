# Deployment Guide for Passy

This guide will help you deploy Passy to production.

## Prerequisites

- Firebase CLI installed: `npm install -g firebase-tools`
- Vercel account (or other hosting provider)
- Domain name (optional)

## Firebase Setup

### 1. Initialize Firebase

```bash
firebase login
firebase init
```

Select:
- Firestore
- Hosting (optional)

### 2. Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### 3. Deploy Firestore Indexes

```bash
firebase deploy --only firestore:indexes
```

### 4. Configure Firebase Authentication

1. Go to Firebase Console → Authentication
2. Enable Email/Password sign-in method
3. Configure authorized domains (add your production domain)

### 5. Security Checklist

- [ ] Update Firestore rules for production
- [ ] Enable App Check (optional but recommended)
- [ ] Set up budget alerts in Firebase Console
- [ ] Configure Firebase quota limits
- [ ] Enable Firebase Analytics (optional)

## Vercel Deployment

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Deploy to Vercel

```bash
# First deployment
vercel

# Production deployment
vercel --prod
```

### 3. Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

### 4. Custom Domain (Optional)

1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Add domain to Firebase authorized domains

## Alternative Hosting Options

### Netlify

```bash
npm run build
# Upload 'out' folder to Netlify
```

### Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

### Docker (Self-hosted)

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t passy .
docker run -p 3000:3000 passy
```

## Post-Deployment Checklist

- [ ] Test authentication flow
- [ ] Create test event and verify all features
- [ ] Check real-time updates work
- [ ] Test on mobile devices
- [ ] Verify email notifications (if implemented)
- [ ] Monitor Firebase usage and costs
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure analytics
- [ ] Test sharing functionality
- [ ] Verify security rules are working

## Monitoring

### Firebase Console

- Monitor authentication metrics
- Check Firestore usage
- Review security rule logs

### Vercel Analytics

- Enable Vercel Analytics for performance insights
- Set up Web Vitals monitoring

### Error Tracking

Consider adding Sentry:

```bash
npm install @sentry/nextjs
```

## Performance Optimization

1. **Enable Static Generation where possible**
2. **Optimize images** - Use Next.js Image component
3. **Code splitting** - Already handled by Next.js
4. **CDN caching** - Configured automatically with Vercel
5. **Compress assets** - Enable in hosting platform

## Security Best Practices

1. **Never commit** `.env.local` files
2. **Rotate API keys** regularly
3. **Use environment variables** for all secrets
4. **Enable HTTPS only** in production
5. **Review Firestore rules** regularly
6. **Implement rate limiting** for API calls
7. **Enable Firebase App Check** for production

## Cost Optimization

### Firebase Free Tier Limits

- **Authentication:** 10,000 verifications/month
- **Firestore:** 50,000 reads/day, 20,000 writes/day
- **Storage:** 5 GB

### Tips to Stay in Free Tier

1. Implement pagination for large lists
2. Use Firebase caching where appropriate
3. Optimize Firestore queries
4. Compress images before upload
5. Monitor usage in Firebase Console

## Troubleshooting

### Common Issues

**Issue:** "Permission denied" errors
- **Solution:** Check Firestore security rules

**Issue:** Authentication not working
- **Solution:** Verify authorized domains in Firebase Console

**Issue:** Environment variables not loading
- **Solution:** Ensure variables are prefixed with `NEXT_PUBLIC_`

**Issue:** Build fails on Vercel
- **Solution:** Check Node.js version compatibility

## Rollback Procedure

If deployment fails:

1. Revert to previous Vercel deployment in dashboard
2. Or redeploy previous git commit:
   ```bash
   git revert HEAD
   git push
   ```

## Support

For issues or questions:
- Check Firebase documentation
- Review Next.js deployment docs
- Open an issue in the repository

---

Happy deploying! 🚀


