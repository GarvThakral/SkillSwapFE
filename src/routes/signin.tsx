import axios from "axios";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { loaderState } from "../recoil/atoms";
import { motion } from "framer-motion";
import { Loader2, Github, Mail } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

// Custom Button Component
const Button = ({ 
  children, 
  className = "", 
  variant = "default", 
  onClick, 
  disabled = false,
  type = "button"
}: ButtonProps) => {
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

interface LabelProps {
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}

// Custom Label Component
const Label = ({ htmlFor, children, className = "" }: LabelProps) => {
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

export function SignIn() {
    const [usernameError, setUsernameError] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [userExistsError, setUserExistsError] = useState<boolean>(false);
    
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useRecoilState(loaderState);
    const navigate = useNavigate();

    async function signinUser() {
        setIsLoading(true);
        setUsernameError(false);
        setPasswordError(false);
        setUserExistsError(false);
        
        if (usernameRef.current && passwordRef.current) {
            if (usernameRef.current.value.length === 0 || passwordRef.current.value.length === 0) {
                if (passwordRef.current.value.length === 0) {
                    setPasswordError(true);
                }
                if (usernameRef.current.value.length === 0) {
                    setUsernameError(true);
                }
                setIsLoading(false);
                return;
            }
            
            try {
                const response = await axios.post(`${API_URL}/user/signin`, {
                    username: usernameRef.current.value,
                    password: passwordRef.current.value
                });
                
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.userId);
                setIsLoading(false);
                navigate('/skills');
                
            } catch (e) {
                setUserExistsError(true);
                setIsLoading(false);
                console.log(e);
            }
        }
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
                                <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
                                <p className="text-gray-500">Sign in to your account</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <input
                                        id="username"
                                        ref={usernameRef}
                                        placeholder="johndoe"
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${usernameError ? "border-red-500" : ""}`}
                                    />
                                    {usernameError && <p className="text-sm text-red-500">Please enter your username</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <input
                                        id="password"
                                        type="password"
                                        ref={passwordRef}
                                        placeholder="••••••••"
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${passwordError ? "border-red-500" : ""}`}
                                    />
                                    {passwordError && <p className="text-sm text-red-500">Please enter your password</p>}
                                </div>
                                
                                {userExistsError && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                                        Invalid credentials. Please check your username and password.
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <input type="checkbox" id="remember" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                        <Label htmlFor="remember">Remember me</Label>
                                    </div>
                                    <a href="#" className="text-sm text-indigo-600 hover:underline">
                                        Forgot password?
                                    </a>
                                </div>

                                <Button
                                    className="w-full"
                                    onClick={signinUser}
                                    disabled={isLoading}
                                >
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Sign In
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
                                    <Button variant="outline" className="w-full">
                                        <Github className="mr-2 h-4 w-4" />
                                        Github
                                    </Button>
                                    <Button variant="outline" className="w-full">
                                        <Mail className="mr-2 h-4 w-4" />
                                        Google
                                    </Button>
                                    <Button variant="outline" className="w-full">
                                        SSO
                                    </Button>
                                </div>

                                <p className="text-center text-sm text-gray-500">
                                    Don't have an account?{" "}
                                    <Link to="/signup" className="text-indigo-600 underline-offset-4 hover:underline">
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Illustration */}
                    <div className="hidden md:block flex-1 bg-gradient-to-br from-indigo-100 via-indigo-50 to-white p-8">
                        <div className="relative h-full w-full">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 via-indigo-100 to-white rounded-2xl">
                                <div className="p-8 h-full flex flex-col justify-center">
                                    <h2 className="text-2xl font-bold mb-4">Welcome to SkillSwap</h2>
                                    <p className="text-gray-600">
                                        Sign in to access your account and continue your skill sharing journey.
                                    </p>
                                    <ul className="mt-6 space-y-2 text-sm">
                                        <li className="flex items-center">
                                            <span className="mr-2">✓</span> Access your dashboard
                                        </li>
                                        <li className="flex items-center">
                                            <span className="mr-2">✓</span> Connect with other members
                                        </li>
                                        <li className="flex items-center">
                                            <span className="mr-2">✓</span> Schedule new sessions
                                        </li>
                                        <li className="flex items-center">
                                            <span className="mr-2">✓</span> Track your learning progress
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