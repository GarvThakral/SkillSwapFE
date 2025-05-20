import  { useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { loaderState } from "../recoil/atoms";
import Loader from "../components/loader";
import { Button } from "../components/Button";
import { Home as HomeIcon } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export function SignIn() {
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [credentialsError, setCredentialsError] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useRecoilState(loaderState);
  const navigate = useNavigate();

  async function signinUser() {
    setIsLoading(true);
    setUsernameError(false);
    setPasswordError(false);
    setCredentialsError(false);

    const username = usernameRef.current?.value.trim() || "";
    const password = passwordRef.current?.value || "";

    if (!username || !password) {
      if (!username) setUsernameError(true);
      if (!password) setPasswordError(true);
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(`${API_URL}/user/signin`, { username, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      navigate("/skills");
    } catch {
      setCredentialsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      {/* Nav / Home */}
      <header className="w-full max-w-md mb-6 flex justify-start">
        <Link to="/">
          <Button
            text="Home"
            icon={<HomeIcon className="w-4 h-4" />}
            className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            onClick={() => {}}
          />
        </Link>
      </header>

      {isLoading && <Loader />}

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Sign In</h1>

        <div className="space-y-2">
          <label className="block text-gray-700">Username</label>
          <input
            ref={usernameRef}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your username"
          />
          {usernameError && <p className="text-red-500 text-sm">Username is required.</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700">Password</label>
          <input
            ref={passwordRef}
            type="password"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your password"
          />
          {passwordError && <p className="text-red-500 text-sm">Password is required.</p>}
        </div>

        {credentialsError && (
          <p className="text-red-500 text-sm text-center">Invalid credentials, please try again.</p>
        )}

        <Button
          text={isLoading ? "Signing In…" : "Sign In"}
          onClick={signinUser}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition"
        />

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-purple-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
