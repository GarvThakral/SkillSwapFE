import axios from "axios";
import { Button } from "./buttons";
import { useNavigate } from "react-router-dom";
import { ServiceCard } from "../routes/utilInterface/ServiceCardInterface";
import { useRecoilState, useSetRecoilState } from "recoil";
import { receiverId, skillId, teachRequestTokens, tradeRequestRecieverTokens } from "../recoil/atoms";
import { TeachIcon } from "./teachIcon";
import { ExchangeIcon } from "./exchangeIcon";

const API_URL = import.meta.env.VITE_API_URL;

const profTextStyles = {
    "BEGINNER":"border-green-600 border-2  text-black px-2 p-1 rounded-md bg-opacity-85 text-sm  ",
    "INTERMEDIATE":"border-yellow-600 border-2  text-black px-2 p-1 rounded-md bg-opacity-85 text-sm  ",
    "ADVANCED":"border-red-600 border-2  text-black px-2 p-1 rounded-md bg-opacity-85 text-sm  ",
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
    <div className = {`w-80 rounded-xl bg-white h-80 text-black overflow-hidden my-2 mx-2 shadow-lg hover:shadow-2xl duration-200 font-['DM_sans']`} >
        {/* Head Block */}
        <div className="flex justify-between items-center border-b-2 p-2 h-[25%] relative" onClick = {()=>{if(props.clickFunction){props.clickFunction(props.id)}}}>
            {/* Profile Block */}
            <div className="flex justify-center h-fit items-center">
                <div className = {''}>
                    <img src={props.user.profilePicture} className="rounded-full w-10 h-10" alt="Profile" />
                </div>
                <div className="ml-2">
                    <p>{props.user.username}</p>
                    <p>*****</p>
                </div>
            </div>

            {/* Proficiency Level */}
            <div className = {` ${profTextStyles[props.skill.proficiencyLevel]}`}>
                {props.skill.proficiencyLevel}
            </div>
        </div>


        {/* Body Block */}
        <div className = {'flex flex-col items-around justify-between h-[75%] p-3'}>
            <div className = {'flex flex-col items-center'}>
                <p className = {'font-bold'}>"{props.skill.title}"</p>
                <p className = {'text-center'}>"{props.skill.description}"</p>
            </div>
            <div className = {' text-black flex items-center mx-auto'}>
                <img src = "token.svg" className = "size-6 m-1"></img>
                {props.tokenPrice?.toString()}
            </div>
            <div className = "flex justify-around w-full">
                <Button text={"Teach"} style = {"Primary"} icon = {<TeachIcon size = {6} />} onclick={()=>createTeachRequest()}/>
                <Button text={"Trade"} style = {"Secondary"} icon = {<ExchangeIcon  />} onclick={()=>createTradeRequest()} />
            </div>
        </div>
    </div>
    );
}