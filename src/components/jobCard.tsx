import axios from "axios";
import { Button } from "./buttons";
import { useNavigate } from "react-router-dom";
import { ServiceCard } from "../routes/utilInterface/ServiceCardInterface";
import { useRecoilState, useSetRecoilState } from "recoil";
import { receiverId, skillId, teachRequestTokens, tradeRequestRecieverTokens } from "../recoil/atoms";

const API_URL = import.meta.env.VITE_API_URL;

const profTextStyles = {
    "BEGINNER":"border-green-600  text-green-600",
    "INTERMEDIATE":"border-yellow-600  text-yellow-600",
    "ADVANCED":"border-red-600  text-red-600",
} 
export function JobCard(props:ServiceCard){
    const navigate = useNavigate();
    const [recId,setRecId] = useRecoilState(receiverId);
    const setSkillId = useSetRecoilState(skillId);
    const setTeachTokenValue = useSetRecoilState(teachRequestTokens);
    const setTradeRecieverTokens = useSetRecoilState(tradeRequestRecieverTokens);
    const token = localStorage.getItem('token');
    async function createTeachRequest(){
        setRecId(props.user.id);
        const response = await axios.post(`${API_URL}/transaction/pending`,
            {
                user2Id:recId
            },
            {
                headers:{
                    token
                }
            }
        );
        if(response.status == 200){
            alert("Complete your remaining transaction with this user first")
        }else{
            const userId = parseInt(localStorage.getItem("userId") ?? '0');
            await axios.post(`${API_URL}/user/tokens`,
                {
                    userId
                }
            )
            setTeachTokenValue(props.tokenPrice);
            setSkillId(props.skill.id);
            navigate('/teachRequest');
        }
        

    }
    async function createTradeRequest(){
        setRecId(props.user.id);
        const response = await axios.post(`${API_URL}/transaction/pending`,
            {
                user2Id:recId
            },
            {
                headers:{
                    token
                }
            }
        );
        if(response.status == 200){
            alert("Complete your remaining transaction with this user first")
        }else{
            setSkillId(props.skill.id);
            setTradeRecieverTokens(props.tokenPrice);
            navigate('/tradeRequest');
        }
    }

    return(
    <div className = {'w-96 rounded-xl bg-white h-80 text-black overflow-hidden my-2 mx-2 shadow-xl hover:scale-105 duration-300'} >
        {/* Head Block */}
        <div className="flex justify-between items-center border-b-2 border-black p-2 h-[25%] relative" onClick = {()=>{if(props.clickFunction){props.clickFunction(props.id)}}}>
            {/* Profile Block */}
            <div className = {'absolute top-6 left-4 text-black flex items-center'}>
                <img src = "coin.png" className = "size-6"></img>
                {props.tokenPrice?.toString()}
            </div>
            <div className="flex justify-center mx-auto ">
                <div>
                    <img src={props.user.profilePicture} className="rounded-full w-10 h-10" alt="Profile" />
                    </div>
                    <div className="ml-2">
                    <p>{props.user.username}</p>
                    <p>*****</p>
                </div>
            </div>

            {/* Proficiency Level */}
            <div className = {` absolute top-6 right-0 mr-3 p-1 border-4 rounded-md text-xs ${profTextStyles[props.skill.proficiencyLevel]}`}>
                {props.skill.proficiencyLevel}
            </div>
        </div>


        {/* Body Block */}
        <div className = {'flex flex-col items-around justify-between h-[75%] p-3'}>
            <div className = {'flex flex-col items-center'}>
                <p className = {'font-bold'}>"{props.skill.title}"</p>
                <p className = {'text-center'}>"{props.skill.description}"</p>
            </div>
            <div className = "flex justify-around w-full">
                <Button text={"Teach"} style = {"Primary"} onclick={()=>createTeachRequest()}/>
                <Button text={"Trade"} style = {"Secondary"} onclick={()=>createTradeRequest()} />
            </div>
        </div>
    </div>
    );
}