# YouTube API Quota Exceeded - Solutions

## Problem
You're getting a 403 error: "quotaExceeded" from YouTube Data API v3.

## Why This Happens
- **Free Tier Limit**: 10,000 units per day
- **Search Request Cost**: 100 units per request
- **Daily Limit**: ~100 searches per day
- **Reset Time**: Quota resets at midnight Pacific Time

## Solutions

### Solution 1: Wait for Quota Reset (Easiest)
- Wait until midnight Pacific Time (PST/PDT)
- Your quota will reset automatically
- The app will work again

### Solution 2: Use Multiple API Keys
1. Create additional Google Cloud projects
2. Get new API keys for each project
3. Rotate keys when quota is exceeded
4. Update `YOUTUBE_API_KEY` in `src/utlis/constants.js`

### Solution 3: Upgrade to Paid Plan
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable billing
3. Request quota increase
4. Costs: $0.10 per 1,000 additional units

### Solution 4: Optimize API Usage (Implemented)
The code now includes:
- ✅ Caching to prevent duplicate requests
- ✅ Fallback trailers for popular movies
- ✅ Better error handling
- ✅ Loading states

### Solution 5: Use Alternative Approach
Instead of YouTube API, you could:
- Use YouTube's oEmbed API (limited)
- Use direct YouTube search URLs
- Use a different video service

## Current Implementation

The code now:
1. **Caches trailers** - Won't refetch the same movie
2. **Has fallback trailers** - For popular movies like "The Matrix", "Inception", etc.
3. **Shows helpful errors** - Clear messages when quota is exceeded
4. **Prevents duplicate requests** - Uses loading state

## Check Your Quota

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Dashboard"
3. Select "YouTube Data API v3"
4. Check "Quotas" tab to see usage

## Temporary Workaround

For now, the app will:
- Use fallback trailers for popular movies
- Show error messages for other movies
- Continue working once quota resets

## Long-term Solution

Consider:
1. **Caching trailers** in localStorage or a database
2. **Pre-fetching trailers** during off-peak hours
3. **Using multiple API keys** and rotating them
4. **Upgrading to paid plan** if you need more quota

