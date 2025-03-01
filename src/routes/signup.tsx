import axios from "axios";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { loaderState } from "../recoil/atoms";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Upload, Github, Mail } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

// Custom Button Component
const Button = ({ 
  children, 
  className = "", 
  variant = "default", 
  onClick, 
  disabled = false,
  type = "button"
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variantStyles = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 focus:ring-gray-500"
  };
  
  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${className} px-4 py-2`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Custom Input Component
const Input = ({ 
  id, 
  type = "text", 
  className = "", 
  placeholder, 
  ref,
  onChange,
  accept
}) => {
  return (
    <input
      id={id}
      type={type}
      ref={ref}
      placeholder={placeholder}
      accept={accept}
      onChange={onChange}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${className}`}
    />
  );
};

// Custom Label Component
const Label = ({ htmlFor, children, className = "" }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 ${className}`}
    >
      {children}
    </label>
  );
};

// Custom Separator Component
const Separator = () => {
  return <div className="h-px bg-gray-200 w-full"></div>;
};

export function SignUp() {
    const [usernameError, setUsernameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [imageError, setImageError] = useState(false);

    const usernameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const imageRef = useRef(null);
    const availabilityRef = useRef(null);
    const bioRef = useRef(null);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useRecoilState(loaderState);

    const [previewImage, setPreviewImage] = useState(null);
    
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
          setImageError(false);
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewImage(reader.result);
          };
          reader.readAsDataURL(file);
        }
    };

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
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
        }
    
        setIsLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
                <div className="flex flex-col md:flex-row">
                    {/* Left Side - Form */}
                    <div className="flex-1 p-8">
                        <div className="space-y-6">
                            <div className="space-y-2 text-center">
                                <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
                                <p className="text-gray-500">Enter your information to get started</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input
                                            id="username"
                                            ref={usernameRef}
                                            placeholder="johndoe"
                                            className={usernameError ? "border-red-500" : ""}
                                        />
                                        {usernameError && <p className="text-sm text-red-500">Username is required</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            ref={emailRef}
                                            placeholder="john@example.com"
                                            className={emailError ? "border-red-500" : ""}
                                        />
                                        {emailError && <p className="text-sm text-red-500">Email is required</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            ref={passwordRef}
                                            className={passwordError ? "border-red-500" : ""}
                                        />
                                        {passwordError && <p className="text-sm text-red-500">Password is required</p>}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="availability">Availability</Label>
                                        <Input id="availability" ref={availabilityRef} placeholder="Mon-Friday" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Input id="bio" ref={bioRef} placeholder="Tell us about yourself" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            ref={confirmPasswordRef}
                                            className={confirmPasswordError ? "border-red-500" : ""}
                                        />
                                        {confirmPasswordError && <p className="text-sm text-red-500">Passwords do not match</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-100">
                                        {previewImage ? (
                                            <img
                                                src={previewImage || "/placeholder.svg"}
                                                alt="Profile preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                <Upload className="w-8 h-8 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2 text-center">
                                        <Label
                                            htmlFor="pfp"
                                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 bg-gray-100 text-gray-700 shadow-sm hover:bg-gray-200 h-9 px-4 py-2 cursor-pointer"
                                        >
                                            Upload Profile Picture
                                        </Label>
                                        <input
                                            ref={imageRef}
                                            type="file"
                                            id="pfp"
                                            className="hidden"
                                            onChange={handleImageChange}
                                            accept="image/*"
                                        />
                                        {imageError && <p className="text-sm text-red-500">Please upload a profile picture</p>}
                                    </div>
                                </div>

                                <Button 
                                    className="w-full" 
                                    onClick={() => loginUser()} 
                                    disabled={isLoading}
                                >
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Account
                                </Button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <Separator />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <Button style="Secondary" className="w-full">
                                        <Github className="mr-2 h-4 w-4" />
                                        Github
                                    </Button>
                                    <Button style="Secondary" className="w-full">
                                        <Mail className="mr-2 h-4 w-4" />
                                        Google
                                    </Button>
                                    <Button style="Secondary" className="w-full">
                                        SSO
                                    </Button>
                                </div>

                                <p className="text-center text-sm text-gray-500">
                                    Already have an account?{" "}
                                    <Link to="/signin" className="text-indigo-600 underline-offset-4 hover:underline">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Image/Illustration */}
                    <div className="hidden md:block flex-1 bg-gradient-to-br from-indigo-100 via-indigo-50 to-white p-8">
                        <div className="relative h-full w-full">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 via-indigo-100 to-white rounded-2xl">
                                <div className="p-8 h-full flex flex-col justify-center">
                                    <h2 className="text-2xl font-bold mb-4">Join SkillSwap Today</h2>
                                    <p className="text-gray-600">
                                        Connect with skilled individuals, share your expertise, and learn something new. Our platform makes
                                        skill exchange easy and rewarding.
                                    </p>
                                    <ul className="mt-6 space-y-2 text-sm">
                                        <li className="flex items-center">
                                            <span className="mr-2">✓</span> Live video sessions
                                        </li>
                                        <li className="flex items-center">
                                            <span className="mr-2">✓</span> Token-based economy
                                        </li>
                                        <li className="flex items-center">
                                            <span className="mr-2">✓</span> Secure messaging
                                        </li>
                                        <li className="flex items-center">
                                            <span className="mr-2">✓</span> Flexible scheduling
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}