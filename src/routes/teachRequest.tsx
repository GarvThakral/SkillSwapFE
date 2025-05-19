import axios from "axios";
import { Button } from "../components/Button";
import { useEffect, useRef } from "react";
import { loaderState, receiverId, skillId, teachRequestTokens } from "../recoil/atoms";
import { useRecoilState } from "recoil";
import Loader from "../components/loader";

const API_URL = import.meta.env.VITE_API_URL

export function TeachService(){
    const dayRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);
    const [ recId  ] = useRecoilState(receiverId);
    const [ skillsId  ] = useRecoilState(skillId);
    const [ teachTokenValue  ] = useRecoilState(teachRequestTokens);
    const [ isLoading , setIsLoading ] = useRecoilState(loaderState);
    useEffect(() => {
    }, [teachTokenValue]);
    async function createTeachRequest(){
        setIsLoading(true);
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
            setIsLoading(false);
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
        setIsLoading(false);
        }

        

    return(
        <div className = {'min-h-screen w-screen flex justify-center items-center flex-col space-y-4'}>
            {/* Availability (time slots)
             */}
             {isLoading ? <Loader/>:null}
            <span>When are you available to teach ? </span>
            <input ref = {dayRef} placeholder = {'Add your prefered days'}></input>
            <span>Add a comment</span>
            <input ref = {descRef} placeholder = {'I work on tuesdays but id be avalialble after 9 .... '} className = {'w-96'}></input>
            <Button text = "Send request"  onClick={createTeachRequest}></Button>
        </div>
    );  
}