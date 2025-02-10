import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button } from "../components/buttons";

const API_URL = import.meta.env.VITE_API_URL

interface SkillProps{
    description:string;
    id:number;
    proficiencyLevel:"BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    title:string;
}


export function ServiceDesc(){
    const [ searching , setSearching ] = useState(false);
    const [ , setExistingSkills ] = useState<SkillProps[] | null>(null);
    const [ filteredSkills , setFilteredSkills ] = useState<SkillProps[] | null>(null);
    const [ skillError , setSkillError ] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    async function fetchSkills(){
        const response = await axios.get(`${API_URL}/skill`);
        await setExistingSkills(response.data.skills);
        await setFilteredSkills(response.data.skills);
    }
    async function nextScreen(){
        let skillArray = await axios.get(`${API_URL}/skill`);
        let skillsArray = skillArray.data.skills;
        let skillExists = false;
        skillsArray.forEach((element:SkillProps) => {
            if(element.title == inputRef.current?.value){
                skillExists = true;
                return;
            }
        });
        if(skillExists){
            setSkillError(false);
        }else{
            setSkillError(true);
        }
    }
    useEffect(()=>{
        fetchSkills();
    },[])
    

    return(
    <div className = {'min-h-screen flex justify-center items-center'}>
        <div className = {`flex flex-col space-y-4 items-center`}>
            <span className = {'text-4xl'}>Add a description.</span>
            <div className = {'h-40 w-[500px] flex justify-center items-center rounded-2xl bg-blue-400 bg-opacity-20 space-x-3'}>
                <textarea className =  "h-36 w-[490px] bg-transparent placeholder-slate-950 outline-none">

                </textarea>
                
            </div>
            {skillError ? <span className = {'text-red-600'}>Skill does not exist , create one now ?</span>:null}
            {inputRef.current?.value.length != 0 ? <Button text="Next" style = "Primary" onclick = {()=>nextScreen()}/>:null}
            {searching ?
                <div className = {'overflow-y-auto h-28 border-2 w-64 p-3'}>
                    <div>
                        {filteredSkills?.map((item)=>{
                            return <div onClick = {()=>{inputRef.current!.value = item.title;setSearching((c)=>!c)}}>{item.title}</div>
                        })}
                    </div>
                </div>
                :
            null}
        </div>
    </div>
    );
}
