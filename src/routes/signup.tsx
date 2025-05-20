// src/pages/SignUp.tsx
import React, { useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { loaderState } from "../recoil/atoms";
import Loader from "../components/loader";

const API_URL = import.meta.env.VITE_API_URL;

// Reusable InputField Component
const InputField = React.forwardRef<HTMLInputElement, {
  label: string;
  placeholder?: string;
  type?: string;
  error: boolean;
}>(function InputField({ label, placeholder, type = "text", error }, ref) {
  return (
    <div className="space-y-1">
      <label className="block text-gray-700 font-medium">{label}</label>
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-500 text-sm">{label} is required.</p>}
    </div>
  );
});
InputField.displayName = "InputField";

export function SignUp() {
  const [errors, setErrors] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    bio: false,
    availability: false,
    image: false,
  });
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const bioRef = useRef<HTMLInputElement>(null);
  const availabilityRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useRecoilState(loaderState);
  const navigate = useNavigate();

  // handle file selection + preview
  function handleImageChange() {
    const file = imageRef.current?.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setErrors((e) => ({ ...e, image: false }));
    }
  }

  async function signupUser() {
    setIsLoading(true);
    setErrors({
      username: false,
      email: false,
      password: false,
      confirmPassword: false,
      bio: false,
      availability: false,
      image: false,
    });

    const vals = {
      username: usernameRef.current?.value.trim() || "",
      email: emailRef.current?.value.trim() || "",
      password: passwordRef.current?.value || "",
      confirmPassword: confirmPasswordRef.current?.value || "",
      bio: bioRef.current?.value.trim() || "",
      availability: availabilityRef.current?.value.trim() || "",
      image: imageRef.current?.files?.[0] || null,
    };

    // validate
    const newErr = { ...errors };
    if (!vals.username) newErr.username = true;
    if (!vals.email) newErr.email = true;
    if (!vals.password) newErr.password = true;
    if (!vals.confirmPassword) newErr.confirmPassword = true;
    if (!vals.bio) newErr.bio = true;
    if (!vals.availability) newErr.availability = true;
    if (!vals.image) newErr.image = true;
    if (vals.password && vals.confirmPassword && vals.password !== vals.confirmPassword) {
      newErr.confirmPassword = true;
    }

    if (Object.values(newErr).some(Boolean)) {
      setErrors(newErr);
      setIsLoading(false);
      return;
    }

    const form = new FormData();
    form.append("username", vals.username);
    form.append("email", vals.email);
    form.append("password", vals.password);
    form.append("bio", vals.bio);
    form.append("availabilitySchedule", vals.availability);
    form.append("profilePicture", vals.image!);

    try {
      await axios.post(`${API_URL}/user/signup`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/skills");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      {isLoading && <Loader />}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Create Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <InputField label="Username" ref={usernameRef} error={errors.username} placeholder="Your username" />
            <InputField label="Email" ref={emailRef} type="email" error={errors.email} placeholder="you@example.com" />
            <InputField label="Password" ref={passwordRef} type="password" error={errors.password} placeholder="Password" />
          </div>
          <div className="space-y-4">
            <InputField label="Availability" ref={availabilityRef} error={errors.availability} placeholder="e.g. Mon–Fri" />
            <InputField label="Bio" ref={bioRef} error={errors.bio} placeholder="Short bio" />
            <InputField
              label="Confirm Password"
              ref={confirmPasswordRef}
              type="password"
              error={errors.confirmPassword}
              placeholder="Repeat password"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Profile Picture</label>
          <div className="flex items-center space-x-4">
            <label
              htmlFor="pfp"
              className="bg-gray-100 px-4 py-2 rounded cursor-pointer hover:bg-gray-200"
            >
              Choose File
            </label>
            {previewUrl && (
              <img src={previewUrl} alt="preview" className="w-16 h-16 rounded-full object-cover border" />
            )}
          </div>
          <input id="pfp" type="file" ref={imageRef} className="hidden" onChange={handleImageChange} />
          {errors.image && <p className="text-red-500 text-sm">Image is required.</p>}
        </div>

        <button
          onClick={signupUser}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition"
        >
          Sign Up
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/signin" className="text-purple-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
