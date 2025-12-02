import { useDispatch, useSelector } from "react-redux";
import { addMovieTrailer } from "../utlis/store/movieSlice";
import { useEffect, useState, useRef } from "react";
import { YOUTUBE_API_KEY, OMDB_BASE_URL, OMDB_KEY, API_OPTIONS, findFallbackTrailer } from "../utlis/constants";
import { addTrailerMovie, setTrailerError } from "../utlis/store/gptSlice";


const useMovieTrailerVideo = (trailerId, isTrailer = true, movieTitle = null)=>{
  
    const dispatch = useDispatch();
    const trailer = useSelector(store => store.movies.trailerVideo);
    const trailerVideoOne = useSelector(store => store.gpt.trailerVideoOne);
    const [isFetching, setIsFetching] = useState(false);
    const hasFetchedRef = useRef(false);
    const lastTrailerIdRef = useRef(null);

  const getMovieTrailer = async () => {
    if (!trailerId) {
      console.warn("No trailerId provided");
      return;
    }

    // Prevent multiple simultaneous fetches
    if (isFetching) {
      console.log("Already fetching trailer, skipping...");
      return;
    }

    setIsFetching(true);
    try {
      // Since OMDB doesn't provide trailers, we'll use YouTube API to search for trailers
      // First, get movie title from OMDB if not provided
      let title = movieTitle;
      
      if (!title) {
        console.log("Fetching movie title from OMDB for ID:", trailerId);
        const omdbResponse = await fetch(
          `${OMDB_BASE_URL}/?apikey=${OMDB_KEY}&i=${trailerId}`,
          API_OPTIONS
        );
        
        if (!omdbResponse.ok) {
          console.error("OMDB response not OK:", omdbResponse.status);
          throw new Error(`OMDB API failed: ${omdbResponse.status}`);
        }
        
        const omdbData = await omdbResponse.json();
        console.log("OMDB response:", omdbData);
        
        if (omdbData.Response === "True" && omdbData.Title) {
          title = omdbData.Title;
          console.log("Got title from OMDB:", title);
        } else {
          console.error("OMDB returned error:", omdbData.Error);
        }
      } else {
        console.log("Using provided title:", title);
      }
      
      if (!title) {
        console.error("No title available for trailer search");
        if (!isTrailer) {
          dispatch(setTrailerError("No trailer available for this movie."));
        }
        return;
      }
      
      // Search YouTube for trailer
      const searchQuery = `${title} official trailer`;
      console.log("Searching YouTube for:", searchQuery);
      
      // Check for fallback BEFORE making API call if we know quota is likely exceeded
      // This prevents unnecessary API calls
      const fallbackIdPreCheck = findFallbackTrailer(title);
      if (fallbackIdPreCheck) {
        console.log("⚠️ YouTube API quota likely exceeded. Using fallback trailer immediately for:", title);
        const trailerData = {
          id: fallbackIdPreCheck,
          key: fallbackIdPreCheck,
          name: `${title} - Official Trailer`,
          type: "Trailer",
          site: "YouTube",
          size: 1080,
          isFallback: true
        };
        
        if(isTrailer){
          dispatch(addMovieTrailer(trailerData));
        } else{
          dispatch(addTrailerMovie(trailerData));
        }
        return; // Skip API call entirely
      }
      
      const youtubeResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&key=${YOUTUBE_API_KEY}&type=video&maxResults=1&videoEmbeddable=true`
      );
      
      if (!youtubeResponse.ok) {
        const errorText = await youtubeResponse.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: { message: errorText } };
        }
        
        console.error("YouTube API error:", youtubeResponse.status, errorData);
        
        // Check if it's a quota exceeded error or any 403 error
        if (errorData.error?.reason === "quotaExceeded" || 
            errorData.error?.message?.includes("quota") || 
            youtubeResponse.status === 403) {
          console.warn("YouTube API quota exceeded or forbidden. Using fallback trailers for:", title);
          
          // Use the helper function to find fallback trailer
          const fallbackId = findFallbackTrailer(title);
          console.log("Fallback search result for '", title, "':", fallbackId);
          
          if (fallbackId) {
            console.log("✅ Using fallback trailer ID:", fallbackId, "for movie:", title);
            const trailerData = {
              id: fallbackId,
              key: fallbackId,
              name: `${title} - Official Trailer`,
              type: "Trailer",
              site: "YouTube",
              size: 1080,
              isFallback: true
            };
            
            if(isTrailer){
              dispatch(addMovieTrailer(trailerData));
            } else{
              dispatch(addTrailerMovie(trailerData));
            }
            return;
          }
          
          // If no fallback available, show error
          console.warn("❌ No fallback trailer available for:", title);
          if (!isTrailer) {
            dispatch(setTrailerError("YouTube API quota exceeded. Please try again tomorrow or upgrade your API quota."));
          } else {
            console.warn("No fallback trailer available for:", title);
          }
          return;
        }
        
        throw new Error(`YouTube API failed: ${youtubeResponse.status} - ${errorData.error?.message || errorText}`);
      }
      
      const youtubeData = await youtubeResponse.json();
      console.log("YouTube API response:", youtubeData);
      
      if (!youtubeData.items || youtubeData.items.length === 0) {
        console.warn("No YouTube videos found for:", searchQuery);
        
        // Try fallback trailer before showing error
        const fallbackId = findFallbackTrailer(title);
        if (fallbackId) {
          console.log("Using fallback trailer ID (no YouTube results):", fallbackId);
          const trailerData = {
            id: fallbackId,
            key: fallbackId,
            name: `${title} - Official Trailer`,
            type: "Trailer",
            site: "YouTube",
            size: 1080,
            isFallback: true
          };
          
          if(isTrailer){
            dispatch(addMovieTrailer(trailerData));
          } else{
            dispatch(addTrailerMovie(trailerData));
          }
          return;
        }
        
        // Only show error if no fallback available
        if (!isTrailer) {
          dispatch(setTrailerError("No trailer available for this movie."));
        }
        return;
      }

      // Transform YouTube result to match expected format
      const video = youtubeData.items[0];
      const trailerData = {
        id: video.id.videoId,
        key: video.id.videoId,
        name: video.snippet.title,
        type: "Trailer",
        site: "YouTube",
        size: 1080
      };

      console.log("Trailer data created:", trailerData);

      if(isTrailer){
        dispatch(addMovieTrailer(trailerData));
      } else{
        dispatch(addTrailerMovie(trailerData));
      }
    } catch (error) {
      console.error("Failed to fetch movie trailer:", error);
      if (!isTrailer) {
        dispatch(setTrailerError(`Failed to load trailer: ${error.message}`));
      }
    } finally {
      setIsFetching(false);
    }
  }

  useEffect(()=>{
    // Reset fetch flag if trailerId changes
    if (lastTrailerIdRef.current !== trailerId) {
      hasFetchedRef.current = false;
      lastTrailerIdRef.current = trailerId;
    }
    
    // Always fetch trailer if we have a trailerId and haven't fetched yet
    if (trailerId && !hasFetchedRef.current && !isFetching) {
      // For main trailer, check if we need to fetch
      if (isTrailer) {
        // Only fetch if we don't have a trailer
        if (!trailer?.key) {
          console.log("Fetching trailer for movie:", trailerId, "Title:", movieTitle);
          hasFetchedRef.current = true;
          getMovieTrailer();
        } else {
          console.log("Trailer already exists:", trailer.key);
          hasFetchedRef.current = true;
        }
      } else {
        // For non-main trailers (like in AboutMovie)
        // Check if we already have a trailer for this specific movie
        const hasTrailer = trailerVideoOne?.key && trailerVideoOne?.id === trailerId;
        if (!hasTrailer) {
          console.log("Fetching trailer for AboutMovie:", trailerId, "Title:", movieTitle);
          hasFetchedRef.current = true;
          getMovieTrailer();
        } else {
          console.log("Trailer already exists for AboutMovie:", trailerVideoOne.key);
          hasFetchedRef.current = true;
        }
      }
    }
  },[trailerId, isTrailer, movieTitle])
}

export default useMovieTrailerVideo;


