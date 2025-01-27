import axios from "axios"
import { useEffect, useState } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { Button } from "../components/buttons";
import { useRecoilState, useRecoilValue } from "recoil";
import { receiverId, skillId } from "../recoil/atoms";
import { ServiceCard } from "./utilInterface/ServiceCardInterface";

const API_URL = import.meta.env.VITE_API_URL

const profTextStyles = {
    "BEGINNER":"border-green-600  text-green-600",
    "INTERMEDIATE":"border-yellow-600  text-yellow-600",
    "ADVANCED":"border-red-600  text-red-600",
} 

export function Service(){
    const {id} = useParams();
    let [recieverId,setRecieverId] = useRecoilState(receiverId);
    let [skillsId,setSkillId] = useRecoilState(skillId);
    const [service,setService] = useState<ServiceCard | null>(null);

    async function fetchSkill(skillId:string){
        const response = await axios.get(`${API_URL}/service/${skillId}`)
        setService(response.data.serviceRequest)
        console.log(response.data)
    }


    useEffect(()=>{
        if(id){
            fetchSkill(id)
        }
    },[id])

    return<div className = {'h-screen flex flex-col items-center justify-center'}>
        {service ? 
        <div className = "flex flex-col items-center w-[60%] space-y-7 shadow-lg p-4">
                <img src = {service.user.profilePicture} className = {'size-36 rounded-[50%] border-2 hover:scale-105 duration-75'}></img>
                <span className = {'text-3xl'}>{service.user.username}</span>
                    <span className = {'font-bold'}>
                        "{service.skill.title}"
                    </span>
                    <span>
                        {service.skill.description}
                    </span>
                    <span className = {`p-1 border-4 rounded-md text-xs  ${profTextStyles[service.skill.proficiencyLevel]}`}>
                        {service.skill.proficiencyLevel}
                    </span>
                    <div className = {'flex space-x-7'}>
                        <Button text = {"Teach"} style = {"Primary"} onclick={()=>createTeachRequest()}/>
                        <Button text = {"Teach"} style = {"Secondary"}/>
                    </div>
                    <span>Price:50<img src = 'images.png'></img></span>
        </div>
        :
            <div>Skill may have been deleted</div>
        }
    </div>
}