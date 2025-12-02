import React from "react";
import Header from "./Header";
import useNewPlayingMovies from "../customHooks/useNowPlaying";
import MainContainer from "./main/MainContainer";
import SecondaryContainer from "./secondary/SecondaryContainer";
import usePopularMovies from "../customHooks/usePopularMovies";
import { useDispatch, useSelector } from "react-redux";
import GptSearch from "./gpt/GptSearch";
import AboutMovie from "./gpt/AboutMovie";
import { toggleGptMovieView } from "../utlis/store/gptSlice";
import useTopRated from "../customHooks/useTopRated";
import useUpcomingMovies from "../customHooks/useUpcomingMovies";


const Browse = () => {
  useNewPlayingMovies();
  usePopularMovies();
  useTopRated();
  useUpcomingMovies();
  
  const {showGptSearch, showMovieDes}= useSelector((store) => store.gpt);
  const movies = useSelector((store) => store.movies);
  const dispatch = useDispatch();

   const goToGptSearch = ()=>{
       dispatch(toggleGptMovieView());
   }

  const isLoading = !movies?.nowPlayingMovies && movies?.isLoading;
  const error = movies?.error;

  return (
    <div>
      <Header/>

      {error ? (
        <div className='fixed inset-0 bg-black flex items-center justify-center z-50'>
          <div className='text-center max-w-2xl px-4'>
            <div className='text-red-500 text-6xl mb-4'>⚠️</div>
            <h2 className='text-white text-2xl font-bold mb-4'>API Error</h2>
            <p className='text-white text-lg mb-4'>{error}</p>
            <div className='bg-gray-800 p-4 rounded-lg text-left text-sm text-gray-300'>
              <p className='mb-2'><strong>To fix this:</strong></p>
              <ol className='list-decimal list-inside space-y-1'>
                <li>Go to <a href="http://www.omdbapi.com/apikey.aspx" target="_blank" rel="noopener noreferrer" className='text-red-500 underline'>OMDB API Key</a></li>
                <li>Get a free API key (1000 requests/day free)</li>
                <li>Update the OMDB_KEY in <code className='bg-gray-900 px-1 rounded'>src/utlis/constants.js</code></li>
                <li>Refresh this page</li>
              </ol>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className='mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded'
            >
              Retry
            </button>
          </div>
        </div>
      ) : isLoading ? (
        <div className='fixed inset-0 bg-black flex items-center justify-center z-50'>
          <div className='text-center'>
            <div className='w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
            <p className='text-white text-xl font-semibold'>Loading your favorite movies...</p>
          </div>
        </div>
      ) : (
        <>
          {showGptSearch ? (
            showMovieDes ? <AboutMovie goToGptSearch={goToGptSearch}/> : <GptSearch/>
          ) : (
            <>
              <MainContainer />
              <SecondaryContainer />
            </>
          )}
        </>
      )}

    </div>
  );
};

export default Browse;