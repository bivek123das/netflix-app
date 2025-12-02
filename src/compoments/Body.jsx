import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Login";
import Browse from "./Browse";
import AboutMovie from "./gpt/AboutMovie";
import MovieView from "./secondary/MovieView"


const Body = () => {
  
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/browse",
      element: <Browse />,
    },
    {
      path : "/aboutmovie",
      element : <AboutMovie/>
    },
    {
      path : "/movieview/:movieId",
      element : <MovieView/>
    },
  ]);
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default Body;