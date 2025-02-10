import axios from "axios";
import { Button } from "../components/buttons";
import { useEffect, useRef } from "react";
import { receiverId, skillId, teachRequestTokens } from "../recoil/atoms";
import { useRecoilState } from "recoil";

const API_URL = import.meta.env.VITE_API_URL

export function TeachService(){
    const dayRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);
    const [ recId  ] = useRecoilState(receiverId);
    const [ skillsId  ] = useRecoilState(skillId);
    const [ teachTokenValue  ] = useRecoilState(teachRequestTokens);
    useEffect(() => {
    }, [teachTokenValue]);
    async function createTeachRequest(){
        const token = localStorage.getItem('token');

        const sentRequest = await axios.post(`${API_URL}/teachRequest/pending`,
            {
                receiverId:recId,
                skillId:skillsId
            },
            {
                headers:{
                    token
                }
            }
        )
        if(sentRequest.status == 200){
            alert("A teach request for this skill has already been created");
            return;
        }

        await axios.post(`${API_URL}/teachRequest` , 
            {
                skillId:skillsId,
                description:descRef.current?.value,
                receiverId:recId,
                workingDays:dayRef.current?.value,
                recieverToken:teachTokenValue
            },
            {
                headers: {
                    token
                },
            }
        )
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