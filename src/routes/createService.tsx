// src/pages/CreateService.tsx
import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { loaderState } from "../recoil/atoms";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

// Define the shape of a skill
interface SkillProps {
  id: number;
  title: string;
  description: string;
}

export function CreateService() {
  const priceRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [skillSelected, setSkillSelected] = useState<number | null>(null);
  const [skillDesc, setSkillDesc] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [existingSkills, setExistingSkills] = useState<SkillProps[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<SkillProps[]>([]);
  const [skillError, setSkillError] = useState(false);
  const [skillExists, setSkillExists] = useState(false);

  const [isLoading, setIsLoading] = useRecoilState(loaderState);
  const navigate = useNavigate();

  // Fetch all skills once
  useEffect(() => {
    async function fetchSkills() {
      const res = await axios.get(`${API_URL}/skill`);
      setExistingSkills(res.data.skills);
      setFilteredSkills(res.data.skills);
    }
    fetchSkills();
  }, []);

  // Update filtered list as user types
  function searchSkills(e: ChangeEvent<HTMLInputElement>) {
    const q = e.target.value.toLowerCase();
    setFilteredSkills(
      existingSkills.filter((s) => s.title.toLowerCase().includes(q))
    );
  }

  // Check if entered skill exists
  async function nextScreen() {
    const title = inputRef.current?.value.trim() ?? "";
    const found = existingSkills.find((s) => s.title === title);
    if (found) {
      setSkillExists(true);
      setSkillError(false);
      setSkillSelected(found.id);
      setSkillDesc(found.description);
    } else {
      setSkillError(true);
      setSkillExists(false);
    }
  }

  // Create service request
  async function create() {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    await axios.post(
      `${API_URL}/service`,
      {
        skillId: skillSelected,
        description: skillDesc,
        tokenPrice: Number(priceRef.current?.value ?? "0"),
      },
      { headers: { token: token ?? "" } }
    );
    setIsLoading(false);
    navigate("/skills");
  }

  return (
    <div className="min-h-screen flex justify-center items-center font-['DM_sans'] bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      {isLoading && <Loader />}

      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        {/* Step 2: price & description */}
        {skillExists ? (
          <div className="flex flex-col space-y-6 items-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Set Your Token Price
            </h2>
            <div className="w-full max-w-md">
              <label className="block text-gray-700 mb-2 text-lg">
                How many tokens for this skill?
              </label>
              <div className="relative">
                <input
                  type="number"
                  defaultValue={50}
                  ref={priceRef}
                  className="p-4 border-2 border-purple-300 rounded-lg w-full text-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-purple-100 px-2 py-1 rounded text-purple-700 font-semibold">
                  tokens
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mt-4">
              Describe What You Need
            </h2>
            <div className="w-full">
              <div className="h-40 w-full flex items-center rounded-lg border-2 border-purple-300 bg-white p-2 focus-within:ring-2 focus-within:ring-purple-500 transition-all">
                <textarea
                  ref={textAreaRef}
                  className="h-36 w-full bg-transparent outline-none placeholder-gray-400 p-2 resize-none text-gray-700"
                  placeholder="(e.g.) Looking for a React developer to teach me React basics..."
                />
              </div>
            </div>

            {textAreaRef.current?.value.length ? (
              <Button
                onClick={create}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg mt-4"
              >
                Create Service
              </Button>
            ) : null}
          </div>
        ) : (
          /* Step 1: choose skill */
          <div className="flex flex-col space-y-6 items-center">
            <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Find Your Skill
            </h2>

            <div className="h-14 w-full max-w-md flex items-center bg-white rounded-full border-2 border-purple-300 px-4 focus-within:ring-2 focus-within:ring-purple-500 transition-all">
              <SearchIcon className="text-purple-500 mr-2" />
              <input
                type="search"
                ref={inputRef}
                placeholder="Search for any skill..."
                className="outline-none bg-transparent placeholder-gray-400 w-full text-lg"
                onChange={(e) => {
                  searchSkills(e);
                  setSearching(true);
                }}
                onBlur={() => setTimeout(() => setSearching(false), 200)}
              />
            </div>

            {skillError && (
              <div className="text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                Skill does not exist.
              </div>
            )}

            {inputRef.current?.value.length ? (
              <Button
                onClick={nextScreen}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
              >
                Continue
              </Button>
            ) : null}

            {searching && filteredSkills.length ? (
              <div className="overflow-y-auto max-h-60 border-2 border-purple-200 w-full max-w-md p-3 rounded-xl bg-white shadow-lg z-10">
                {filteredSkills.map((s) => (
                  <div
                    key={s.id}
                    className="py-2 px-3 hover:bg-purple-50 rounded cursor-pointer"
                    onClick={() => {
                      if (inputRef.current) inputRef.current.value = s.title;
                      setSearching(false);
                    }}
                  >
                    {s.title}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Inline sub-components
─────────────────────────────────────────────────────────────────────────────*/

// Button
function Button({
  children,
  onClick,
  className = "",
}: React.PropsWithChildren<{ onClick?: () => void; className?: string }>) {
  return (
    <button onClick={onClick} className={`inline-block font-medium ${className}`}>
      {children}
    </button>
  );
}

// Search icon
function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`w-6 h-6 ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Simple Loader
function Loader() {
  return (
    <div className="fixed inset-0 bg-white/50 flex items-center justify-center z-50">
      <div className="w-12 h-12 border-4 border-purple-600 border-dashed rounded-full animate-spin" />
    </div>
  );
}
