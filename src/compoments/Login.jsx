import React, { useRef, useState } from 'react'
import Header from './Header';
import { checkValidData } from '../utlis/validate';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from '../utlis/firebase';
import { useDispatch } from 'react-redux';
import { addUser } from '../utlis/store/userSlice';
import { BG_URL, USER_AVATAR} from '../utlis/constants';
import Particle from '../utlis/Particle';

const DEFAULT_EMAIL = "guest@example.com";
const DEFAULT_PASSWORD = "Guest123das@";
const DEFAULT_NAME = "Guest User";



const Login = () => {
  
  const [isSigInForm, setIsSignInForm] = useState(true);
  const [errorMessage,setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const email = useRef(null);
  const password = useRef(null);
  const name = useRef(null);


  const handleClick =()=>{
    // validate the form
     const message = checkValidData(email.current.value,password.current.value);
     setErrorMessage(message);
    //  email.current.value = "";
    //  password.current.value = '';

     if(message) return ;

     setIsLoading(true);
     setErrorMessage(null);

     if(!isSigInForm){
      createUserWithEmailAndPassword(auth, email.current.value, password.current.value)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        updateProfile(user, {
          displayName: name.current.value, photoURL: USER_AVATAR
        }).then(() => {
          // Profile updated!
          const { uid, email, displayName, photoURL } = auth.currentUser;
          dispatch(
            addUser({
              uid: uid,
              email: email,
              displayName: displayName,
              photoURL: photoURL,
            })
          );
          setIsLoading(false);
        }).catch((error) => {
          // An error occurred
          setErrorMessage(error.message)
          setIsLoading(false);
        });
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMessage(errorCode+ "-" + errorMessage);
        setIsLoading(false);
        // ..
      });
     }else{
      signInWithEmailAndPassword(auth,  email.current.value, password.current.value)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        setIsLoading(false);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMessage(errorCode+ "-" + errorMessage);
        setIsLoading(false);
      });
     }
  }

  const toggleClick=()=>{
    setIsSignInForm(!isSigInForm);
  }

  return (
    <div className='relative min-h-screen flex items-center justify-center'>
       <Header/>
       <div className='fixed inset-0 -z-10'>
        <img className='h-full w-full object-cover' src={BG_URL}  alt="logo"/>
        <Particle/>
       </div>
       
       <form onSubmit={(e)=> e.preventDefault()} className='w-[90%] sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-2/5 2xl:w-1/3 max-w-md mx-auto mt-16 sm:mt-20 md:mt-0 p-6 sm:p-8 md:p-10 bg-black text-white rounded-lg bg-opacity-80 backdrop-blur-sm shadow-2xl'>
           <h1 className='text-2xl sm:text-3xl md:text-4xl py-3 sm:py-4 font-bold text-center'>{isSigInForm ? "Sign In":"Sign Up"}</h1>
           
           {!isSigInForm &&  <input  ref={name} type="text" placeholder='FullName' className='p-3 sm:p-4 my-2 w-full bg-gray-700 outline-none rounded text-sm sm:text-base placeholder-gray-400 focus:bg-gray-600 transition-colors' defaultValue={DEFAULT_NAME}/>}

           <input ref={email} type="text" placeholder='Email Address' className='p-3 sm:p-4 my-2 w-full bg-gray-700 outline-none rounded text-sm sm:text-base placeholder-gray-400 focus:bg-gray-600 transition-colors' defaultValue={DEFAULT_EMAIL}/>

           <input ref={password} type="password" placeholder='Password' className='p-3 sm:p-4 my-2 w-full bg-gray-700 outline-none rounded text-sm sm:text-base placeholder-gray-400 focus:bg-gray-600 transition-colors' defaultValue={DEFAULT_PASSWORD}/>

           <p className='text-red-400 font-bold text-xs sm:text-sm min-h-[20px]'>{errorMessage}</p>

           <button 
             className='p-3 sm:p-4 my-3 sm:my-4 font-bold bg-red-700 w-full rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center text-sm sm:text-base hover:bg-red-600 transition-colors shadow-lg hover:shadow-red-500/50' 
             onClick={handleClick}
             disabled={isLoading}
           >
             {isLoading ? (
               <div className='flex items-center gap-2'>
                 <div className='w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                 <span>Loading...</span>
               </div>
             ) : (
               isSigInForm ? "Sign In" : "Sign Up"
             )}
           </button>
           <p className='py-3 sm:py-4 cursor-pointer text-xs sm:text-sm text-center hover:text-red-400 transition-colors' onClick={toggleClick}>{isSigInForm ? "New to Netflix? Sign up now.":"Already Registered? Sign In Now"}</p>
       </form>
    </div>
  )
}

export default Login;