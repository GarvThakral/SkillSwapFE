import { Link } from "react-router-dom";
import { NotificationBell } from "./notification";
import { MessageButton } from "./messageButtonIcon";
import { messageButtonState, originalResponseState, responseState, sideBarState, userTokens } from "../recoil/atoms";
import { Button } from "./buttons";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL

export function SideBar(){
    const [ signedIn , setSignedIn ] = useState(false);
    const  setMessageButtonOn  = useSetRecoilState(messageButtonState);
    const setResponse = useSetRecoilState(responseState);
    const [originalResponse] = useRecoilState(originalResponseState);
    const [ userToken , setUserTokens ] = useRecoilState(userTokens);
    const setSideBarOpen  = useSetRecoilState(sideBarState);
    

    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(token){
            setSignedIn(true);
        }
        fetchUserTokens();
    },[])
    // async function searchSkills(searchParam:string){
    //     if(searchParam.length === 0){
    //     setResponse(originalResponse);
    //     return
    //     }
    //     const filteredResponse = originalResponse?.filter((item) =>
    //     item.skill.title.toLowerCase().includes(searchParam.toLowerCase())
    //     );
  
    //     setResponse(filteredResponse ?? null);

    // }
    async function fetchUserTokens(){
        const userId = parseInt(localStorage.getItem("userId") ?? '0');
        const response = await axios.post(`${API_URL}/user/tokens`,{
        userId
        })
        setUserTokens(response.data.UsersTokens.tokens)
    }
    return (
        <div className = {'sm:w-52 w-screen h-screen absolute top-0 right-0 bg-gray-950 bg-opacity-90 backdrop-blur-sm flex flex-col justify-center space-y-8 mt-16 items-center z-10 text-white'}>
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
                {signedIn ? <div className = {'cursor-pointer'}><MessageButton onClick = {()=>{setMessageButtonOn((c)=>!c) ;  setSideBarOpen(false)} }/></div> :null}
                <Link to = "/purchase">
                <span>Buy tokens</span>
                </Link>
                {signedIn ? 
                <div className = "flex items-center">
                    <img src = "coin.png" className = "size-12"></img>
                    <span className="mr-12">{userToken}</span>
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
    );
}