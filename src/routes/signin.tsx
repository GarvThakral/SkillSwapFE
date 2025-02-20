import axios from "axios";
import { useRef, useState } from "react";
import {  Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { loaderState } from "../recoil/atoms";
import Loader from "../components/loader";

const API_URL = import.meta.env.VITE_API_URL;

export function SignIn(){
    const [usernameError,setUsernameError] = useState(false);
    const [passwordError,setpasswordError] = useState(false);
    const [userExistsError,setUserExistsError] = useState(false);
    console.log(setUsernameError)
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [ isLoading , setIsLoading ] = useRecoilState(loaderState)
    const navigate = useNavigate();

    async function signinUser(){
        setIsLoading(true);
        setUsernameError(false);
        setpasswordError(false);
        setUserExistsError(false);
        if(usernameRef.current && passwordRef.current){
            if(usernameRef.current.value.length == 0 || passwordRef.current.value.length == 0){
                if(passwordRef.current.value.length == 0){
                    setpasswordError(true)
                }
                if(usernameRef.current.value.length == 0){
                    setUsernameError(true)
                }
            setIsLoading(false);

                return;
            }
            try{
                const response = await axios.post(`${API_URL}/user/signin`,{
                    username:usernameRef.current.value,
                    password:passwordRef.current.value
                })
                if(response.status == 303){

                }
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.userId);
                setIsLoading(false);
                navigate('/skills')
                
            }catch(e){
                setUserExistsError(true);
                setIsLoading(false);
                console.log(e);
            }


        }
    }
    return(
        <div className = {'h-screen overflow-hidden flex items-center justify-center'}>
            {isLoading ? <Loader/>:null}
            <div className = "w-[500px] h-[600px] shadow-2xl flex flex-col items-center justify-around p-3">
                <span className = "text-3xl border-b-2 p-2 px-3">Sign up</span>
                <div className = {'flex flex-col w-[80%]'}>
                    <input ref = {usernameRef} className = "outline-none border-b w-[80%]" placeholder="Username"></input>
                    {usernameError ?
                    <span className = "text-red-500 w-[80%]">Please enter your username</span>
                    :null}
                </div>
                <div className = {'flex flex-col w-[80%]'}>
                    <input ref = {passwordRef} className = "outline-none border-b w-[80%]" placeholder="Password"></input>
                    {passwordError ?
                    <span className = "text-red-500 w-[80%]">Please enter your password</span>
                    :null}
                </div>
                    {userExistsError ?
                    <span className = "text-red-500 w-[80%]">Please check your credentials</span>
                    :null}
                <button className = "bg-blue-500 text-white px-4 py-2 rounded-sm w-[80%]" onClick = {signinUser}>Sign Up</button>
                <div className = "space-x-8 h-fit py-3 w-[80%] flex justify-between">
                    <span className = "border-2 py-2 px-4 rounded-lg">Google</span>
                    <span className = "border-2 py-2 px-4 rounded-lg">Linkedin</span>
                    <span className = "border-2 py-2 px-4 rounded-lg">SSO</span>
                </div>
                <Link to = "/signup"><span className="text-md text-blue-600 text-md cursor-pointer">Sign up instead ?</span></Link>

            </div>
        </div>
    );
}