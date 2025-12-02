import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS, OMDB_BASE_URL, OMDB_KEY } from "../utlis/constants";
import { addTopRatedMovies, setLoading, setError } from "../utlis/store/movieSlice";

// Top rated movie titles (highly rated movies)
const TOP_RATED_TITLES = [
    "The Shawshank Redemption", "The Godfather", "The Dark Knight", "Pulp Fiction", "Schindler's List",
    "12 Angry Men", "The Lord of the Rings: The Return of the King", "The Good, the Bad and the Ugly",
    "Fight Club", "Forrest Gump", "Inception", "The Matrix", "Goodfellas", "The Lord of the Rings: The Fellowship of the Ring",
    "Star Wars: Episode V - The Empire Strikes Back", "The Lord of the Rings: The Two Towers", "The Matrix Reloaded",
    "One Flew Over the Cuckoo's Nest", "Se7en", "The Silence of the Lambs"
];

const useTopRated = ()=>{
    const dispatch = useDispatch();

    const topRatedMovies = useSelector(store => store.movies.topRatedMovies);

    const getTopRatedMovies = async ()=>{
        dispatch(setLoading(true));
        try {
            // Fetch top rated movies using OMDB
            const moviePromises = TOP_RATED_TITLES.slice(0, 20).map(async (title) => {
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
            const validMovies = movies.filter(movie => movie !== null).sort((a, b) => b.vote_average - a.vote_average);
            
            dispatch(addTopRatedMovies(validMovies));
        } catch (error) {
            dispatch(setError(`Failed to load top rated movies: ${error.message}`));
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(()=>{
        !topRatedMovies && getTopRatedMovies();
    },[])
}
export default useTopRated;
