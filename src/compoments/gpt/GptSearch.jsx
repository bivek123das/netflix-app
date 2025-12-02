import React from 'react'
import GptSearchBar from './GptSearchBar';
import GptMovieSuggestions from './GptMovieSuggestions';
import { BG_URL } from '../../utlis/constants';
import Particle from '../../utlis/Particle';

const GptSearch = () => {
  return (
    <>
       <div className='fixed -z-10'>
            <img className='h-screen object-cover w-screen' alt="background-image" src={BG_URL}/>
            <Particle/>
       </div>

       <div className='flex flex-col min-h-screen pt-16 sm:pt-20 md:pt-24'>
         <GptSearchBar/>
         <div className='mt-4 sm:mt-6 md:mt-8'>
           <GptMovieSuggestions/>
         </div>
        </div> 
    </>
  )
}

export default GptSearch;