// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { API_OPTIONS } from "../utils/constants";
// import {addUpcomingMovies, setLoading } from "../utils/store/movieSlice";



// const useUpcomingMovies = ()=>{
//     const dispatch = useDispatch();

//     const upcomingMovies = useSelector(store => store.movies.upcomingMovies);

//     const getUpcomingMovies = async ()=>{
//         dispatch(setLoading(true));
//         const response = await fetch('https://api.themoviedb.org/3/movie/upcoming?&page=1', API_OPTIONS);
//         const data = await response.json();
//         dispatch(addUpcomingMovies(data.results));
//         dispatch(setLoading(false));
//     }

//     useEffect(()=>{
//         !upcomingMovies && getUpcomingMovies();
//     },[])
// }
// export default useUpcomingMovies ;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS, OMDB_BASE_URL, OMDB_KEY } from "../utlis/constants";
import { addUpcomingMovies, setLoading, setError } from "../utlis/store/movieSlice";

// Recent/upcoming movie titles
const UPCOMING_TITLES = [
    "Dune", "No Time to Die", "Spider-Man: No Way Home", "The Batman", "Top Gun: Maverick",
    "Doctor Strange in the Multiverse of Madness", "Thor: Love and Thunder", "Black Widow",
    "Eternals", "Shang-Chi and the Legend of the Ten Rings", "Venom: Let There Be Carnage",
    "Fast & Furious 9", "A Quiet Place Part II", "Godzilla vs. Kong", "Cruella",
    "Jungle Cruise", "Free Guy", "The Suicide Squad", "Joker", "1917"
];

const useUpcomingMovies = () => {
  const dispatch = useDispatch();
  const upcomingMovies = useSelector((store) => store.movies.upcomingMovies);

  const getUpcomingMovies = async () => {
    dispatch(setLoading(true));

    try {
      // Fetch upcoming/recent movies using OMDB
      const moviePromises = UPCOMING_TITLES.slice(0, 20).map(async (title) => {
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
      
      dispatch(addUpcomingMovies(validMovies));
    } catch (error) {
      dispatch(setError(`Failed to load upcoming movies: ${error.message}`));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (!upcomingMovies || upcomingMovies.length === 0) {
      getUpcomingMovies();
    }
  }, [upcomingMovies]);
};

export default useUpcomingMovies;
