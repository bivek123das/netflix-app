import { useEffect, useState } from "react";
import { API_OPTIONS, YOUTUBE_API_KEY, OMDB_BASE_URL, OMDB_KEY, findFallbackTrailer } from "../utlis/constants";
import { useDispatch, useSelector } from "react-redux";
import { addCardTrailer } from "../utlis/store/movieSlice";

const useTrailer = ({ trailerId, movieTitle = null }) => {
  const dispatch = useDispatch();
  const [isFetching, setIsFetching] = useState(false);
  
  const cardTrailers = useSelector(store => store.movies.cardTrailers);
  const currentTrailer = cardTrailers?.[trailerId];

  useEffect(() => {
    // Only fetch if we don't have a trailer for this specific movie
    if (!currentTrailer && trailerId && !isFetching) {
      const getTrailer = async () => {
        setIsFetching(true);
        try {
          // Get movie title from OMDB if not provided
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
            throw new Error(omdbData.Error || "OMDB did not return a valid title");
            }
          }
          
          if (!title) {
            return;
          }
          
          // Search YouTube for trailer
          const searchQuery = `${title} official trailer`;
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
            
            // Check if it's a quota exceeded error
            if (errorData.error?.reason === "quotaExceeded" || errorData.error?.message?.includes("quota")) {
              // Use the helper function to find fallback trailer
              const fallbackId = findFallbackTrailer(title);
              
              if (fallbackId) {
                const ctrailer = {
                  id: fallbackId,
                  key: fallbackId,
                  name: `${title} - Official Trailer`,
                  type: "Trailer",
                  site: "YouTube",
                  size: 1080,
                  isFallback: true
                };
                
                dispatch(addCardTrailer({ movieId: trailerId, trailer: ctrailer }));
                return;
              }
              
              return;
            }
            
            throw new Error(`YouTube API failed: ${youtubeResponse.status} - ${errorData.error?.message || errorText}`);
          }
          
        const youtubeData = await youtubeResponse.json();

          // Check if there's any trailer data
          if (youtubeData.items && youtubeData.items.length > 0) {
            const video = youtubeData.items[0];
            const ctrailer = {
              id: video.id.videoId,
              key: video.id.videoId,
              name: video.snippet.title,
              type: "Trailer",
              site: "YouTube",
              size: 1080
            };

            // Dispatch the action to store the trailer in Redux with movieId
            dispatch(addCardTrailer({ movieId: trailerId, trailer: ctrailer }));
          } else {
          return;
          }
        } catch (error) {
          // Error is already handled in the try block (quota exceeded, etc.)
        } finally {
          setIsFetching(false);
        }
      };
      
      getTrailer();
    }
  }, [trailerId, currentTrailer, dispatch, movieTitle, isFetching]);
};

export default useTrailer;



