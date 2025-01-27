import axios from "axios";
import { Button } from "../components/buttons";
import { useRef } from "react";
import { receiverId, skillId } from "../recoil/atoms";
import { useRecoilState } from "recoil";

const API_URL = import.meta.env.VITE_API_URL

export function TeachService(){
    const dayRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);
    const [ recId , setRecieverId ] = useRecoilState(receiverId);
    const [ skillsId , setSkillId ] = useRecoilState(skillId)
    async function createTeachRequest(){
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/teachRequest` , 
                {
                    skillId:skillsId,
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
            <span>When are you available to teach ? </span>
            <input ref = {dayRef} placeholder = {'Add your prefered days'}></input>
            <span>Add a comment</span>
            <input ref = {descRef} placeholder = {'I work on tuesdays but id be avalialble after 9 .... '} className = {'w-96'}></input>
            <Button text = "Send request" style = "Primary" onclick={createTeachRequest}></Button>
        </div>
    );  
}