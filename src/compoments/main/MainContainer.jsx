import React from 'react'
import { useSelector } from 'react-redux'
import VideoTitle from './VideoTitle';
import VideoBackground from './VideoBackground';

const MainContainer = () => {

    const movies = useSelector(store => store.movies?.nowPlayingMovies);

    if(!movies) return ;

    const mainmovie = movies[0];
    // console.log(mainmovie);

    const {original_title, overview, id, title} = mainmovie;

  return (
    <div className='pt-[38%] bg-black md:pt-[10%] lg:pt-0 relative'>
         <VideoTitle title={original_title} overview={overview}/>
         <VideoBackground movieid={id} movieTitle={original_title || title}/>
    </div>
  )
}

export default MainContainer