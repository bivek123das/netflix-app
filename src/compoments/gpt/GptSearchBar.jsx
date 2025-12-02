import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import lang from "../../utlis/languageConstants";
import { API_OPTIONS, OMDB_BASE_URL, OMDB_KEY } from '../../utlis/constants';
import { addgptMovies } from '../../utlis/store/gptSlice';

const GptSearchBar = () => {

    const langKey  = useSelector(store => store.config.lang);
    const searchText = useRef();
    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = useState(null);

    const handleGptSearchClick = async () => {
      const moviename = searchText.current.value.trim();
  
      // 🔴 Check if input is empty
      if (!moviename) {
          alert("Please enter a movie name.");   // <-- popup message
          setErrorMessage(null); // Clear any previous error message
          return;   // stop further execution
      }
  
      try {
          // OMDB search - note: OMDB uses 's' for search (returns list) or 't' for title (single result)
          const response = await fetch(
              `${OMDB_BASE_URL}/?apikey=${OMDB_KEY}&s=${encodeURIComponent(moviename)}&type=movie`,
              API_OPTIONS
          );
  
          if (!response.ok) {
              if (response.status === 401) {
                  throw new Error(`OMDB API key is invalid or expired. Please update your API key in src/utlis/constants.js. Get a free key at http://www.omdbapi.com/apikey.aspx`);
              }
              throw new Error(`OMDB API failed: ${response.status} ${response.statusText}`);
          }
  
          const data = await response.json();
          console.log(moviename, data);
  
          if (data.Response === "False" || !data.Search || data.Search.length === 0) {
              setErrorMessage(null); // Don't show error message, just clear it
              dispatch(addgptMovies({ gptMovieName: moviename, gptMovieResults: [] }));
          } else {
              // Transform OMDB search results to match expected format
              const transformedResults = data.Search.map(movie => ({
                  id: movie.imdbID,
                  title: movie.Title,
                  original_title: movie.Title,
                  release_date: movie.Year,
                  poster_path: movie.Poster && movie.Poster !== "N/A" ? movie.Poster : null,
                  backdrop_path: null,
                  vote_average: 0,
                  vote_count: 0,
                  popularity: 0,
                  omdbData: movie
              }));
              
              setErrorMessage(null);
              dispatch(addgptMovies({ gptMovieName: moviename, gptMovieResults: transformedResults }));
          }
      } catch (error) {
          console.error("Failed to search movies:", error);
          // Show error message for API key issues
          if (error.message.includes("API key") || error.message.includes("401")) {
              setErrorMessage(error.message);
          } else {
              setErrorMessage(null); // Don't show error message on page for other errors, just log to console
          }
          dispatch(addgptMovies({ gptMovieName: moviename, gptMovieResults: [] }));
      }
  
      searchText.current.value = '';
  };
  
    

  return (
    <div className='pt-8 sm:pt-12 md:pt-16 lg:pt-20 flex justify-center px-4 relative z-10'>
         <form className='w-full max-w-4xl bg-black/90 backdrop-blur-sm grid grid-cols-12 rounded-lg border border-gray-700 shadow-2xl' onSubmit={(e)=> e.preventDefault()}>
              <input 
                ref={searchText} 
                type='text' 
                className='col-span-8 sm:col-span-9 text-xs sm:text-sm md:text-md outline-none p-2 sm:p-3 m-2 sm:m-4 rounded-md bg-gray-900 text-white placeholder-gray-400 border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                placeholder={lang[langKey].gptSearchPlaceholder}
              />
              <button 
                className='bg-red-500 col-span-4 sm:col-span-3 ml-0 mr-2 sm:mr-4 my-2 sm:my-4 py-1.5 sm:py-2 px-2 sm:px-4 rounded-md hover:bg-red-600 transition-colors text-xs sm:text-sm md:text-base text-white font-semibold cursor-pointer' 
                onClick={handleGptSearchClick}
              >
                {lang[langKey].search}
              </button>
         </form>
         {errorMessage && (
           <div className='mt-4 max-w-4xl mx-auto px-4'>
             <p className='text-red-400 text-sm bg-red-900/30 border border-red-500 rounded-lg p-2 text-center'>{errorMessage}</p>
           </div>
         )}
    </div>
  )
}

export default GptSearchBar;

