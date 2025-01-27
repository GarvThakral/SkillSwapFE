import axios from "axios";
import { Button } from "../components/buttons";
import { useEffect, useRef, useState } from "react";
import { receiverId, skillId } from "../recoil/atoms";
import { useRecoilState } from "recoil";
import { SkillProps } from "./utilInterface/SkillInterface";
import { SearchIcon } from "../components/searchIcon";
const API_URL = import.meta.env.VITE_API_URL

export function TradeService(){
    const dayRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [ recId , setRecieverId ] = useRecoilState(receiverId);
    const [ skillsId , setSkillId ] = useRecoilState(skillId);
    const [ senderSkillId , setSenderSkillId ] = useState<number | null>(null);

    const [ existingSkills , setExistingSkills ] = useState<SkillProps[] | null>(null);
    const [ filteredSkills , setFilteredSkills ] = useState<SkillProps[] | null>(null);

    const [ searching , setSearching ] = useState(false);

    async function fetchSkills(){
        const response = await axios.get(`${API_URL}/skill`);
        await setExistingSkills(response.data.skills);
        await setFilteredSkills(response.data.skills);
    }

    function searchSkills(e){
        if(!inputRef == null && inputRef.current){
            inputRef.current.value = e.target.value;
        }
    }

    useEffect(()=>{
        fetchSkills();
    },[])

    async function createTradeRequest(){
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/tradeRequest` , 
                {
                    receiverSkillId:skillsId,
                    senderSkillId,
                    description:descRef.current?.value,
                    receiverId:recId,
                    workingDays:dayRef.current?.value
                },
                {
                    headers: {
                        token
                    },
                }
            )
            console.log(response)
        }
        

    return(
        <div className = {'min-h-screen w-screen flex justify-center items-center flex-col space-y-4'}>
            {/* Availability (time slots)
             */}
            <span>WHat skills would you like to offer ?</span>
            <div className = {'h-18 w-64 flex justify-center items-center p-2 rounded-2xl bg-blue-400 bg-opacity-20 space-x-3'}>
                <SearchIcon/>
                <input  
                    onFocus={()=>setSearching((c)=>!c)}
                    type = "search" 
                    ref = {inputRef}
                    placeholder = {'Search for any skill ...'} 
                    className = {'outline-none bg-transparent placeholder-slate-950'}
                    onChange={(e)=>searchSkills(e.target.value)}>
                </input>
            </div>
            {searching ?
                <div className = {'overflow-y-auto h-28 border-2 w-64 p-3'}>
                    <div>
                        {filteredSkills?.map((item,index)=>{
                            return <div key = {index}  onClick = {()=>{inputRef.current.value = item.title;setSearching((c)=>!c); setSenderSkillId(item.id)} }>{item.title}</div>
                        })}
                    </div>
                </div>
                :
            null}
            <span>When are you available to trade ? </span>
            <input ref = {dayRef} placeholder = {'Add your prefered days'}></input>
            <span>Add a comment</span>
            <input ref = {descRef} placeholder = {'I work on tuesdays but id be avalialble after 9 .... '} className = {'w-96'}></input>
            
            <Button text = "Send request" style = "Primary" onclick={createTradeRequest}></Button>
        </div>
    );  
}