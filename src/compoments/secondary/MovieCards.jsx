
import React from 'react';
import {useNavigate} from "react-router-dom";

const MovieCards = ({posterPath, movieId}) => {

  

  const navigate = useNavigate();

    if (!posterPath) return null; 

    
     
    const handleMovieCard = ()=>{
      // console.log(movieId);
        navigate(`/movieview/${movieId}`)
    }

  // Handle both TMDB format (just path) and OMDB format (full URL)
  const imageUrl = posterPath?.startsWith('http') ? posterPath : `https://image.tmdb.org/t/p/w500/${posterPath}`;

  return (
    <div className='w-28 sm:w-32 md:w-36 lg:w-48 flex-shrink-0 p-1 sm:p-2 md:p-4 cursor-pointer transition-transform hover:scale-105'>
        <img onClick={handleMovieCard} alt="Movie-card" className='w-full h-auto rounded-md' src={imageUrl}/>
    </div>
  )
}

export default MovieCards;  