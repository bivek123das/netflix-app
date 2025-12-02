import { createSlice } from "@reduxjs/toolkit";


const movieSlice = createSlice({
    name: 'movies',
    initialState:{
        nowPlayingMovies: null,
        popularMovies : null,
        trailerVideo : null,
        topRatedMovies : null,
        upcomingMovies: null,
        cardTrailers: {},
        isLoading: false,
        error: null,
    },
    reducers:{
        addNowPlayingMovies: (state,action)=>{
            state.nowPlayingMovies = action.payload;
        },

        addPopularMovies: (state,action) =>{
            state.popularMovies = action.payload;
        },

        addTopRatedMovies: (state,action)=>{
             state.topRatedMovies = action.payload;
        },

        addUpcomingMovies: (state,action)=>{
            state.upcomingMovies = action.payload;
        },
      
        addMovieTrailer : (state,action)=>{
            state.trailerVideo = action.payload;
        },
        addCardTrailer : (state,action)=>{
            const { movieId, trailer } = action.payload;
            state.cardTrailers[movieId] = trailer;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
})

export const {addNowPlayingMovies, addPopularMovies, addMovieTrailer, addTopRatedMovies, addUpcomingMovies, addCardTrailer, setLoading, setError, clearError} = movieSlice.actions;
export default movieSlice.reducer;