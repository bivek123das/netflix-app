import { useEffect } from "react";
import { API_OPTIONS, OMDB_BASE_URL, OMDB_KEY, POPULAR_MOVIE_TITLES } from "../utlis/constants";
import { useDispatch, useSelector } from "react-redux";
import { addPopularMovies, setLoading, setError } from "../utlis/store/movieSlice";


const usePopularMovies = ()=>{

    const dispatch = useDispatch();

    const popularMovies = useSelector(store => store.movies.popularMovies)

    const getPopularMovies = async ()=>{
        dispatch(setLoading(true));
        try {
            // Fetch popular movies using OMDB
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
                            omdbData: data
                        };
                    }
                    return null;
                } catch (error) {
                    return null;
                }
            });
            
            const movies = await Promise.all(moviePromises);
            const validMovies = movies.filter(movie => movie !== null);
            
            dispatch(addPopularMovies(validMovies));
        } catch (error) {
            dispatch(setError(`Failed to load popular movies: ${error.message}`));
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(()=>{
        !popularMovies && getPopularMovies();
    },[])
}

export default usePopularMovies;
