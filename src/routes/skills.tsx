import { ChangeEvent, useEffect } from "react";
import { JobCard } from "../components/jobCard";
import axios from "axios";
import { useRecoilState } from "recoil";
import { messageButtonState, originalResponseState, responseState } from "../recoil/atoms";
import { useNavigate } from "react-router-dom";
import { MessageBox } from "../components/messageBox";
const API_URL = import.meta.env.VITE_API_URL


export function SkillTrade() {
  const navigate = useNavigate();
  const [response, setResponse] = useRecoilState(responseState);
  const [originalResponse, setOriginalResponse] = useRecoilState(originalResponseState);
  const messageBoxOn  = useRecoilState(messageButtonState)
  async function filterServices(changeParams:string){
    const filteredResponse = originalResponse?.filter((item)=>item.skill.proficiencyLevel == changeParams)
    setResponse(filteredResponse ?? originalResponse)
  }

  function openService(jobId:number){
    navigate(`/skills/${jobId}`)
  }

  async function fetchServices(){
    const token = localStorage.getItem('token')
    const res = await axios.get(`${API_URL}/service`,{
      headers:{
        token
      }
    });
    if(res){
      setResponse(res.data.serviceRequests);
      setOriginalResponse(res.data.serviceRequests);
    }else{
    }
  }

  let stringUserId = localStorage.getItem('userId') ;
  let userId:number;
  if(stringUserId){
    userId = parseInt(stringUserId);
  }

  
  useEffect(()=>{
    fetchServices();
  },[])

  return (
    <div className="grid grid-cols-12 overflow-hidden w-full m-0 ">
      {messageBoxOn ? <MessageBox /> : null}  
      {/* SideBar */}
      <div className="col-span-2 bg-[#E4E4E4] h-full w-full drop-shadow-lg p-4 mx-auto">
        {/* Skill Level Block */}
        <div className="text-[#0B2638] mt-4">STATUS</div>
        <div className = {'w-[90%] flex flex-col'}>
          <div className="flex items-center py-1">
            <input type = {'checkbox'} className = "size-7 outline-none mr-1" id = "box1" name =  {"box1"}></input>
            <label htmlFor = "box1" className = {'text-lg'}>Pending</label>
          </div>
          <div className="flex items-center py-1">
            <input type = {'checkbox'} className = "size-7 outline-none mr-1" id = "box2" name =  {"box2"}></input>
            <label htmlFor = "box2" className = {'text-lg'}>Completed</label>
          </div>
          <div className="flex items-center py-1">
            <input type = {'checkbox'} className = "size-7 outline-none mr-1" id = "box3" name =  {"box3"}></input>
            <label htmlFor = "box3" className = {'text-lg'}>Cancelled</label>
          </div>
          
        </div>

        {/* Status */}
        <div className="text-[#0B2638] mt-4">Proficiency Level</div>
        <div className = {'w-[90%]'}>
          <select className = {'px-2 py-1 outline-none w-full rounded-sm'} onChange={(e:ChangeEvent<HTMLSelectElement>)=>filterServices(e.target.value)}>
            <option value="">ALL</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>

        {/* Category */}
        <div className="text-[#0B2638] mt-4">CATEGORY</div>
        <div className = {'w-[90%]'}>
          <select className = {'px-2 py-1 outline-none w-full rounded-sm'}>
              <option value="0">Select car:</option>
              <option value="1">Audi</option>
              <option value="2">BMW</option>
              <option value="3">Citroen</option>
          </select>
        </div>
      </div>
      {/* Cards */}
      <div className="col-span-10 p-4 bg-[#E4E4E4] h-full w-full justify-start flex flex-wrap ">
        {response?.map(( item , index )=>{
          if(item.user.id != userId ){
            return<JobCard
              clickFunction = {openService}
              key = {index}
              createdAt = {item.createdAt}
              requesterId = {item.requesterId}
              tokenPrice={item.tokenPrice}
              skillId = {item.skillId}
              status = {item.status}
              updatedAt = {item.updatedAt}
              user = {item.user}
              skill = {item.skill}
              id = {item.id}
              description= {item.description}
            ></JobCard>
          }
        }
        )}
        
      </div>
    </div>
  );
}