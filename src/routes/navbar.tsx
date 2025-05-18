import { useRecoilState, useSetRecoilState } from "recoil";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

import { Button } from "../components/Button.tsx";
import { NotificationBell } from "./notification/NotificationBell";
import { MessageButtonIcon } from "./icons/MessageButtonIcon";
import { BurgerIcon } from "./icons/BurgerIcon";
import { Search, PlusCircle, Info, ShoppingBag, LogOut, LogIn, UserPlus } from "lucide-react";

import {
  messageButtonState,
  sideBarState,
  signInState,
  userTokens,
} from "../recoil/atoms";
import { useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export function NavBar() {
  const [signedIn, setSignedIn] = useRecoilState(signInState);
  const location = useLocation();
  const setMessageButtonOn = useSetRecoilState(messageButtonState);
  const [tokens, setTokens] = useRecoilState(userTokens);
  const setSideBarOpen = useSetRecoilState(sideBarState);

  // Fetch the user's token count
  async function fetchUserTokens() {
    const userId = Number(localStorage.getItem("userId") ?? "0");
    if (!userId) return;
    try {
      const { data } = await axios.post(`${API_URL}/user/tokens`, { userId });
      setTokens(data.UsersTokens.tokens);
    } catch (err) {
      console.error("Failed to fetch tokens", err);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    setSignedIn(!!token);
    fetchUserTokens();
  }, []); // only run once on mount

  function logUserOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setSignedIn(false);
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/S-removebg-preview.png" alt="SkillSwap" className="h-12 w-auto" />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent hidden sm:block">
              SkillSwap
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {location.pathname !== "/skills" && (
              <Link
                to="/skills"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors"
              >
                <Search className="w-4 h-4 mr-2" />
                Browse Skills
              </Link>
            )}
            <Link
              to="/create"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Request
            </Link>
            <Link
              to="/about"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors"
            >
              <Info className="w-4 h-4 mr-2" />
              About Us
            </Link>
            <Link
              to="/notifications"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors"
            >
              <NotificationBell />
            </Link>

            {signedIn && (
              <button
                onClick={() => {
                  setMessageButtonOn((v) => !v);
                  setSideBarOpen(false);
                }}
                className="px-3 py-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors"
              >
                <MessageButtonIcon size={24} />
              </button>
            )}

            <Link
              to="/purchase"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Buy Tokens
            </Link>

            {signedIn && (
              <div className="flex items-center bg-purple-100 px-3 py-1 rounded-full">
                <img src="/token.svg" alt="Token" className="h-5 w-5 mr-1" />
                <span className="text-sm font-bold text-purple-700">{tokens}</span>
              </div>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {signedIn ? (
              <Button
                onClick={logUserOut}
                icon={<LogOut className="w-4 h-4 mr-2" />}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md flex items-center"
                text="Log out"
              />
            ) : (
              <>
                <Link to="/signin">
                  <Button
                    icon={<LogIn className="w-4 h-4 mr-2" />}
                    className="text-purple-600 hover:text-purple-700 px-4 py-2 rounded-lg transition-colors flex items-center"
                    text="Login"
                  />
                </Link>
                <Link to="/signup">
                  <Button
                    icon={<UserPlus className="w-4 h-4 mr-2" />}
                    className="bg-white text-purple-600 border-2 border-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors flex items-center"
                    text="Create Account"
                  />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => {
                setSideBarOpen((v) => !v);
                setMessageButtonOn(false);
              }}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-purple-50 focus:outline-none"
            >
              <BurgerIcon />
            </button>
          </div>
        </div>
      </div>
      {/* Note: render your mobile sidebar here based on sideBarState */}
    </header>
  );
}
