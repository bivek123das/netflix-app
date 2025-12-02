import React, { useEffect } from 'react'
import Header from "../Header";
import { useSelector } from 'react-redux';
import useMovieTrailerVideo from "../../customHooks/useMovieTrailerVideo";
import { BG_URL } from '../../utlis/constants';
import { useNavigate } from 'react-router-dom';

const AboutMovie = ({goToGptSearch, posterPath}) => {
  const {trailerId, trailerVideoOne, trailerError, gptMovieResults} = useSelector((store) => store.gpt);
  const navigate = useNavigate();
  
  // Get movie title from GPT search results
  const selectedMovie = gptMovieResults?.find(movie => movie.id === trailerId);
  const movieTitle = selectedMovie?.title || selectedMovie?.original_title;
  
  useMovieTrailerVideo(trailerId, false, movieTitle);

  useEffect(() => {
    if (trailerError) {
      // Show error message for 3 seconds, then navigate back
      const timer = setTimeout(() => {
        goToGptSearch();
        navigate('/browse');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [trailerError, goToGptSearch, navigate]);



  return (
    <div className='relative min-h-screen bg-black'>
      <Header/>
      <img className='h-screen object-cover w-screen fixed top-0 left-0 -z-30' src={BG_URL} alt="bg-img"/>
      
      {/* Back Button with Icon */}
      <button 
        onClick={goToGptSearch} 
        className='absolute top-16 md:top-20 left-4 md:left-6 z-50 text-white bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full p-2 md:p-3 transition-all duration-200 hover:scale-110 shadow-lg border border-white/20 cursor-pointer'
        aria-label="Go back"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 md:h-6 md:w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      {/* Video Container - Responsive: Full width below navbar on small devices */}
      <div className='w-full pt-24 md:pt-20 md:min-h-screen md:flex md:items-center md:justify-center'>
        {trailerError ? (
          <div className="w-full md:max-w-2xl md:mx-auto flex flex-col items-center justify-center min-h-[50vh] px-4">
            <div className="bg-red-900/80 backdrop-blur-sm border border-red-500 rounded-lg p-6 md:p-8 text-center shadow-2xl">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-12 w-12 md:h-16 md:w-16 text-red-400 mx-auto mb-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Trailer Not Available</h2>
              <p className="text-red-200 text-sm md:text-base mb-4">{trailerError}</p>
              <p className="text-gray-300 text-xs md:text-sm">Redirecting to search page...</p>
            </div>
          </div>
        ) : trailerVideoOne ? (
          <div className='w-full md:max-w-7xl md:max-h-[90vh] md:mx-auto'>
            <iframe
              className="w-full aspect-video md:rounded-lg shadow-2xl"
              src={`https://www.youtube.com/embed/${trailerVideoOne?.key}?&autoplay=1&mute=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="w-full aspect-video md:max-w-7xl md:max-h-[90vh] md:mx-auto bg-gray-900 flex items-center justify-center md:rounded-lg">
            <p className="text-white text-lg">Loading trailer...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AboutMovie; 

