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
            console.warn("No title found for movie, cannot fetch trailer.");
            return;
          }
          
          // Search YouTube for trailer
          const searchQuery = `${title} official trailer`;
          console.log("Searching YouTube for:", searchQuery);
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
            
            // Check if it's a quota exceeded error
            if (errorData.error?.reason === "quotaExceeded" || errorData.error?.message?.includes("quota")) {
              console.warn("YouTube API quota exceeded. Using fallback trailers for:", title);
              
              // Use the helper function to find fallback trailer
              const fallbackId = findFallbackTrailer(title);
              
              if (fallbackId) {
                console.log("Using fallback trailer ID:", fallbackId);
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
              
              console.warn("No fallback trailer available for:", title);
              return;
            }
            
            throw new Error(`YouTube API failed: ${youtubeResponse.status} - ${errorData.error?.message || errorText}`);
          }
          
          const youtubeData = await youtubeResponse.json();
          console.log("YouTube API response:", youtubeData);

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

            console.log("Trailer data created:", ctrailer);
            // Dispatch the action to store the trailer in Redux with movieId
            dispatch(addCardTrailer({ movieId: trailerId, trailer: ctrailer }));
          } else {
            console.warn("No trailer found for this movie.");
          }
        } catch (error) {
          console.error("Failed to fetch trailer:", error);
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



