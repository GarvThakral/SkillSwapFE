import { useRecoilState, useSetRecoilState } from "recoil";
import { Button } from "../components/buttons";
import { Input } from "../components/input";
import { messageButtonState, originalResponseState, responseState, signInState } from "../recoil/atoms";
import {  useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom'
import { NotificationBell } from "../components/notification";
import { MessageButton } from "../components/messageButtonIcon";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export function NavBar(){
  const [signedIn,setIsSignedIn] = useRecoilState<boolean>(signInState);
  const setResponse = useSetRecoilState(responseState);
  const [originalResponse] = useRecoilState(originalResponseState);
  const location = useLocation();
  const  setMessageButtonOn  = useSetRecoilState(messageButtonState);
  const [ userTokens , setUserTokens ] = useState(100)

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
  async function fetchUserTokens(){
    const userId = parseInt(localStorage.getItem("userId") ?? '0');
    const response = await axios.post(`${API_URL}/user/tokens`,{
      userId
    })
    setUserTokens(response.data.UsersTokens.tokens)
  }

  useEffect(()=>{
    const token = localStorage.getItem('token');
    fetchUserTokens();
    if(token){
      setIsSignedIn(true)
    }else{
      setIsSignedIn(false)
    }
  });

  return(
  <div className = {'h-16 w-full bg-[#0B2638] flex items-center justify-between text-white px-12'}>
    <img src = "swap.png" className = "size-12"></img>
    <div className = {'flex items-center space-x-16'}>
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
      {signedIn ? <div className = {'cursor-pointer'}><MessageButton onClick = {()=>setMessageButtonOn((c)=>!c)}/></div> :null}
    </div>
    {location.pathname == '/skills' ? <Input changeFunction={async (e: React.ChangeEvent<HTMLInputElement>) => {await searchSkills(e.target.value);}} />:null}
    <div className = "flex items-center">
      {signedIn ? 
        <div className = "flex items-center">
          <img src = "coin.png" className = "size-12"></img>
          <span className="mr-12">{userTokens}</span>
        </div>:
        null 
      }
      
      {signedIn ?
      <Link to = "/signin">
        <Button text="Sign In" style ="Tertiary"/>
      </Link> :
      <Link to = "/signup">
        <Button text="Sign Up" style ="Tertiary"/>
      </Link> 
      }
    </div>
  </div>
  );
}