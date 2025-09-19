# 🚀 Vercel Deployment Guide

## Prerequisites

1. Vercel account (sign up at [vercel.com](https://vercel.com))
2. GitHub repository access
3. Environment variables ready

## Step-by-Step Deployment

### 1. Connect Repository

1. **Login to Vercel Dashboard**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "New Project" button
   - Select "Import Git Repository"
   - Choose your repository from the list
   - Click "Import"

### 2. Configure Build Settings

- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Environment Variables

Add the following environment variables in Vercel dashboard:

```env
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
VITE_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID
VITE_INFURA_API_KEY=YOUR_INFURA_API_KEY
VITE_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
```

### 4. Deploy Application

1. **Automatic Deployment**
   - Vercel automatically deploys on push to main branch
   - Manual deployment available in dashboard

2. **Manual Deployment**
   - Go to "Deployments" tab
   - Click "Redeploy" on latest deployment

### 5. Custom Domain (Optional)

1. **Add Custom Domain**
   - Go to "Settings" → "Domains"
   - Enter your custom domain
   - Follow DNS configuration instructions

### 6. Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Test wallet connection functionality
- [ ] Verify contract interactions work
- [ ] Check responsive design on mobile
- [ ] Test donation flow end-to-end
- [ ] Verify SSL certificate is active

### 7. Troubleshooting

#### Common Issues:

1. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

2. **Environment Variables Not Working**
   - Ensure variables start with `VITE_` prefix
   - Check variable names match exactly
   - Redeploy after adding new variables

3. **Wallet Connection Issues**
   - Verify WalletConnect Project ID is correct
   - Check RPC URL is accessible
   - Ensure contract address is deployed

### 8. Performance Optimization

1. **Enable Vercel Edge Functions**
   - Go to "Functions" tab
   - Enable edge runtime for better performance

2. **Image Optimization**
   - Use Vercel's built-in image optimization
   - Implement lazy loading for images

### 9. Security Considerations

1. **Environment Variables**
   - Never commit sensitive keys to repository
   - Use Vercel's environment variable encryption
   - Rotate keys regularly

2. **HTTPS Only**
   - Vercel provides automatic HTTPS
   - Ensure all external requests use HTTPS

## Support

For additional help:
- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- GitHub Issues: Create an issue in the repository
- Community Support: [vercel.com/help](https://vercel.com/help)