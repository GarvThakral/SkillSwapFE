"use client"

import type React from "react"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { loaderState, receiverId, skillId, tradeRequestRecieverTokens } from "../recoil/atoms"
import { useRecoilState } from "recoil"
import type { SkillProps } from "./utilInterface/SkillInterface"
import { Calendar, MessageSquare, Search, Repeat } from "lucide-react"
import { SearchIcon } from "../components/searchIcon"
import Loader from "../components/loader"

const API_URL = import.meta.env.VITE_API_URL

// ✅ Button Component (Custom Reusable)
function Button({ text, onClick, className = "" }: { text: string; onClick: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-purple-300/50 ${className}`}
    >
      {text}
    </button>
  )
}

export function TradeService() {
  const dayRef = useRef<HTMLInputElement>(null)
  const descRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const priceRef = useRef<HTMLInputElement>(null)

  const [recId] = useRecoilState(receiverId)
  const [skillsId] = useRecoilState(skillId)
  const [senderSkillId, setSenderSkillId] = useState<number | null>(null)
  const [tradeRecieverTokens] = useRecoilState(tradeRequestRecieverTokens)

  const [existingSkills, setExistingSkills] = useState<SkillProps[]>([])
  const [filteredSkills, setFilteredSkills] = useState<SkillProps[]>([])
  const [searching, setSearching] = useState(false)
  const [isLoading, setIsLoading] = useRecoilState(loaderState)

  useEffect(() => {
    axios.get(`${API_URL}/skill`).then((response) => {
      setExistingSkills(response.data.skills)
      setFilteredSkills(response.data.skills)
    })
  }, [])

  function searchSkills(e: React.ChangeEvent<HTMLInputElement>) {
    inputRef.current!.value = e.target.value
    const searchTerm = e.target.value.toLowerCase()
    if (searchTerm) {
      const filtered = existingSkills.filter((skill) => skill.title.toLowerCase().includes(searchTerm))
      setFilteredSkills(filtered)
    } else {
      setFilteredSkills(existingSkills)
    }
  }

  async function createTradeRequest() {
    setIsLoading(true)

    const skillExists = existingSkills.some((skill) => skill.title === inputRef.current?.value)
    if (!skillExists) {
      alert("Invalid skill selected")
      setIsLoading(false)
      return
    }

    const token = localStorage.getItem("token")
    const senderToken = Number.parseInt(priceRef.current?.value || "0")
    const netAmount = tradeRecieverTokens - senderToken

    if (netAmount >= 0) {
      const userId = Number.parseInt(localStorage.getItem("userId") || "0")
      const userTokens = await axios.post(`${API_URL}/user/tokens`, { userId })
      if (userTokens.data.UsersTokens.tokens < netAmount) {
        alert("You don't have enough tokens to make this transaction")
        setIsLoading(false)
        return
      }
    }

    await axios.post(
      `${API_URL}/tradeRequest`,
      {
        receiverSkillId: skillsId,
        senderSkillId,
        description: descRef.current?.value,
        receiverId: recId,
        workingDays: dayRef.current?.value,
        senderToken,
        recieverToken: tradeRecieverTokens,
      },
      { headers: { token } },
    )
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-purple-50 to-blue-50 flex justify-center items-center font-['DM_sans'] p-4">
      {isLoading ? <Loader /> : null}

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-purple-100 rounded-full mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <Repeat className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Skill Trade Request</h1>
          <p className="text-gray-600">Exchange your skills with others on the platform</p>
        </div>

        <div className="space-y-6">
          {/* Search Box */}
          <div className="space-y-2">
            <label className="flex items-center text-lg font-semibold text-gray-800">
              <Search className="w-5 h-5 mr-2 text-purple-600" />
              What skill would you like to offer?
            </label>
            <div className="relative">
              <div className="flex items-center w-full p-3 border-2 border-purple-200 rounded-lg focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition-all">
                <SearchIcon  />
                <input
                  type="search"
                  ref={inputRef}
                  placeholder="Search for any skill..."
                  className="outline-none bg-transparent placeholder-gray-400 w-full"
                  onChange={searchSkills}
                  onFocus={() => setSearching(true)}
                  onBlur={() => setTimeout(() => setSearching(false), 200)}
                />
              </div>
              {searching && (
                <div className="absolute z-10 mt-1 w-full overflow-y-auto max-h-60 bg-white border-2 border-purple-200 rounded-lg shadow-lg">
                  <div className="p-2">
                    {filteredSkills.length > 0 ? (
                      filteredSkills.map((item) => (
                        <div
                          key={item.id}
                          className="py-2 px-3 hover:bg-purple-50 rounded cursor-pointer transition-colors"
                          onClick={() => {
                            if (inputRef.current) inputRef.current.value = item.title
                            setSearching(false)
                            setSenderSkillId(item.id)
                          }}
                        >
                          {item.title}
                        </div>
                      ))
                    ) : (
                      <div className="py-2 px-3 text-gray-500">No skills found</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Token Input */}
          <div className="space-y-2">
            <label className="flex items-center text-lg font-semibold text-gray-800">
              <img src="token.svg" className="w-5 h-5 mr-2" alt="Token" />
              How many tokens would you like to charge?
            </label>
            <div className="relative">
              <input
                type="number"
                defaultValue={50}
                className="w-full p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                ref={priceRef}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-purple-100 px-2 py-1 rounded text-purple-700 font-semibold">
                tokens
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <label className="flex items-center text-lg font-semibold text-gray-800">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              When are you available to trade?
            </label>
            <input
              ref={dayRef}
              placeholder="Add your preferred days"
              className="w-full p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="flex items-center text-lg font-semibold text-gray-800">
              <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
              Add a comment
            </label>
            <input
              ref={descRef}
              placeholder="I work on Tuesdays but I'm available after 9..."
              className="w-full p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Submit Button */}
          <Button text="Send request" onClick={createTradeRequest} />
        </div>
      </div>
    </div>
  )
}
