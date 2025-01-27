import axios from "axios"
import { useEffect, useState } from "react"
import { UserMessage } from "../routes/utilInterface/UserMessageInterface";
const API_URL = import.meta.env.VITE_API_URL;

export function MessageBox(){
    const token = localStorage.getItem('token')
    const [ userMessages , setUserMessages ] = useState<UserMessage[] | null>(null);
    async function fetchUserNames(){
        const reponse = await axios.get(`${API_URL}/messages/users`,
            {
                headers: {
                    token
                },
            }
        );
        console.log(reponse) 
        setUserMessages(reponse.data.userDetails)
    }

    useEffect(()=>{
        fetchUserNames();
    },[])
    return (
        <div className = {`absolute right-6 bottom-6 w-96 h-96 bg-slate-300 z-30 flex flex-col items-center`}>
            <div className = {'h-12 flex items-center'}>Messages</div>
            <div className = {'flex flex-col items-start w-full p-3'}>
                {userMessages?.map(( item , index )=>{
                    return(
                        <div className = {'flex'} >
                            <img src = {item.profilePicture} className = {'size-8'}></img>
                            <span>{item.username}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}