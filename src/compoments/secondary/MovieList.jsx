import React from 'react'
import MovieCards from './MovieCards'

const MovieList = ({title,movies}) => {
// console.log(movies);
  return (
    <div className='px-3 sm:px-4 md:px-6'>
         <h1 className='text-base sm:text-lg md:text-2xl lg:text-3xl py-2 sm:py-3 md:py-4 text-white font-semibold'>{title}</h1>
         <div className='flex overflow-x-auto scrollbar-hide -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6'>
            <div className='flex gap-1 sm:gap-2'>
                {movies?.map(movie => <MovieCards key={movie.id}  movieId={movie.id} posterPath={movie.poster_path}/>)}
            </div>
         </div>
    </div>
  )
}

export default MovieList;