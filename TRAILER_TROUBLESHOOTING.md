# Trailer Troubleshooting Guide

## Issue: Videos/Trailers Not Loading

If trailers are not showing up, here's how to diagnose and fix the issue:

## Step 1: Check Browser Console

Open your browser's developer console (F12) and look for error messages. You should see logs like:
- "Fetching movie title from OMDB for ID: ..."
- "Got title from OMDB: ..."
- "Searching YouTube for: ..."
- "YouTube API response: ..."

## Common Issues and Solutions

### Issue 1: YouTube API Key Invalid or Not Enabled

**Symptoms:**
- Console shows: "YouTube API failed: 403" or "400"
- Error message: "API key not valid" or "YouTube Data API v3 has not been used"

**Solution:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "YouTube Data API v3"
4. Create credentials (API Key)
5. Update `YOUTUBE_API_KEY` in `src/utlis/constants.js`

### Issue 2: YouTube API Quota Exceeded

**Symptoms:**
- Console shows: "YouTube API failed: 403"
- Error message: "Quota exceeded"

**Solution:**
- YouTube API free tier: 10,000 units/day
- Each search request costs 100 units
- Wait 24 hours for quota to reset, or upgrade to paid plan

### Issue 3: Movie Title Not Found

**Symptoms:**
- Console shows: "No title found for movie, cannot fetch trailer"
- OMDB API returns error

**Solution:**
- Check if OMDB API key is valid in `src/utlis/constants.js`
- Verify the movie ID format (should be IMDb ID like "tt0111161")

### Issue 4: No YouTube Videos Found

**Symptoms:**
- Console shows: "No trailer found for this movie"
- YouTube search returns empty results

**Solution:**
- The movie might not have a trailer on YouTube
- Try searching manually on YouTube to verify

## Testing the APIs

### Test OMDB API:
```javascript
// In browser console
fetch('http://www.omdbapi.com/?apikey=4fe26d2e&i=tt0111161')
  .then(r => r.json())
  .then(console.log)
```

### Test YouTube API:
```javascript
// In browser console (replace YOUR_KEY with your actual key)
fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&q=The Matrix trailer&key=YOUR_KEY&type=video&maxResults=1')
  .then(r => r.json())
  .then(console.log)
```

## Quick Fixes

1. **Check API Keys:**
   - OMDB Key: `src/utlis/constants.js` → `OMDB_KEY`
   - YouTube Key: `src/utlis/constants.js` → `YOUTUBE_API_KEY`

2. **Enable YouTube Data API v3:**
   - Go to: https://console.cloud.google.com/apis/library/youtube.googleapis.com
   - Click "Enable"

3. **Check Console Logs:**
   - Look for detailed error messages
   - The code now logs every step of the process

## What the Code Does

1. Gets movie title from OMDB using IMDb ID
2. Searches YouTube for "{movie title} official trailer"
3. Gets the first result
4. Displays it in an iframe

## Need More Help?

Check the browser console for specific error messages. The code now includes comprehensive logging to help diagnose issues.

