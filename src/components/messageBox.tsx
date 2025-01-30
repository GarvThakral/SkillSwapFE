import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { UserMessage } from "../routes/utilInterface/UserMessageInterface";
import { BackButtonIcon } from "./backButton";
import { SendButtonIcon } from "./sendButton"
import { MessageInterface } from "../routes/utilInterface/MessagesInterface";
import { meetingReceiverId, receiverId } from "../recoil/atoms";
import { VideoCallIcon } from "./videoCallIcon";
import Meeting from "../routes/CreateMeeting";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
const API_URL = import.meta.env.VITE_API_URL;

export function MessageBox(){
    const token = localStorage.getItem('token')
    const [ userProfiles , setUserProfiles ] = useState<UserMessage[] | null>(null);
    const [ userClicked , setUserClicked ] = useState(false);
    const [ currentUsername , setCurrentUsername ] = useState(''); 
    const [ messages , setMessages ] = useState<MessageInterface[]>()
    const [ receiverId , setRecieverId ] = useState<number | null>(null);
    const [ meetingRecId , setMeetingRecId ] = useRecoilState(meetingReceiverId)
    let userIdString = localStorage.getItem('userId');
    let userId:number;
    if(userIdString != null){
        userId = parseInt(userIdString)
    }
    const inputRef = useRef<HTMLInputElement>(null); 
    async function fetchUserNames(){
        const reponse = await axios.get(`${API_URL}/messages/users`,
            {
                headers: {
                    token
                },
            }
        );
        console.log(reponse) 
        setUserProfiles(reponse.data.userDetails)
    }

    async function openUserChats( username:string , userIds:number ){

        const response = await axios.post(`${API_URL}/messages/fetchMessages`,
            {
                receiverId:userIds
            },
            {
                headers: {
                    token
                },
            }
        )
        console.log(response);
        setMessages(response.data.allMessages);
        setCurrentUsername(username);    
        setUserClicked(true);
    }
    async function sendMessage(){
        if(inputRef.current != null){
            if(inputRef?.current.value === ''){
    
            }
            else if(inputRef.current){
                const sending = await axios.post(`${API_URL}/messages`,
                    {
                        content:inputRef.current.value,
                        receiverId
                    },
                    {
                        headers:{
                            token
                        }
                    }
                )
            }
        }
    }

    useEffect(()=>{
        fetchUserNames();
    },[])
    return (
        <div className = {`absolute right-6 bottom-6 w-96 h-96 bg-slate-300 z-30 flex flex-col `}>
            <div className = {'h-12 flex justify-center w-full'}>
                {userClicked ? 
                <span className = {'self-center absolute left-3 cursor-pointer'}
                    onClick = {()=>{
                        setUserClicked((c)=>!c)
                        setCurrentUsername('')
                    }}
                    >
                    <BackButtonIcon />
                </span>
                :
                null
                }
                <span className = {'self-center'}>{userClicked ? currentUsername : "Messages"}</span>
                {userClicked ? 
                <span className = {'self-center absolute right-3 cursor-pointer'}
                    >
                    <Link to = "/video">
                        <VideoCallIcon />
                    </Link>
                </span>
                :
                null
                }
            </div>
            {userClicked ? 
                <div className = {'flex flex-col h-full'}>
                    <div className = {'h-[80%] flex flex-col overflow-y-auto'}>
                        {/* <span className = {'w-fit self-end'}>Hi there</span>
                        <span className = {'w-fit mr-20'}>Hi there</span>
                        <span className = {'w-fit self-end ml-20'}>How was your day , what have you been doing ?day , what have you been doing ?</span> */}
                        {messages?.map((item)=>{
                            if(item.type == "MEETING"){
                                if(userId == item.senderId){
                                    return(
                                        <div className = {'w-fit self-end ml-20 text-green-700'}>
                                            <Link to = {`/video/join/${item.meetingId}`}>
                                                <span>{item.content}</span>
                                            </Link>
                                        </div>
                                )
                                }else{
                                    return(
                                        <div className = {'w-fit mr-20 text-green-700'}>
                                            <Link to = {`/video/join/${item.meetingId}`}>
                                                <span >{item.content}</span>
                                            </Link>
                                        </div>
                                    )
                                }
                            }
                        })}
                    </div>
                    <div className = {'h-[15%] flex justify-around items-center p-2'}>
                        <input className = {'w-80 p-1'} ref = {inputRef}></input>
                        <SendButtonIcon onclick = {sendMessage} />
                    </div>
                </div>
                :
                <div className = {'flex flex-col items-start w-full p-3'}>
                    {userProfiles?.map(( item , index )=>{
                        return(
                            <div
                                className = {'flex'}
                                onClick = {()=>{
                                    setRecieverId(item.id)
                                    setMeetingRecId(item.id)
                                    openUserChats( item.username , item.id)
                                }}>
                                <img src = {item.profilePicture} className = {'size-8'}></img>
                                <span>{item.username}</span>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )
}