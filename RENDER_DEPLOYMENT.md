# Deploy WealthWatch to Render.com

## Prerequisites
1. GitHub account with repository: https://github.com/joyjamesswamy/IA3-WEBTECH.git
2. Render.com account (sign up at https://render.com)
3. MongoDB Atlas account (for database)

## Step 1: Set up MongoDB Atlas (if not already done)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or log in
3. Create a new cluster (free tier available)
4. Click "Connect" → "Connect your application"
5. Copy your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/wealthwatch`)
6. Replace `<password>` with your actual password

## Step 2: Deploy to Render.com

### Option A: Using the Render Dashboard (Recommended)

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Click "New +" button → "Web Service"

2. **Connect GitHub Repository**
   - Select "Build and deploy from a Git repository"
   - Click "Connect" next to GitHub
   - Authorize Render to access your repositories
   - Select repository: `joyjamesswamy/IA3-WEBTECH`

3. **Configure the Web Service**
   - **Name**: `wealthwatch` (or any name you prefer)
   - **Region**: Choose closest to you (e.g., Oregon, Frankfurt)
   - **Branch**: `main`
   - **Root Directory**: leave blank
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable":
   
   - **MONGODB_URI**: Your MongoDB Atlas connection string
     ```
     mongodb+srv://username:password@cluster.mongodb.net/wealthwatch
     ```
   
   - **NODE_ENV**: `production`
   
   - **PORT**: `10000` (Render uses port 10000 by default)

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your app
   - Wait for deployment to complete (5-10 minutes)
   - Your app will be available at: `https://wealthwatch.onrender.com` (or your chosen name)

### Option B: Using render.yaml (Blueprint)

1. The `render.yaml` file is already in your repository
2. Go to Render Dashboard → "New +" → "Blueprint"
3. Connect your repository
4. Render will detect the `render.yaml` file
5. Add environment variables when prompted
6. Click "Apply"

## Step 3: Verify Deployment

1. Visit your Render app URL
2. Check the logs in Render dashboard if there are issues
3. Test the application functionality

## Important Notes

### Free Tier Limitations
- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- 750 hours/month free (enough for one service)

### Environment Variables to Set
Make sure these are configured in Render:
- `MONGODB_URI` - Your MongoDB connection string
- `NODE_ENV` - Set to `production`
- `PORT` - Set to `10000`

### Custom Domain (Optional)
1. Go to your service settings
2. Click "Custom Domains"
3. Follow instructions to add your domain

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

### App Crashes
- Check application logs
- Verify MongoDB connection string is correct
- Ensure all environment variables are set

### Database Connection Issues
- Whitelist Render's IP addresses in MongoDB Atlas (0.0.0.0/0 for all IPs)
- Verify MongoDB connection string format
- Check database user permissions

## Updating Your App

After pushing changes to GitHub:
1. Render auto-deploys from the `main` branch
2. Or manually trigger deploy from Render dashboard
3. Monitor deployment progress in logs

## Support

- Render Docs: https://render.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- GitHub Issues: https://github.com/joyjamesswamy/IA3-WEBTECH/issues
