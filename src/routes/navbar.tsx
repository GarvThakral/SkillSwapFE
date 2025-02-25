import { useRecoilState, useSetRecoilState } from "recoil";
import { Button } from "../components/buttons";
import { messageButtonState,  sideBarState, signInState, userTokens } from "../recoil/atoms";
import {   useEffect } from "react";
import { Link, useLocation } from 'react-router-dom'
import { NotificationBell } from "../components/notification";
import { MessageButton } from "../components/messageButtonIcon";
import axios from "axios";
import { BurgerIcon } from "../components/burgerIcon";

const API_URL = import.meta.env.VITE_API_URL;

export function NavBar(){
  const [signedIn,setIsSignedIn] = useRecoilState<boolean>(signInState);
  const location = useLocation();
  const  setMessageButtonOn  = useSetRecoilState(messageButtonState);
  const [ userToken , setUserTokens ] = useRecoilState(userTokens);
  const setSideBarOpen  = useSetRecoilState(sideBarState);
  // async function searchSkills(searchParam:string){
  //   if(searchParam.length === 0){
  //     setResponse(originalResponse);
  //     return
  //   }
  //   const filteredResponse = originalResponse?.filter((item) =>
  //     item.skill.title.toLowerCase().includes(searchParam.toLowerCase())
  //   );
  
  //   setResponse(filteredResponse ?? null);

  // }
  async function fetchUserToken(){
    const userId = parseInt(localStorage.getItem("userId") ?? '0');
    const response = await axios.post(`${API_URL}/user/tokens`,{
      userId
    })
    setUserTokens(response.data.UsersTokens.tokens)
  }

  useEffect(()=>{
    const token = localStorage.getItem('token');
    fetchUserToken();
    if(token){
      setIsSignedIn(true)
    }else{
      setIsSignedIn(false)
    }
  });

  function logUserOut(){
    console.log("seems to be working")
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
  }

  return(
  <div className = {'h-16 flex items-center justify-between text-black px-12 overflow-hidden border-b'}>
    <img src = "swap.png" className = "size-14"></img>
    <div className = {`items-center text-xs lg:text-lg  hidden md:flex lg:space-x-12 space-x-6 font-['DM_sans'] `}>
      {location.pathname !== '/skills' ? 
        <Link to = "/skills">
          <span>Browse skills</span>
        </Link>
        :
        null  
      }
      <Link to = "/create">
        <span>Create a request</span>
      </Link>
      <Link to = "/about">
        <span>About us</span>
      </Link>
      <Link to = "/notifications">
        <NotificationBell />
      </Link>
      { signedIn ? 
        <div>
        <MessageButton 
          onClick={() => {
            setMessageButtonOn((c) => !c);
            setSideBarOpen(false);
          }} 
        /> 
        </div>
        : null
      }
      <Link to = "/purchase">
        <span>Buy tokens</span>
      </Link>
      {signedIn ? 
        <div className = "flex items-center">
          <img src = "token.svg" className = "size-6 m-1"></img>
          <span className="text-sm pr-2">{userToken}</span>
        </div>:
        null 
      }
    </div>
    <div className = "items-center hidden md:flex">
      
      {signedIn ?
      <Link to = "/">
        <Button text="Log out" style ="Primary" onclick={()=>logUserOut()}/>
      </Link> :
      <div className =  {'flex'}>
        <Link to = "/signup">
          <Button text="Login" style ="Tertiary"/>
        </Link> 
        <Link to = "/signup">
          <Button text="Create Account" style ="Secondary"/>
        </Link>
      </div> 
      }
    </div>
    <div onClick = {()=>{setSideBarOpen((c)=>!c) ; setMessageButtonOn(false)}} className = {'md:hidden'}>
      <BurgerIcon />
    </div>
  </div>
  );
}