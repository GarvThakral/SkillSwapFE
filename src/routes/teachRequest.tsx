"use client"

import axios from "axios"
import { Button } from "../components/Button"
import { useEffect, useRef, useState } from "react"
import { loaderState, receiverId, skillId, teachRequestTokens } from "../recoil/atoms"
import { useRecoilState } from "recoil"
import Loader from "../components/loader"
import { Calendar, MessageSquare } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

export function TeachService() {
  const dayRef = useRef<HTMLInputElement>(null)
  const descRef = useRef<HTMLInputElement>(null)

  const [recId] = useRecoilState(receiverId)
  const [skillsId] = useRecoilState(skillId)
  const [teachTokenValue] = useRecoilState(teachRequestTokens)
  const [isLoading, setIsLoading] = useRecoilState(loaderState)

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setError(null)
  }, [teachTokenValue])

  async function createTeachRequest() {
    const token = localStorage.getItem("token")

    const description = descRef.current?.value.trim()
    const workingDays = dayRef.current?.value.trim()

    if (!description || !workingDays) {
      setError("Please fill in all fields.")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const pendingRes = await axios.post(
        `${API_URL}/teachRequest/pending`,
        {
          receiverId: recId,
          skillId: skillsId,
        },
        {
          headers: {
            token,
          },
        }
      )

      if (pendingRes.status === 200) {
        alert("A teach request for this skill has already been created.")
        return
      }

      await axios.post(
        `${API_URL}/teachRequest`,
        {
          skillId: skillsId,
          description,
          receiverId: recId,
          workingDays,
          recieverToken: teachTokenValue,
        },
        {
          headers: {
            token,
          },
        }
      )

      alert("Teach request sent successfully!")
      descRef.current!.value = ""
      dayRef.current!.value = ""
    } catch (err) {
      console.error("Teach Request Error:", err)
      alert("Something went wrong. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-purple-50 to-blue-50 flex justify-center items-center font-['DM_sans']">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <Loader />
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Teaching Request</h1>
          <p className="text-gray-600">Share your availability and details to teach this skill</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center text-lg font-semibold text-gray-800">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              When are you available to teach?
            </label>
            <input
              ref={dayRef}
              placeholder="Add your preferred days"
              className="w-full p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-lg font-semibold text-gray-800">
              <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
              Add a comment
            </label>
            <input
              ref={descRef}
              placeholder="I work on Tuesdays but I'd be available after 9..."
              className="w-full p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            text={isLoading ? "Sending..." : "Send Request"}
            onClick={createTeachRequest}
            className="w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-purple-300/50 mt-4"
          />
        </div>
      </div>
    </div>
  )
}
