import React from "react";
import { useSelector } from "react-redux";
import useMovieTrailerVideo from "../../customHooks/useMovieTrailerVideo";

const VideoBackground = ({ movieid, movieTitle = null }) => {
  // fetch the trailer video and updating the store with trailer video data
  const trailerVideo = useSelector((store) => store.movies?.trailerVideo);
  
  // Always call the hook to fetch trailer
  useMovieTrailerVideo(movieid, true, movieTitle);
  
  // Show loading state while fetching
  if (!trailerVideo?.key) {
    return (
      <div className="w-screen aspect-video bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-white text-sm">Loading trailer...</p>
          <p className="text-gray-400 text-xs mt-2">If this takes too long, YouTube API quota may be exceeded</p>
        </div>
      </div>
    );
  }
  return (
    <div className="w-screen">
      <iframe
        className="w-screen aspect-video"
        src={
          "https://www.youtube.com/embed/" +
          trailerVideo?.key +
          "?&autoplay=1&mute=1"
        }
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      ></iframe>
    </div>
  );
};
export default VideoBackground;