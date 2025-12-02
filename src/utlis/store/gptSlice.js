import { createSlice } from "@reduxjs/toolkit";


const gptSlice = createSlice({
    name : "gpt",
    initialState : {
        showGptSearch : false,
        showMovieDes: false,
        gptMovieName: null,
        gptMovieResults: null,
        gptMovieDetails: null,
        trailerId : null,
        trailerVideoOne: null,
        trailerError: null,
    },
    reducers : {
        toggleGptSearchView: (state)=>{
            state.showGptSearch = !state.showGptSearch;
        },
        toggleGptMovieView : (state)=>{
             state.showMovieDes = !state.showMovieDes;
        },
        addgptMovies: (state,action)=>{
            
            const {gptMovieName, gptMovieResults} = action.payload;
            state.gptMovieName = gptMovieName;
            state.gptMovieResults = gptMovieResults;
        },
        setMovieDetails: (state,action)=>{
            state.gptMovieDetails = action.payload;
        },
        addTrailerId: (state,action) => {
            state.trailerId = action.payload;
        },
        addTrailerMovie: (state,action) => {
            state.trailerVideoOne = action.payload;
            state.trailerError = null;
        },
        setTrailerError: (state, action) => {
            state.trailerError = action.payload;
            state.trailerVideoOne = null;
        },
        clearTrailerError: (state) => {
            state.trailerError = null;
        }
    }
})

export const {toggleGptSearchView, toggleGptMovieView ,addgptMovies, setMovieDetails, addTrailerId, addTrailerMovie, setTrailerError, clearTrailerError } = gptSlice.actions;
export default gptSlice.reducer;