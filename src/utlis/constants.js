export const BG_URL = "https://assets.nflxext.com/ffe/siteui/vlv3/fc164b4b-f085-44ee-bb7f-ec7df8539eff/d23a1608-7d90-4da1-93d6-bae2fe60a69b/IN-en-20230814-popsignuptwoweeks-perspective_alpha_website_large.jpg";

export const USER_AVATAR =  "https://occ-0-6247-2164.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABdpkabKqQAxyWzo6QW_ZnPz1IZLqlmNfK-t4L1VIeV1DY00JhLo_LMVFp936keDxj-V5UELAVJrU--iUUY2MaDxQSSO-0qw.png?r=e6e";

export const LOGO = 'https://cdn.cookielaw.org/logos/dd6b162f-1a32-456a-9cfe-897231c7763c/4345ea78-053c-46d2-b11e-09adaef973dc/Netflix_Logo_PMS.png';

// Movie Database API Configuration
// Using OMDB API (Open Movie Database) - Free alternative to TMDB
// You already have an API key: 4fe26d2e
// Get a new key from: http://www.omdbapi.com/apikey.aspx

export const OMDB_KEY = "559ba13e";
export const OMDB_BASE_URL = "http://www.omdbapi.com";

// For movie lists, we'll use a combination of OMDB search with popular movie titles
// OMDB doesn't have "now playing" or "popular" endpoints, so we'll use search with popular titles
export const POPULAR_MOVIE_TITLES = [
  "The Matrix", "Inception", "Interstellar", "The Dark Knight", "Pulp Fiction",
  "Fight Club", "Forrest Gump", "The Godfather", "Titanic", "Avatar",
  "Jurassic Park", "Star Wars", "The Avengers", "Iron Man", "Spider-Man",
  "Batman", "Superman", "Wonder Woman", "Black Panther", "Avengers: Endgame"
];

// Image base URL - OMDB provides poster URLs directly in responses
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"; // Keep TMDB images as fallback

export const YOUTUBE_API_KEY = "AIzaSyDYJxNEcvuY_AwmV6UYJtDfBIUjbHFV_NQ";

// Fallback trailer IDs for when YouTube API quota is exceeded
// These are official trailer video IDs from YouTube
export const FALLBACK_TRAILERS = {
  // Popular movies
  "The Matrix": "vKQi3bBA1y8",
  "Inception": "YoHD9XEInc0",
  "Interstellar": "zSWdZVtXT7E",
  "The Dark Knight": "EXeTwQWrcwY",
  "Pulp Fiction": "s7EdQ4FqbhY",
  "Fight Club": "qtRKdVHc-cE",
  "Forrest Gump": "bLvqoHBptjg",
  "The Godfather": "sY1S34973zA",
  "Titanic": "zCy5WQ9S4c0",
  "Avatar": "d9MyW72ELq0",
  "Jurassic Park": "lc0Ueh4mRu4",
  "Star Wars": "vZ734NWnAHA",
  "The Avengers": "eOrNdBpGMv8",
  "Iron Man": "8hYlB38asDY",
  "Spider-Man": "t06RUxPbp_c",
  "Batman": "EXeTwQWrcwY",
  "Superman": "T6DJcgm3wNY",
  "Wonder Woman": "1Q8fG0TtVUA",
  "Black Panther": "xjDjIWPwcPU",
  "Avengers: Endgame": "TcMBFSGVi1c",
  
  // Top rated movies
  "The Shawshank Redemption": "6hB3S9bIaco",
  "Schindler's List": "gG22XNhtnoY",
  "12 Angry Men": "A7CBjt0olGY",
  "The Lord of the Rings: The Return of the King": "r5X-hFf6Bwo",
  "The Good, the Bad and the Ugly": "WCN5JJY_wiw",
  "Goodfellas": "qo5jJpHtI1Y",
  "The Lord of the Rings: The Fellowship of the Ring": "V75dMMIW2B4",
  "Star Wars: Episode V - The Empire Strikes Back": "JNwNXF9Y6kY",
  "The Lord of the Rings: The Two Towers": "LbfMDwc4azU",
  "The Matrix Reloaded": "kYzz0FSgpSU",
  "One Flew Over the Cuckoo's Nest": "OXrcDonY-Bg",
  "Se7en": "znmZoVkCjpI",
  "The Silence of the Lambs": "W6Mm1S5lz3k",
  
  // Upcoming/Recent movies
  "Dune": "n9xhJrPXop4",
  "No Time to Die": "BIh2BtSR7w8",
  "Spider-Man: No Way Home": "JfVOs4VSpmA",
  "The Batman": "mqqft2x_Aa4",
  "Top Gun: Maverick": "giXco2jaZ_4",
  "Doctor Strange in the Multiverse of Madness": "aWzlQ2N6qqg",
  "Thor: Love and Thunder": "Go8nTmfrQd8",
  "Black Widow": "ybji16u608U",
  "Eternals": "x_me3xsvDgk",
  "Shang-Chi and the Legend of the Ten Rings": "8YjFbMbfXaQ",
  "Venom: Let There Be Carnage": "-FmWuCgJmxo",
  "Fast & Furious 9": "aSiDu3Ywi8E",
  "A Quiet Place Part II": "BpdDN9d9gho",
  "Godzilla vs. Kong": "odM92ap8_c0",
  "Cruella": "gmRKv7n2If8",
  "Jungle Cruise": "f_HvoipF8A8",
  "Free Guy": "X2m-08cOAbc",
  "The Suicide Squad": "eg5ciqQzmK0",
  "Joker": "zAGVQLHvwOY",
  "1917": "gZjQROMAc_s",
  
  // Popular Indian and International movies
  "Animal": "gqY3A3vXjqI",
  "National Lampoon's Animal House": "gqY3A3vXjqI", // Use same trailer for Animal House
  "Pathaan": "vqu4z34wENs",
  "Jawan": "AtwgGc1Hj0c",
  "Gadar 2": "rL1l5b3KJ5Y",
  "RRR": "f_vbAtjYHbY",
  "Baahubali": "sOEgG5yej_0",
  "Baahubali 2": "G62HrubdD6o",
  "KGF": "qXgF-iJ_ezM",
  "KGF 2": "jNQXAC9IVRw",
  "Pushpa": "Q1NKMph3-c8",
  "Dangal": "x_7YlGv9u1g",
  "3 Idiots": "K0eXloy9FGo",
  "Lagaan": "oSIGXn0Hlqw",
  "Dilwale Dulhania Le Jayenge": "h5EofwRzit0",
  "Kabhi Khushi Kabhie Gham": "hG6oy46qKE4"
};

