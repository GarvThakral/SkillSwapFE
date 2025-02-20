import axios from "axios";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { loaderState } from "../recoil/atoms";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/loader";

const API_URL = import.meta.env.VITE_API_URL;

export function SignUp() {
    const [usernameError, setUsernameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [imageError, setImageError] = useState(false);

    const usernameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLInputElement>(null);
    const availabilityRef = useRef<HTMLInputElement>(null);
    const bioRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate()
    const [ isLoading , setIsLoading ] = useRecoilState(loaderState)
    
    async function loginUser() {
        setIsLoading(true);
        setUsernameError(false);
        setEmailError(false);
        setPasswordError(false);
        setConfirmPasswordError(false);
        setImageError(false);
    
        if (
            !usernameRef.current?.value ||
            !emailRef.current?.value ||
            !passwordRef.current?.value ||
            !confirmPasswordRef.current?.value ||
            !bioRef.current?.value ||
            !availabilityRef.current?.value ||
            !imageRef.current?.files?.length
        ) {
            if (!usernameRef.current?.value) setUsernameError(true);
            if (!emailRef.current?.value) setEmailError(true);
            if (!passwordRef.current?.value) setPasswordError(true);
            if (!confirmPasswordRef.current?.value) setConfirmPasswordError(true);
            if (!bioRef.current?.value) setConfirmPasswordError(true);
            if (!availabilityRef.current?.value) setConfirmPasswordError(true);
            if (!imageRef.current?.files?.length) setImageError(true);
            
            setIsLoading(false);
            return; 
        }
    
        if (passwordRef.current.value !== confirmPasswordRef.current.value) {
            setConfirmPasswordError(true);
            setIsLoading(false);
            return;
        }
    
        const form = new FormData();
        form.append("username", usernameRef.current.value);
        form.append("email", emailRef.current.value);
        form.append("password", passwordRef.current.value);
        form.append("bio", bioRef.current.value);
        form.append("availabilitySchedule", availabilityRef.current.value);
        form.append("profilePicture", imageRef.current.files[0]);
    
        try {
            await axios.post(`${API_URL}/user/signup`, form, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            navigate('/skills');
        } catch (error: any) {
            console.error("Error:", error.response?.data || error.message);
        }
    
        setIsLoading(false);
    }
    

    return (
        <div className="h-screen overflow-hidden flex items-center justify-center">
            {isLoading ? <Loader/>:null}
            <div className="min-w-[400px] max-w-[800px] w-[80%] h-[500px] shadow-2xl flex flex-col items-center justify-around p-3">
                <span className="text-3xl p-2 px-3 border-b-2">Sign up</span>
                <div className = {'flex w-[80%]'}>

                    <div className = {'flex-1 flex flex-col items-center space-y-5'}>
                        <input ref={usernameRef} className="outline-none border-b w-[80%]" placeholder="Username" />
                        {usernameError && <span className="text-red-500 w-[80%]">Username is required.</span>}

                        <input ref={emailRef} className="outline-none border-b w-[80%]" placeholder="Email" />
                        {emailError && <span className="text-red-500 w-[80%]">Email is required.</span>}

                        <input ref={passwordRef} className="outline-none border-b w-[80%]" type="password" placeholder="Password" />
                        {passwordError && <span className="text-red-500 w-[80%]">Password is required.</span>}


                    </div>
                    <div className = {'flex-1 flex flex-col items-center space-y-5'}>
                        <input ref={availabilityRef} className="outline-none border-b w-[80%]" placeholder="Availability (e.g., Mon-Friday)" />
                        <input ref={bioRef} className="outline-none border-b w-[80%]" placeholder="Bio" />
                        <input ref={confirmPasswordRef} className="outline-none border-b w-[80%]" type="password" placeholder="Confirm Password" />
                        {confirmPasswordError && <span className="text-red-500 w-[80%]">Passwords do not match.</span>}
                    </div>
                </div>

                <div className = {'flex flex-col'}>
                    <label htmlFor="pfp" className="border-2 p-2 rounded-lg text-black cursor-pointer">Upload Profile Picture</label>
                    <input ref={imageRef} type="file" id="pfp" className="hidden" />
                    {imageError && <span className="text-red-500">Please upload a profile picture.</span>}
                </div>

                <button className="bg-blue-500 text-white px-4 py-2 rounded-sm w-[40%]" onClick={()=>loginUser()}>
                    Sign Up
                </button>

                <div className="h-fit py-3 w-[80%] flex justify-around">
                    <span className="border-2 py-2 px-4 rounded-lg">Google</span>
                    <span className="border-2 py-2 px-4 rounded-lg">Linkedin</span>
                    <span className="border-2 py-2 px-4 rounded-lg">SSO</span>
                </div>
                <Link to = "/signin"><span className="text-md text-blue-600 text-md cursor-pointer">Sign in instead ?</span></Link>

            </div>
        </div>
    );
}
