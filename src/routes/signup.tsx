import axios from "axios";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { loaderState } from "../recoil/atoms";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Upload, Github, Mail } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

// Define prop types
interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  style?: string;
}

// Custom Button Component
const Button = ({ 
  children, 
  className = "", 
  variant = "default", 
  onClick, 
  disabled = false,
  type = "button",
  style 
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variantStyles = {
    default: "bg-black text-white hover:bg-gray-800 focus:ring-gray-500",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 focus:ring-gray-500"
  };
  
  const secondaryStyle = style === "Secondary" ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "";
  
  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${secondaryStyle} ${className} px-4 py-2`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Define Input props interface
interface InputProps {
  id: string;
  type?: string;
  className?: string;
  placeholder?: string;
  ref?: React.RefObject<HTMLInputElement>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
}

// Custom Input Component
const Input = ({ 
  id, 
  type = "text", 
  className = "", 
  placeholder, 
  onChange,
  accept
}: InputProps) => {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      accept={accept}
      onChange={onChange}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 ${className}`}
    />
  );
};

// Define Label props interface
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
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useRecoilState(loaderState);

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          setImageError(false);
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewImage(reader.result as string);
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
        if (imageRef.current.files?.[0]) {
            form.append("profilePicture", imageRef.current.files[0]);
        }
    
        try {
            await axios.post(`${API_URL}/user/signup`, form, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            navigate('/skills');
        } catch (error) {
            console.error("Error:", error);
        }
    
        setIsLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4">
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
                                            placeholder="johndoe"
                                            className={usernameError ? "border-red-500" : ""}
                                        />
                                        <input
                                            type="text"
                                            id="username-hidden"
                                            ref={usernameRef}
                                            className="hidden"
                                        />
                                        {usernameError && <p className="text-sm text-red-500">Username is required</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            className={emailError ? "border-red-500" : ""}
                                        />
                                        <input
                                            type="email"
                                            id="email-hidden"
                                            ref={emailRef}
                                            className="hidden"
                                        />
                                        {emailError && <p className="text-sm text-red-500">Email is required</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            className={passwordError ? "border-red-500" : ""}
                                        />
                                        <input
                                            type="password"
                                            id="password-hidden"
                                            ref={passwordRef}
                                            className="hidden"
                                        />
                                        {passwordError && <p className="text-sm text-red-500">Password is required</p>}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="availability">Availability</Label>
                                        <Input id="availability" placeholder="Mon-Friday" />
                                        <input
                                            type="text"
                                            id="availability-hidden"
                                            ref={availabilityRef}
                                            className="hidden"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Input id="bio" placeholder="Tell us about yourself" />
                                        <input
                                            type="text"
                                            id="bio-hidden"
                                            ref={bioRef}
                                            className="hidden"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            className={confirmPasswordError ? "border-red-500" : ""}
                                        />
                                        <input
                                            type="password"
                                            id="confirmPassword-hidden"
                                            ref={confirmPasswordRef}
                                            className="hidden"
                                        />
                                        {confirmPasswordError && <p className="text-sm text-red-500">Passwords do not match</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100">
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
                                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-500 disabled:pointer-events-none disabled:opacity-50 bg-gray-100 text-gray-700 shadow-sm hover:bg-gray-200 h-9 px-4 py-2 cursor-pointer"
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
                                    <Link to="/signin" className="text-black underline-offset-4 hover:underline">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Image/Illustration */}
                    <div className="hidden md:block flex-1 bg-gradient-to-br from-gray-100 via-gray-50 to-white p-8">
                        <div className="relative h-full w-full">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-white rounded-2xl">
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