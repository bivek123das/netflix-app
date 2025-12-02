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
      return;
    }

    // Prevent multiple simultaneous fetches
    if (isFetching) {
      return;
    }

    setIsFetching(true);
    try {
      // Since OMDB doesn't provide trailers, we'll use YouTube API to search for trailers
      // First, get movie title from OMDB if not provided
      let title = movieTitle;
      
      if (!title) {
        const omdbResponse = await fetch(
          `${OMDB_BASE_URL}/?apikey=${OMDB_KEY}&i=${trailerId}`,
          API_OPTIONS
        );
        
        if (!omdbResponse.ok) {
          throw new Error(`OMDB API failed: ${omdbResponse.status}`);
        }
        
        const omdbData = await omdbResponse.json();
        
        if (omdbData.Response === "True" && omdbData.Title) {
          title = omdbData.Title;
        } else {
          throw new Error(omdbData.Error || "OMDB did not return a title");
        }
      } else {
      }
      
      if (!title) {
        if (!isTrailer) {
          dispatch(setTrailerError("No trailer available for this movie."));
        }
        return;
      }
      
      // Search YouTube for trailer
      const searchQuery = `${title} official trailer`;
      
      // Check for fallback BEFORE making API call if we know quota is likely exceeded
      // This prevents unnecessary API calls
      const fallbackIdPreCheck = findFallbackTrailer(title);
      if (fallbackIdPreCheck) {
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
        
        // Check if it's a quota exceeded error or any 403 error
        if (errorData.error?.reason === "quotaExceeded" || 
            errorData.error?.message?.includes("quota") || 
            youtubeResponse.status === 403) {
          // Use the helper function to find fallback trailer
          const fallbackId = findFallbackTrailer(title);
          
          if (fallbackId) {
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
          if (!isTrailer) {
            dispatch(setTrailerError("YouTube API quota exceeded. Please try again tomorrow or upgrade your API quota."));
          } else {
          }
          return;
        }
        
        throw new Error(`YouTube API failed: ${youtubeResponse.status} - ${errorData.error?.message || errorText}`);
      }
      
      const youtubeData = await youtubeResponse.json();
      
      if (!youtubeData.items || youtubeData.items.length === 0) {
        // Try fallback trailer before showing error
        const fallbackId = findFallbackTrailer(title);
        if (fallbackId) {
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

      if(isTrailer){
        dispatch(addMovieTrailer(trailerData));
      } else{
        dispatch(addTrailerMovie(trailerData));
      }
    } catch (error) {
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
          hasFetchedRef.current = true;
          getMovieTrailer();
        } else {
          hasFetchedRef.current = true;
        }
      } else {
        // For non-main trailers (like in AboutMovie)
        // Check if we already have a trailer for this specific movie
        const hasTrailer = trailerVideoOne?.key && trailerVideoOne?.id === trailerId;
        if (!hasTrailer) {
          hasFetchedRef.current = true;
          getMovieTrailer();
        } else {
          hasFetchedRef.current = true;
        }
      }
    }
  },[trailerId, isTrailer, movieTitle])
}

export default useMovieTrailerVideo;


