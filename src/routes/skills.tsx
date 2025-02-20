import {  useEffect, useState } from "react";
import { JobCard } from "../components/jobCard";
import axios from "axios";
import { useRecoilState } from "recoil";
import { originalResponseState, responseState } from "../recoil/atoms";
import { useNavigate } from "react-router-dom";
import { ArrowIcon } from "../components/arrowIcon";
const API_URL = import.meta.env.VITE_API_URL;

export function SkillTrade() {
  const navigate = useNavigate();
  const [response, setResponse] = useRecoilState(responseState);
  const [originalResponse, setOriginalResponse] = useRecoilState(originalResponseState);
  const [ filterOpen , setFilterOpen ] = useState(true);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedProficiency, setSelectedProficiency] = useState<string>("");

  async function fetchServices() {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}/service`, {
      headers: { token },
    });

    if (res) {
      setOriginalResponse(res.data.serviceRequests);
      setResponse(res.data.serviceRequests);
    }
  }

  function applyFilters() {
    let filteredResponse = originalResponse;

    if (searchQuery.trim() !== "") {
      filteredResponse = (filteredResponse ?? [])?.filter((item) =>
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus.length > 0) {
      filteredResponse = (filteredResponse ?? [])?.filter((item) =>
        selectedStatus.includes(item.status)
      );
    }

    if (selectedProficiency !== "") {
      filteredResponse = (filteredResponse ?? [])?.filter(
        (item) => item.skill.proficiencyLevel === selectedProficiency
      );
    }

    setResponse(filteredResponse ?? originalResponse);
  }

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedStatus, selectedProficiency]);

  function toggleStatus(status: string) {
    setSelectedStatus((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  }

  useEffect(() => {
    fetchServices();
    window.addEventListener('resize', ()=>{
      if(window.innerWidth < 640){
        if(filterOpen){
          setFilterOpen(false);
        }
      }
      if(window.innerWidth >= 640){
        if(!filterOpen){
          setFilterOpen(true);
        }
      }
    })
  }, []);

  let stringUserId = localStorage.getItem("userId");
  let userId: number;
  if (stringUserId) {
    userId = parseInt(stringUserId);
  }

  return (
    <div className="sm:grid grid-cols-12 flex flex-col overflow-hidden w-full m-0 min-h-screen">
      {/* SideBar */}
      <div className={`col-span-2  bg-[#E4E4E4] h-full w-full drop-shadow-lg p-3 mx-auto overflow-hidden transition-all duration-100 ${filterOpen ? "opacity-100 max-h-full":"opacity-0 max-h-0"}`}>
        {/* Search */}
        <div className="text-[#0B2638] mt-4">SEARCH</div>
        <input
          type="text"
          placeholder="Search..."
          className="w-[90%] px-2 py-1 outline-none rounded-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Status */}
        <div className="text-[#0B2638] mt-4">STATUS</div>
        <div className="w-[90%] flex flex-col">
          {["Pending", "Completed", "Cancelled"].map((status) => (
            <div key={status} className="flex items-center py-1">
              <input
                type="checkbox"
                className="size-5 outline-none mr-1"
                id={status}
                checked={selectedStatus.includes(status)}
                onChange={() => toggleStatus(status)}
              />
              <label htmlFor={status} className="text-base">{status}</label>
            </div>
          ))}
        </div>

        {/* Proficiency Level */}
        <div className="text-[#0B2638] mt-4">PROFICIENCY LEVEL</div>
        <select
          className="px-2 py-1 outline-none w-full rounded-sm"
          onChange={(e) => setSelectedProficiency(e.target.value)}
          value={selectedProficiency}
        >
        <option value="">ALL</option>
        <option value="BEGINNER">Beginner</option>
        <option value="INTERMEDIATE">Intermediate</option>
        <option value="ADVANCED">Advanced</option>
        </select>
      </div>
      <button className = {'p-1 bg-[#E4E4E4] w-full justify-center flex sm:hidden'} onClick = {()=>setFilterOpen((c)=>!c)}><ArrowIcon/></button>

      {/* Cards Section */}
      <div className="col-span-10 p-4 bg-[#E4E4E4] h-full w-full justify-center sm:justify-start flex flex-wrap">
        {response?.map((item, index) => {
          if (item.user.id !== userId) {
            return (
              <JobCard
                clickFunction={navigate}
                key={index}
                createdAt={item.createdAt}
                requesterId={item.requesterId}
                tokenPrice={item.tokenPrice}
                skillId={item.skillId}
                status={item.status}
                updatedAt={item.updatedAt}
                user={item.user}
                skill={item.skill}
                id={item.id}
                description={item.description}
              />
            );
          }
        })}
      </div>
    </div>
  );
}
