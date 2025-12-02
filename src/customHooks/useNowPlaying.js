import { API_OPTIONS, OMDB_BASE_URL, OMDB_KEY, POPULAR_MOVIE_TITLES } from '../utlis/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addNowPlayingMovies, setLoading, setError } from '../utlis/store/movieSlice'
import { useEffect } from 'react';


const useNewPlayingMovies = ()=>{
 // Fetch data from OMDB API and update store
   
 const dispatch = useDispatch();

 const nowPlayingMovies = useSelector(store=>store.movies.nowPlayingMovies);

 const getNowPlayingMovies = async ()=>{
     dispatch(setLoading(true));
     try {
         // OMDB doesn't have a "now playing" endpoint, so we'll fetch popular movies
         // Fetch multiple movies in parallel
         const moviePromises = POPULAR_MOVIE_TITLES.slice(0, 20).map(async (title) => {
             try {
                 const response = await fetch(
                     `${OMDB_BASE_URL}/?apikey=${OMDB_KEY}&t=${encodeURIComponent(title)}&type=movie`,
                     API_OPTIONS
                 );
                 
                 if (!response.ok) {
                     return null;
                 }
                 
                 const data = await response.json();
                 
                 // Transform OMDB response to match TMDB format
                 if (data.Response === "True") {
                     return {
                         id: data.imdbID,
                         title: data.Title,
                         original_title: data.Title,
                         overview: data.Plot || "No description available",
                         release_date: data.Released || data.Year,
                         poster_path: data.Poster && data.Poster !== "N/A" ? data.Poster : null,
                         backdrop_path: null,
                         vote_average: data.imdbRating ? parseFloat(data.imdbRating) : 0,
                         vote_count: data.imdbVotes ? parseInt(data.imdbVotes.replace(/,/g, '')) : 0,
                         popularity: data.imdbRating ? parseFloat(data.imdbRating) * 100 : 0,
                         // Store OMDB data for later use
                         omdbData: data
                     };
                 }
                 return null;
             } catch (error) {
                 console.error(`Error fetching ${title}:`, error);
                 return null;
             }
         });
         
         const movies = await Promise.all(moviePromises);
         const validMovies = movies.filter(movie => movie !== null);
         
         console.log("✅ Now Playing Movies fetched successfully:", validMovies.length, "movies");
         dispatch(addNowPlayingMovies(validMovies));
         dispatch(setError(null)); // Clear any previous errors
     } catch (error) {
         console.error("❌ Failed to fetch now playing movies:", error);
         dispatch(setError(`Failed to load movies: ${error.message}. Please check your OMDB API key in src/utlis/constants.js`));
     } finally {
         dispatch(setLoading(false));
     }
}

 useEffect(()=>{
   !nowPlayingMovies && getNowPlayingMovies();
 },[])

}

export default useNewPlayingMovies;