// Helper function to find fallback trailer by matching movie title
export const findFallbackTrailer = (movieTitle) => {
  if (!movieTitle) return null;
  
  const titleLower = movieTitle.toLowerCase().trim();
  
  // Direct match first
  if (FALLBACK_TRAILERS[movieTitle]) {
    return FALLBACK_TRAILERS[movieTitle];
  }
  
  // Try to find partial matches
  for (const [key, value] of Object.entries(FALLBACK_TRAILERS)) {
    const keyLower = key.toLowerCase();
    
    // Check if title contains key or key contains title
    if (titleLower.includes(keyLower) || keyLower.includes(titleLower)) {
      return value;
    }
    
    // Check for common variations (remove colons, extra spaces, apostrophes, etc.)
    const normalizedTitle = titleLower
      .replace(/['"]/g, '') // Remove apostrophes and quotes
      .replace(/[:\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const normalizedKey = keyLower
      .replace(/['"]/g, '') // Remove apostrophes and quotes
      .replace(/[:\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (normalizedTitle.includes(normalizedKey) || normalizedKey.includes(normalizedTitle)) {
      return value;
    }
    
    // Extract significant words (ignore common words like "the", "a", "an", "of", etc.)
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 's', 'national', 'lampoon'];
    const titleWords = normalizedTitle
      .split(' ')
      .filter(w => w.length > 2 && !stopWords.includes(w));
    const keyWords = normalizedKey
      .split(' ')
      .filter(w => w.length > 2 && !stopWords.includes(w));
    
    // Check if any significant word matches
    const matchingWords = titleWords.filter(word => keyWords.includes(word));
    
    // If we have matching significant words, return the fallback
    // For single-word keys like "Animal", match if the word appears in the title
    if (keyWords.length === 1 && titleWords.includes(keyWords[0])) {
      return value;
    }
    
    // For multi-word keys, require at least one significant word match
    if (matchingWords.length >= 1 && keyWords.length > 0) {
      return value;
    }
  }
  
  return null;
};

// API Options for OMDB
export const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
  },
};

export const SUPPORTED_LANGUAGES = [
  {identifier:'en',name:'English'},
  {identifier:'hindi',name:'Hindi'},
  {identifier:'spanish',name:'Spanish'}
];