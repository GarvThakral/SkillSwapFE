"use client"

import { useEffect, useState } from "react"
import { JobCard } from "../components/jobCard"
import axios from "axios"
import { useRecoilState } from "recoil"
import { originalResponseState, responseState } from "../recoil/atoms"
import { useNavigate } from "react-router-dom"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

// Simple Toggle Button
function ToggleButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="sm:hidden flex items-center justify-center p-2 mb-4 bg-white rounded-full shadow hover:bg-gray-100 transition"
    >
      {open ? <ChevronLeftIcon className="w-6 h-6 text-gray-600" /> : <ChevronRightIcon className="w-6 h-6 text-gray-600" />}
    </button>
  )
}

export function SkillTrade() {
  const navigate = useNavigate()
  const [response, setResponse] = useRecoilState(responseState)
  const [originalResponse, setOriginalResponse] = useRecoilState(originalResponseState)
  const [filterOpen, setFilterOpen] = useState(true)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [selectedProficiency, setSelectedProficiency] = useState("")

  // fetch once
  useEffect(() => {
    ;(async () => {
      const token = localStorage.getItem("token")
      const res = await axios.get(`${API_URL}/service`, { headers: { token } })
      setOriginalResponse(res.data.serviceRequests)
      setResponse(res.data.serviceRequests)
    })()
    // cleanup listener if desired...
  }, [])

  // apply filters
  useEffect(() => {
    let filtered = originalResponse ?? []
    if (searchQuery) {
      filtered = filtered.filter((i) => i.description.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    if (selectedStatus.length) {
      filtered = filtered.filter((i) => selectedStatus.includes(i.status))
    }
    if (selectedProficiency) {
      filtered = filtered.filter((i) => i.skill.proficiencyLevel === selectedProficiency)
    }
    setResponse(filtered)
  }, [searchQuery, selectedStatus, selectedProficiency, originalResponse, setResponse])

  function toggleStatus(s: string) {
    setSelectedStatus((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    )
  }

  const userId = Number(localStorage.getItem("userId") || "0")

  return (
    <div className="min-h-screen flex sm:flex-row flex-col bg-gradient-to-br from-purple-50 to-blue-50 p-4 space-y-4 sm:space-y-0 sm:space-x-4">
      {/* Filter Panel */}
      <div
        className={`bg-white rounded-xl shadow-lg p-6 w-full sm:w-64 transition-all overflow-hidden ${
          filterOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Filters</h2>
        {/* Search */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Search</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Description..."
            className="w-full px-3 py-2 border rounded-lg focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        {/* Status */}
        <div className="mb-4">
          <span className="block text-gray-700 mb-1">Status</span>
          {["Pending", "Completed", "Cancelled"].map((s) => (
            <label key={s} className="flex items-center space-x-2 mb-1">
              <input
                type="checkbox"
                checked={selectedStatus.includes(s)}
                onChange={() => toggleStatus(s)}
                className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-gray-700">{s}</span>
            </label>
          ))}
        </div>
        {/* Proficiency */}
        <div>
          <label className="block text-gray-700 mb-1">Proficiency</label>
          <select
            value={selectedProficiency}
            onChange={(e) => setSelectedProficiency(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>
      </div>

      {/* Toggle Button for Mobile */}
      <ToggleButton open={filterOpen} onClick={() => setFilterOpen((o) => !o)} />

      {/* Cards Grid */}
      <div className="flex-1 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-auto">
        {response
          ?.filter((item) => item.user.id !== userId)
          .map((item) => (
            <JobCard
              key={item.id}
              clickFunction={navigate}
              {...item}
            />
          ))}
      </div>
    </div>
  )
}
