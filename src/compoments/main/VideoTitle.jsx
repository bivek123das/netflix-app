import React from 'react'

const VideoTitle = ({title,overview}) => {
  return (
    <div className='w-screen aspect-video pt-[20%] md:pt-[15%] px-4 md:px-20 absolute text-white bg-gradient-to-r from-black'>
         <h1 className='text-2xl md:text-4xl lg:text-5xl font-bold'>{title}</h1>
         <p className='hidden md:inline-block md:py-3 lg:py-6 md:w-2/4 lg:w-1/4 lg:text-md md:text-xs'>{overview}</p>
         <div className='my-2 flex flex-wrap gap-3'>
            <button className='flex items-center gap-2 bg-white/90 text-black font-semibold px-4 md:px-10 py-2 rounded-full text-sm md:text-lg shadow-lg shadow-black/40 hover:bg-red-500 hover:scale-[1.02] transition-transform cursor-pointer'>▶️ Play</button>
            <button className='hidden md:inline-flex items-center bg-gray-700/80 text-white px-8 py-2 rounded-full text-sm md:text-lg border border-white/30 hover:bg-gray-600/80 transition-colors cursor-pointer'>ℹ️ More Info</button>
         </div>
    </div>
  )
}

export default VideoTitle