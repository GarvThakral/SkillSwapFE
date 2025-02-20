import { useRecoilState, useSetRecoilState } from "recoil";
import { Button } from "../components/buttons";
import { Input } from "../components/input";
import { messageButtonState, originalResponseState, responseState, sideBarState, signInState, userTokens } from "../recoil/atoms";
import {   useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom'
import { NotificationBell } from "../components/notification";
import { MessageButton } from "../components/messageButtonIcon";
import axios from "axios";
import { BurgerIcon } from "../components/burgerIcon";
import { SideBar } from "../components/sideBar";

const API_URL = import.meta.env.VITE_API_URL;

export function NavBar(){
  const [signedIn,setIsSignedIn] = useRecoilState<boolean>(signInState);
  const setResponse = useSetRecoilState(responseState);
  const [originalResponse] = useRecoilState(originalResponseState);
  const location = useLocation();
  const  setMessageButtonOn  = useSetRecoilState(messageButtonState);
  const [ userToken , setUserTokens ] = useRecoilState(userTokens);
  const setSideBarOpen  = useSetRecoilState(sideBarState);
  async function searchSkills(searchParam:string){
    if(searchParam.length === 0){
      setResponse(originalResponse);
      return
    }
    const filteredResponse = originalResponse?.filter((item) =>
      item.skill.title.toLowerCase().includes(searchParam.toLowerCase())
    );
  
    setResponse(filteredResponse ?? null);

  }
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
  <div className = {'h-16 bg-[#0B2638] flex items-center justify-between text-white px-12 overflow-hidden '}>
    <img src = "swap.png" className = "size-14"></img>
    <div className = {'items-center text-xs lg:text-sm  hidden md:flex lg:space-x-12 space-x-6'}>
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
          <img src = "coin.png" className = "size-8"></img>
          <span className="text-sm pr-2">{userToken}</span>
        </div>:
        null 
      }
    </div>
    <div className = "items-center hidden md:flex">
      
      {signedIn ?
      <Link to = "/">
        <Button text="Log out" style ="Tertiary" onclick={()=>logUserOut()}/>
      </Link> :
      <Link to = "/signup">
        <Button text="Sign Up" style ="Tertiary"/>
      </Link> 
      }
    </div>
    <div onClick = {()=>{setSideBarOpen((c)=>!c) ; setMessageButtonOn(false)}} className = {'md:hidden'}>
      <BurgerIcon />
    </div>
  </div>
  );
}