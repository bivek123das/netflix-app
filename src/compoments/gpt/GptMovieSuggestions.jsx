import React from 'react'
import { useSelector } from 'react-redux'
import GptMovieList from './GptMovieList';

const GptMovieSuggestions = () => {

const {gptMovieName, gptMovieResults} = useSelector(store => store.gpt);


 if(!gptMovieName) return null;

  // Show message if no results found
  if(!gptMovieResults || gptMovieResults.length === 0) {
    return (
      <div className='px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:my-10 mx-2 sm:mx-4 md:mx-8 text-white bg-black bg-opacity-80 rounded-lg'>
        <div className='text-center py-4 sm:py-6 md:py-8'>
          <p className='text-lg sm:text-xl md:text-2xl font-semibold mb-2'>No movies found</p>
          <p className='text-sm sm:text-base text-gray-400 px-2'>We couldn't find any movies matching "{gptMovieName}".</p>
          <p className='text-sm sm:text-base text-gray-400 mt-2 px-2'>Please try searching with a different movie name.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='px-2 sm:px-4 md:px-8 py-4 sm:py-6 md:my-10 mx-2 sm:mx-4 md:mx-8 text-white bg-black bg-opacity-80 rounded-lg'>
          <GptMovieList title={gptMovieName.toUpperCase()} movies={gptMovieResults}/>
    </div>
  )
}

export default GptMovieSuggestions;