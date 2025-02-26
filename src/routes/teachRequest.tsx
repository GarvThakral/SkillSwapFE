import axios from "axios";
import { Button } from "../components/buttons";
import { useEffect, useRef } from "react";
import { loaderState, receiverId, skillId, teachRequestTokens ,serviceId, skillName, userName, skillCost, userTokens } from "../recoil/atoms";
import { useRecoilState, useRecoilValue } from "recoil";

const API_URL = import.meta.env.VITE_API_URL

export function TeachService(){
    const dayRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);
    const [ recId  ] = useRecoilState(receiverId);
    const [ skillsId  ] = useRecoilState(skillId);
    const [ teachTokenValue  ] = useRecoilState(teachRequestTokens);
    const [ isLoading , setIsLoading ] = useRecoilState(loaderState);
    const servId = useRecoilValue(serviceId); 
    const [skillsName] = useRecoilState(skillName);
    const [usersName] = useRecoilState(userName);
    const [skillsCost] = useRecoilState(skillCost);
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
                recieverToken:teachTokenValue,
                serviceId:servId
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
        <div className = {`h-screen w-screen flex justify-center items-center flex-col space-y-4 font-['DM_sans']`}>
            <div className="shadow-2xl p-6 w-[40%] h-[60%] flex flex-col justify-between items-center space-y-3 ">
                
                <span className = {'flex flex-wrap text-3xl font-bold items-center'}>Teaching &nbsp;<span className = {'font-extrabold'}>{usersName} </span>&nbsp;<span className = {'text-blue-600'}>{skillsName}</span>&nbsp; in exchange for &nbsp;<img src = "token.svg" className = {'size-6'}></img><span className = {'font-light'}>{skillsCost}</span></span>
                <span className = {'font-semibold text-xl'}>When are you available to teach ? </span>
                <input className = {'outline-none border-b-2 '} ref = {dayRef} placeholder = {'Add your prefered days'}></input>
                <span className = {'font-semibold text-xl'}>Add a comment</span>
                <input className = {'outline-none border-b-2 w-96'} ref = {descRef} placeholder = {'I work on tuesdays but id be avalialble after 9 .... '} ></input>
                <Button text = "Send request" style = "Primary" onclick={createTeachRequest}></Button>
            </div>
        </div>
    );  
}