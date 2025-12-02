import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useTrailer from '../../customHooks/useTrailer';
import { BG_URL } from '../../utlis/constants';
import "./shimmer.css";


const MovieView = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  
  // Try to get movie title from Redux store
  const allMovies = useSelector(store => {
    const movies = [
      ...(store.movies?.nowPlayingMovies || []),
      ...(store.movies?.popularMovies || []),
      ...(store.movies?.topRatedMovies || []),
      ...(store.movies?.upcomingMovies || [])
    ];
    return movies.find(m => m.id === movieId);
  });
  
  const movieTitle = allMovies?.title || allMovies?.original_title;
  useTrailer({trailerId: movieId, movieTitle}); // Fetch trailer when component mounts

  const cardTrailers = useSelector(store => store.movies?.cardTrailers);
  const trailer = cardTrailers?.[movieId];
  const [trailerError, setTrailerError] = useState(null);
  
  // Check if trailer is loading (no trailer after 5 seconds)
  useEffect(() => {
    if (!trailer && movieId) {
      const timer = setTimeout(() => {
        if (!cardTrailers?.[movieId]) {
          setTrailerError("Trailer is taking longer than expected. This might be due to YouTube API quota limits.");
        }
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setTrailerError(null);
    }
  }, [trailer, movieId, cardTrailers]);

  const handleBack = () => {
    navigate('/browse');
  };  
  return (
    <div className='relative min-h-screen bg-black'>
      <img className='h-screen object-cover w-screen fixed top-0 left-0 -z-30' src={BG_URL} alt="bg-img"/>
      
      {/* Back Button with Icon */}
      <button 
        onClick={handleBack} 
        className='absolute top-4 left-4 md:top-6 md:left-6 z-50 text-white bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full p-2 md:p-3 transition-all duration-200 hover:scale-110 shadow-lg border border-white/20 cursor-pointer'
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

      {/* Video Container - Responsive */}
      <div className='relative w-full pt-[56.25%] md:pt-0 md:min-h-screen flex items-center justify-center'>
        <div className='absolute inset-0 w-full h-full md:flex md:items-center md:justify-center'>
          {trailer ? (
            <div className='w-full h-full md:max-w-7xl md:max-h-[90vh] md:mx-auto'>
              <iframe
                className="w-full h-full aspect-video md:rounded-lg shadow-2xl"
                src={`https://www.youtube.com/embed/${trailer.key}?&autoplay=1&mute=0`}
                title="Movie Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              {trailer.isFallback && (
                <div className="mt-2 text-center">
                  <p className="text-yellow-400 text-xs">Using fallback trailer (API quota exceeded)</p>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full aspect-video md:max-w-7xl md:max-h-[90vh] md:mx-auto md:rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="shimmer w-full h-full aspect-video md:max-w-7xl md:max-h-[90vh] md:mx-auto md:rounded-lg mb-4"></div>
                <p className="text-white text-sm">Loading trailer...</p>
                {trailerError ? (
                  <div className="mt-4 p-4 bg-yellow-900/50 border border-yellow-600 rounded-lg max-w-md mx-auto">
                    <p className="text-yellow-300 text-xs">{trailerError}</p>
                    <p className="text-gray-400 text-xs mt-2">Popular movies may still work with fallback trailers</p>
                  </div>
                ) : (
                  <p className="text-gray-400 text-xs mt-2">If this takes too long, check browser console for errors</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieView;
