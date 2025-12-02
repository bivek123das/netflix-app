import React from "react";
import GptMovieCards from "./GptMovieCards";


const GptMovieList = ({ movies, title}) => {
  if(!movies || movies.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="bg-black bg-opacity-65 p-4 sm:p-6 md:p-10 mx-2 sm:mx-4 md:mx-10 lg:mx-20 my-3 sm:my-4 md:my-5 rounded-lg">
            <h1 className="text-center text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4">{title} Movies</h1>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
          {movies.map((movie) => {
            return (
                <GptMovieCards key={movie.id} posterPath={movie.poster_path} movieId={movie.id}/>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GptMovieList;