import axios from "axios";
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export function SignIn(){
    const [usernameError,setUsernameError] = useState(false);
    const [passwordError,setpasswordError] = useState(false);

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const location = useNavigate();

    async function signinUser(){
        if(usernameRef.current && passwordRef.current){
            if(usernameRef.current.value.length == 0 || passwordRef.current.value.length == 0){
                if(passwordRef.current.value.length == 0){
                    setpasswordError(true)
                }
                if(usernameRef.current.value.length == 0){
                    setpasswordError(true)
                }
                return;
            }
            
            const response = await axios.post(`${API_URL}/user/signin`,{
                username:usernameRef.current.value,
                password:passwordRef.current.value
            })
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId);
            location('/skills')

        }
    }
    return(
        <div className = {'h-screen overflow-hidden flex items-center justify-center'}>
            <div className = "w-[500px] h-[600px] shadow-2xl flex flex-col items-center justify-between p-3">
                <span className = "text-3xl border-b-2 p-2 px-3">Sign up</span>
                <span className = "text-md">Sign up to continue</span>
                <input ref = {usernameRef} className = "outline-none border-b w-[80%]" placeholder="Username"></input>
                {usernameError ?
                <span className = "text-red-500 w-[80%]">Please enter your username</span>
                :null}
                <input ref = {passwordRef} className = "outline-none border-b w-[80%]" placeholder="Password"></input>
                {passwordError ?
                <span className = "text-red-500 w-[80%]">Please enter your password</span>
                :null}
                <button className = "bg-blue-500 text-white px-4 py-2 rounded-sm w-[80%]" onClick = {signinUser}>Sign Up</button>
                <div className = "space-x-8 h-fit py-3 w-[80%] flex justify-between">
                    <span className = "border-2 py-2 px-4 rounded-lg">Google</span>
                    <span className = "border-2 py-2 px-4 rounded-lg">Linkedin</span>
                    <span className = "border-2 py-2 px-4 rounded-lg">SSO</span>
                </div>
            </div>
        </div>
    );
}