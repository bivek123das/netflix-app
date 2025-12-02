# TMDB API Setup Guide

## Issue: TMDB API Not Working

If your TMDB API is not working, the most common cause is an **expired or invalid Bearer token**.

## How to Fix

### Step 1: Get a New TMDB API Access Token

1. Go to [TMDB API Settings](https://www.themoviedb.org/settings/api)
2. Log in to your TMDB account (or create one if you don't have one)
3. Click on **"API"** in the left sidebar
4. Under **"API Read Access Token"**, click **"Create"**
5. Copy the generated token

### Step 2: Update Your Code

1. Open `src/utlis/constants.js`
2. Find the `API_OPTIONS` object
3. Replace the `Authorization` Bearer token with your new token:

```javascript
export const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: "Bearer YOUR_NEW_TOKEN_HERE",
  },
};
```

### Step 3: Restart Your Dev Server

1. Stop your current dev server (Ctrl+C)
2. Run `npm run dev` again
3. Refresh your browser

## Alternative: Using API Key Instead

If Bearer token doesn't work, you can use API Key method:

1. Get your API Key from [TMDB API Settings](https://www.themoviedb.org/settings/api)
2. Update `src/utlis/constants.js`:

```javascript
export const TMDB_API_KEY = "YOUR_API_KEY_HERE";

export const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
  },
};
```

3. Update all API calls to include `?api_key=${TMDB_API_KEY}` in the URL

## Testing Your API

Open browser console (F12) and check for:
- ✅ Success messages: "Now Playing Movies fetched successfully"
- ❌ Error messages: Will show the exact error from TMDB API

## Common Errors

- **401 Unauthorized**: Your token is invalid or expired
- **403 Forbidden**: Your token doesn't have the right permissions
- **429 Too Many Requests**: You're hitting rate limits (wait a bit)

## Need Help?

Check the browser console for detailed error messages. The app now displays errors on screen if the API fails.

