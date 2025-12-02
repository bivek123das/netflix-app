import { signOut, onAuthStateChanged  } from 'firebase/auth';
import React,{useEffect} from 'react'
import { auth } from '../utlis/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, removeUser } from '../utlis/store/userSlice';
import { useNavigate } from 'react-router-dom';
import { LOGO, SUPPORTED_LANGUAGES, USER_AVATAR } from '../utlis/constants';
import { toggleGptSearchView, toggleGptMovieView } from '../utlis/store/gptSlice';
import { changeLanguage } from '../utlis/store/configSlice';


const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const  user = useSelector(store => store.user);
  const {showGptSearch, showMovieDes} = useSelector(store => store.gpt);

  const handleSignOut = ()=>{
    signOut(auth).then(() => {
      // Sign-out successful
    }).catch((error) => {
      // An error happened.
      navigate("/error");
    });
  }

  useEffect(() => {
   const unsubscribed =  onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        const { uid, email, displayName, photoURL } = user;
        dispatch(
          addUser({
            uid: uid,
            email: email,
            displayName: displayName,
            photoURL: photoURL,
          })
        );
        navigate("/browse");
      } else {
        // User is signed out
        dispatch(removeUser());
        navigate("/");
        // ...
      }
    });

    return ()=> unsubscribed();
  }, []);

  const hanldeGptSearchClick = ()=>{
     dispatch(toggleGptSearchView());
  }

  const handleLanguageChange = (e)=>{
    dispatch(changeLanguage(e.target.value))
  }


 

  return (
    <div className='flex flex-col md:flex-row justify-between items-center fixed top-0 left-0 w-screen px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-gradient-to-b from-black z-50'>
        <img className='w-32 sm:w-40 md:w-44 mx-auto md:mx-0 cursor-pointer hover:opacity-80 transition-opacity' src={LOGO} alt='netflix-header' onClick={() => user ? navigate('/browse') : navigate('/')}/>

        {user && <div className='flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 p-2'>
          {
            showGptSearch && !showMovieDes && (
              <select 
                onChange={handleLanguageChange} 
                className='bg-gray-900 text-white outline-none rounded-lg p-1.5 md:p-2 text-xs sm:text-sm md:text-md border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer'
              >
                 {
                   SUPPORTED_LANGUAGES.map((lang)=>
                     ( <option key={lang.identifier} value={lang.identifier}>{lang.name}</option>)
                   )
                 }
              </select>
            )
          }
          
            {!showMovieDes ? (
              <button
                className='flex items-center gap-1.5 sm:gap-2 text-white bg-purple-500 hover:bg-purple-400/90 transition-all duration-200 shadow-md border border-white/20 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full hover:scale-105 cursor-pointer'
                onClick={hanldeGptSearchClick}
                aria-label={showGptSearch ? "Go to Homepage" : "Go to Search"}
              >
                {showGptSearch ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className='text-xs sm:text-sm md:text-base hidden sm:inline'>Home</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className='text-xs sm:text-sm md:text-base hidden sm:inline'>Search</span>
                  </>
                )}
              </button>
            ) : (
              <button
                className='flex items-center gap-1.5 sm:gap-2 text-white bg-purple-500 hover:bg-purple-400/90 transition-all duration-200 shadow-md border border-white/20 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full hover:scale-105 cursor-pointer'
                onClick={() => {
                  dispatch(toggleGptSearchView());
                  dispatch(toggleGptMovieView());
                }}
                aria-label="Go to Homepage"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className='text-xs sm:text-sm md:text-base hidden sm:inline'>Home</span>
              </button>
            )}

           <div className='flex items-center gap-2 sm:gap-3'>
             <div className='relative group'>
               <img 
                 className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-lg object-cover cursor-pointer hover:border-purple-400 transition-all duration-200' 
                 src={user?.photoURL || USER_AVATAR} 
                 alt="user-profile"
                 onError={(e) => {
                   e.target.src = USER_AVATAR;
                 }}
               />
               <div className='absolute -bottom-1 -right-1 bg-green-500 border-2 border-black rounded-full w-3 h-3 sm:w-4 sm:h-4'></div>
             </div>
             
             <button 
               onClick={handleSignOut} 
               className='flex items-center gap-1.5 sm:gap-2 text-white hover:text-red-400 transition-all duration-200 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-red-500/20 group cursor-pointer'
               aria-label="Sign Out"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
               </svg>
               <span className='text-xs sm:text-sm md:text-base hidden md:inline'>Sign Out</span>
             </button>
           </div>
        </div>}
    </div>
  )
}

export default Header;

