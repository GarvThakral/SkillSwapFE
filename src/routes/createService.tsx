import { ChangeEvent, useEffect, useRef, useState } from "react";
import { SearchIcon } from "../components/searchIcon";
import axios from "axios";
import { Button } from "../components/buttons";
import { SkillProps } from "./utilInterface/SkillInterface";
import Loader from "../components/loader";
import { useRecoilState } from "recoil";
import { loaderState } from "../recoil/atoms";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL

export function CreateService(){
    const priceRef = useRef<HTMLInputElement>(null);
    const [ skillSelected , setSkillSelected ] = useState<number | null>(null);
    const [ skillDesc , setSkillDesc ] = useState<string | null>(null);
    const [ searching , setSearching ] = useState(false);
    const [  , setExistingSkills ] = useState<SkillProps[] | null>(null);
    const [ filteredSkills , setFilteredSkills ] = useState<SkillProps[] | null>(null);
    const [ skillError , setSkillError ] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [ skillExists , setSkillExists ] = useState(false);
    const navigate = useNavigate();
    const [ isLoading , setIsLoading ] = useRecoilState(loaderState);

    async function fetchSkills(){
        const response = await axios.get(`${API_URL}/skill`);
        await setExistingSkills(response.data.skills);
        await setFilteredSkills(response.data.skills);
    }
    function searchSkills(e:ChangeEvent<HTMLInputElement>){
        if(!inputRef == null && inputRef.current){
            inputRef.current.value = e.target.value;
        }
    }
    async function nextScreen(){
        let skillArray = await axios.get(`${API_URL}/skill`);
        let skillsArray = skillArray.data.skills;
        skillsArray.forEach((element:SkillProps) => {
            if(element.title == inputRef.current?.value){
                setSkillExists(true);
                setSkillSelected(element.id);
                setSkillDesc(element.description);
                return;
            }
        });
        if(skillExists){
            setSkillError(false);
        }else{
            setSkillError(true);
        }
    }
    async function create(){
        setIsLoading(true);
        const token = localStorage.getItem('token')
        await axios.post(`${API_URL}/service`,
            {
                skillId:skillSelected,
                description:skillDesc,
                tokenPrice:parseInt(priceRef.current?.value ?? '0')
            },
            {
                headers: {
                    token
                },
            }
        )
        setIsLoading(false);
        navigate('/skills')
    }
    useEffect(()=>{
        fetchSkills();
    },[])
    

    return(
    <div className = {'min-h-screen flex justify-center items-center'}>
        {isLoading ? <Loader/>:null}
        <div className = {`flex flex-col space-y-4 items-center`}>
            {skillExists ?
            <div className = {`flex flex-col space-y-4 items-center`}>
                <span className = {'text-4xl'}>Add a description.</span>
                <div className = {'h-40 w-[500px] flex justify-center items-center rounded-2xl bg-blue-400 bg-opacity-20 space-x-3 p-2'}>
                    <textarea ref = {textAreaRef} className =  "h-36 w-[490px] bg-transparent outline-none placeholder-slate-500" placeholder = "(eg)..Looking for a react developer to teach me react basics."></textarea>
                </div>
                <span className = {'text-3xl'}>How much are you willing to pay for the skill ?</span>
                <input type = "number" defaultValue={50} className = {'p-3 border-2 w-20'} ref = {priceRef}></input>
                {textAreaRef.current?.value.length != 0 ? <Button text="Next" style = "Primary" onclick = {()=>create()}/>:null}
            </div>
            :
            <div className = {`flex flex-col space-y-4 items-center`}> 
                <span className = {'text-4xl'}>What skill are you looking for ?</span>
                <div className = {'h-18 w-64 flex justify-center items-center p-2 rounded-2xl bg-blue-400 bg-opacity-20 space-x-3'}>
                    <SearchIcon/>
                    <input  
                        onFocus={()=>setSearching((c)=>!c)}
                        type = "search" 
                        ref = {inputRef}
                        placeholder = {'Search for any skill ...'} 
                        className = {'outline-none bg-transparent placeholder-slate-950'}
                        onChange={(e)=>searchSkills(e)}>
                    </input>
                </div>
                {skillError ? <span className = {'text-red-600'}>Skill does not exist , create one now ?</span>:null}
                {inputRef.current?.value.length != 0 ? <Button text="Next" style = "Primary" onclick = {()=>nextScreen()}/>:null}
                {skillExists ? <span>"{skillDesc}"</span>:null}
                {searching ?
                    <div className = {'overflow-y-auto h-28 border-2 w-64 p-3'}>
                        <div>
                            {filteredSkills?.map((item,index)=>{
                                return <div key = {index}  onClick = {()=>{
                                    inputRef.current!.value = item.title;
                                    setSearching((c)=>!c)}}>{item.title}
                                    </div>
                            })}
                        </div>
                    </div>
                    :
                null}
            </div>}
            
        </div>
    </div>
    );
}


