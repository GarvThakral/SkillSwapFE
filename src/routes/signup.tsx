import axios from "axios";
import { useRef, useState } from "react";

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
    const serviceRef = useRef<HTMLInputElement>(null);
    const bioRef = useRef<HTMLInputElement>(null);

    async function loginUser() {
        const form = new FormData();

        if (
            usernameRef.current &&
            emailRef.current &&
            passwordRef.current &&
            confirmPasswordRef.current &&
            bioRef.current &&
            availabilityRef.current &&
            serviceRef.current &&
            imageRef.current &&
            imageRef.current.files
        ) {
            if (passwordRef.current.value !== confirmPasswordRef.current.value) {
                setConfirmPasswordError(true);
                return;
            }
            setConfirmPasswordError(false);

            form.append("username", usernameRef.current.value);
            form.append("email", emailRef.current.value);
            form.append("password", passwordRef.current.value);
            form.append("bio", bioRef.current.value);
            form.append("availabilitySchedule", availabilityRef.current.value);
            form.append("serviceDuration", serviceRef.current.value);
            form.append("profilePicture", imageRef.current.files[0]);

            try {
                await axios.post(`${API_URL}/user/signup`, form, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

            } catch (error: any) {
                console.error("Error:", error.response?.data || error.message);
            }
        } else {
            if (!usernameRef.current?.value) setUsernameError(true);
            if (!emailRef.current?.value) setEmailError(true);
            if (!passwordRef.current?.value) setPasswordError(true);
            if (!imageRef.current?.files?.length) setImageError(true);
        }
    }

    return (
        <div className="h-screen overflow-hidden flex items-center justify-center">
            <div className="w-[500px] h-[700px] shadow-2xl flex flex-col items-center justify-between p-3">
                <span className="text-3xl p-2 px-3 border-b-2">Sign up</span>
                <span className="text-md">Sign up to continue</span>

                <input ref={usernameRef} className="outline-none border-b w-[80%]" placeholder="Username" />
                {usernameError && <span className="text-red-500 w-[80%]">Username is required.</span>}

                <input ref={emailRef} className="outline-none border-b w-[80%]" placeholder="Email" />
                {emailError && <span className="text-red-500 w-[80%]">Email is required.</span>}

                <input ref={passwordRef} className="outline-none border-b w-[80%]" type="password" placeholder="Password" />
                {passwordError && <span className="text-red-500 w-[80%]">Password is required.</span>}

                <input ref={confirmPasswordRef} className="outline-none border-b w-[80%]" type="password" placeholder="Confirm Password" />
                {confirmPasswordError && <span className="text-red-500 w-[80%]">Passwords do not match.</span>}

                <input ref={availabilityRef} className="outline-none border-b w-[80%]" placeholder="Availability (e.g., Mon-Friday)" />
                <input ref={serviceRef} className="outline-none border-b w-[80%]" placeholder="Service Duration (e.g., 4 weeks)" />
                <input ref={bioRef} className="outline-none border-b w-[80%]" placeholder="Bio" />

                <div>
                    <label htmlFor="pfp" className="border-2 p-2 rounded-lg text-black cursor-pointer">Upload Profile Picture</label>
                    <input ref={imageRef} type="file" id="pfp" className="hidden" />
                    {imageError && <span className="text-red-500">Please upload a profile picture.</span>}
                </div>

                <button className="bg-blue-500 text-white px-4 py-2 rounded-sm w-[80%]" onClick={loginUser}>
                    Sign Up
                </button>

                <div className="space-x-8 h-fit py-3 w-[80%] flex justify-between">
                    <span className="border-2 py-2 px-4 rounded-lg">Google</span>
                    <span className="border-2 py-2 px-4 rounded-lg">Linkedin</span>
                    <span className="border-2 py-2 px-4 rounded-lg">SSO</span>
                </div>
            </div>
        </div>
    );
}
