import React from 'react'
import { useSelector } from 'react-redux'
import VideoTitle from './VideoTitle';
import VideoBackground from './VideoBackground';

const MainContainer = () => {

    const movies = useSelector(store => store.movies?.nowPlayingMovies);
    if(!movies || movies.length === 0){
      return (
        <div className='h-[60vh] flex items-center justify-center text-white bg-black'>
          <p className='text-center text-lg md:text-2xl text-gray-300'>No featured movie available right now. Please try refreshing.</p>
        </div>
      )
    }

    const mainmovie = movies[0];
    if(!mainmovie){
      return (
        <div className='h-[60vh] flex items-center justify-center text-white bg-black'>
          <p className='text-center text-lg md:text-2xl text-gray-300'>Loading featured movie...</p>
        </div>
      )
    }

    const {original_title, overview, id, title} = mainmovie || {};

  return (
    <div className='pt-[38%] bg-black md:pt-[10%] lg:pt-0 relative'>
         <VideoTitle title={original_title || title || "Untitled"} overview={overview || "Movie details will appear soon."}/>
         {id && <VideoBackground movieid={id} movieTitle={original_title || title}/>}
    </div>
  )
}

export default MainContainer