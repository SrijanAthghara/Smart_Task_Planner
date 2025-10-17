# 🚀 Deployment Guide - Smart Task Planner

This guide covers deploying your Smart Task Planner to Vercel (frontend) and Railway/Render (backend).

## 📋 Deployment Overview

### Architecture
- **Frontend**: Vercel (React app)
- **Backend**: Railway/Render (Node.js API)
- **Database**: MongoDB Atlas (cloud)

---

## 🌐 Frontend Deployment (Vercel)

### Option 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub** (already done!)
   ```bash
   git add .
   git commit -m "🚀 Prepare for Vercel deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import `Smart_Task_Planner` repository
   - Configure project settings:
     - **Framework Preset**: Vite
     - **Root Directory**: `client`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Add Environment Variables in Vercel**
   - In your Vercel dashboard → Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd client
   vercel --prod
   ```

---

## 🖥️ Backend Deployment Options

### Option A: Railway (Recommended - Simple)

1. **Go to [railway.app](https://railway.app)**
2. **Sign in with GitHub**
3. **New Project → Deploy from GitHub repo**
4. **Select your repository**
5. **Configure**:
   - **Root Directory**: `server`
   - **Start Command**: `npm start`
6. **Add Environment Variables**:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   OPENAI_API_KEY=your_openai_api_key
   PORT=3002
   NODE_ENV=production
   ```

### Option B: Render

1. **Go to [render.com](https://render.com)**
2. **Sign in with GitHub**
3. **New Web Service → Connect repository**
4. **Configure**:
   - **Environment**: Node
   - **Region**: Choose closest to your users
   - **Branch**: main
   - **Root Directory**: server
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Add Environment Variables** (same as Railway)

### Option C: Heroku

1. **Install Heroku CLI**
2. **Create Heroku app**:
   ```bash
   heroku create your-app-name-api
   ```
3. **Set environment variables**:
   ```bash
   heroku config:set MONGODB_URI=your_connection_string
   heroku config:set OPENAI_API_KEY=your_api_key
   heroku config:set NODE_ENV=production
   ```
4. **Deploy**:
   ```bash
   git subtree push --prefix server heroku main
   ```

---

## 🔧 Final Configuration Steps

### 1. Update Frontend API URL

After deploying your backend, update the frontend:

**In Vercel Dashboard**:
- Environment Variables → Edit `VITE_API_URL`
- Set to: `https://your-backend-deployment-url.com/api`
- Redeploy frontend

### 2. Update CORS Configuration

In your `server/index.js`, update CORS for production:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3003', 
    'https://your-vercel-app.vercel.app' // Add your Vercel URL
  ],
  credentials: true
};
```

### 3. Test Your Deployment

1. **Frontend**: Visit your Vercel URL
2. **Backend**: Test API endpoints at your backend URL
3. **Full Integration**: Create tasks, test AI features

---

## 🔒 Security Checklist

### Environment Variables
- ✅ `MONGODB_URI` - Set in backend deployment
- ✅ `OPENAI_API_KEY` - Set in backend deployment  
- ✅ `VITE_API_URL` - Set in frontend deployment
- ✅ `NODE_ENV=production` - Set in backend

### Domain Configuration
- ✅ Update CORS origins with your domain
- ✅ Set secure headers in production
- ✅ Enable HTTPS (automatic on Vercel/Railway)

---

## 📊 Monitoring & Performance

### Vercel Analytics
- Enable in Vercel dashboard for frontend metrics

### Backend Monitoring
- **Railway**: Built-in metrics dashboard
- **Render**: Resource usage monitoring
- **Heroku**: Use Heroku metrics add-ons

---

## 🚨 Troubleshooting

### Common Issues

**1. CORS Errors**
- Update CORS origins in server configuration
- Ensure frontend URL is whitelisted

**2. API Connection Failed**
- Check `VITE_API_URL` environment variable
- Verify backend deployment is successful
- Test API endpoints directly

**3. Database Connection**
- Verify MongoDB Atlas IP whitelist (set to 0.0.0.0/0 for cloud deployment)
- Check connection string format

**4. Build Failures**
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check build logs for specific errors

---

## 🎯 Production URLs

After deployment, your URLs will be:

- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-backend.railway.app` (or your chosen provider)
- **API Base**: `https://your-backend.railway.app/api`

---

## 💡 Pro Tips

1. **Use Preview Deployments**: Vercel creates preview URLs for each commit
2. **Monitor Costs**: Keep an eye on usage for your chosen backend provider
3. **Set up CI/CD**: Automatic deployments on git push
4. **Use Environment Branches**: Different configs for staging/production
5. **Enable Caching**: Configure appropriate cache headers

---

## 🔄 Updating Your App

### For Code Changes:
```bash
git add .
git commit -m "✨ New feature description"
git push origin main
# Vercel auto-deploys, backend providers usually auto-deploy too
```

### For Environment Variables:
- Update in respective platform dashboards
- Redeploy if necessary

---

**🎉 Your Smart Task Planner is now live and accessible worldwide!**