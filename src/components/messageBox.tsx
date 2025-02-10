import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { UserMessage } from "../routes/utilInterface/UserMessageInterface";
import { BackButtonIcon } from "./backButton";
import { SendButtonIcon } from "./sendButton";
import { MessageInterface } from "../routes/utilInterface/MessagesInterface";
import { meetingReceiverId } from "../recoil/atoms";
import { VideoCallIcon } from "./videoCallIcon";
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { TransactionInterface } from "../routes/utilInterface/TransactionInterface";

const API_URL = import.meta.env.VITE_API_URL;

export function MessageBox() {
    const token = localStorage.getItem('token');
    const [userProfiles, setUserProfiles] = useState<UserMessage[] | null>(null);
    const [userClicked, setUserClicked] = useState(false);
    const [currentUsername, setCurrentUsername] = useState('');
    const [messages, setMessages] = useState<MessageInterface[]>([]);
    const [receiverId, setReceiverId] = useState<number | null>(null);
    const setMeetingRecId = useSetRecoilState(meetingReceiverId);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [ transactionDetails , setTransactionDetails ] = useState<TransactionInterface | null>(null);

    const navigate = useNavigate();

    const userId = parseInt(localStorage.getItem('userId') || "0");
    const inputRef = useRef<HTMLInputElement>(null);

    async function fetchUserNames() {
        const response = await axios.get(`${API_URL}/messages/users`, {
            headers: { token }
        });
        setUserProfiles(response.data.userDetails);
    }

    async function startMeeting(){
        const response = await axios.post(`${API_URL}/transaction/pending`,
            {
                user2Id:receiverId
            },
            {
                headers:{
                    token
                }
            }
        );
        if(response.status == 200){
            setTransactionDetails(response.data.transaction);            
            navigate("/video")
        }else{
        }
    }
    async function completeTransaction(){
        await axios.post(`${API_URL}/transaction/complete`,
            {
                id:transactionDetails?.id,
                senderId:transactionDetails?.senderId,
                recieverId:transactionDetails?.recieverId,
                amount:transactionDetails?.recieverAmount
            },{
                headers:{
                    token
                }
            }
        )
        if(transactionDetails?.type == 'TEACH_REQUEST'){
            await axios.delete(`${API_URL}/teachRequest`,
                {
                    headers:{
                        token
                    },data:{
                        teachRequestId:transactionDetails?.requestId
                    }
                }
            )
        }else if(transactionDetails?.type == 'TRADE_REQUEST'){
            await axios.delete(`${API_URL}/tradeRequest`,
                {
                    headers:{
                        token
                    },data:{
                        tradeRequestId:transactionDetails?.requestId
                    }
                }
            )
        }
    }


    useEffect(()=>{
        completeTransaction();
    },[transactionDetails])

    async function openUserChats(username: string, userIds: number) {
        setCurrentUsername(username);
        setReceiverId(userIds);
        setUserClicked(true);
        setMeetingRecId(userIds);

        const response = await axios.post(`${API_URL}/messages/fetchMessages`, { receiverId: userIds }, {
            headers: { token }
        });
        setMessages(response.data.allMessages);

        if (!socket || socket.readyState !== WebSocket.OPEN) {
            const newSocket = new WebSocket('ws://localhost:8080');
        
            newSocket.onopen = () => {
                newSocket.send(JSON.stringify({
                    type: "Register",
                    senderId: userId, // Ensure user is registered to receive messages
                }));
            };
        
            newSocket.onmessage = (event) => {
                const receivedMessage = JSON.parse(event.data);
        
                setMessages(prevMessages => [...prevMessages, receivedMessage]);
            };
        
            newSocket.onclose = () => {
                setSocket(null);
            };
        
            setSocket(newSocket);
        }
        
    }

    function sendMessage() {
        if (inputRef.current && inputRef.current.value.trim() !== "" && socket && receiverId) {
            const messageData = {
                type: "Message",
                senderId: userId,
                receiverId: receiverId,
                message: inputRef.current.value
            };
            socket.send(JSON.stringify(messageData));

            const uiMessage = {
                senderId: userId,
                receiverId: receiverId,
                content: inputRef.current.value,
            };
            setMessages(prevMessages => [...prevMessages, uiMessage]);

            inputRef.current.value = "";
        }
    }

    useEffect(() => {
        fetchUserNames();
    }, []);

    return (
        <div className="absolute right-6 bottom-6 w-96 h-96 bg-slate-300 z-30 flex flex-col">
            <div className="h-12 flex justify-center w-full">
                {userClicked && (
                    <span className="self-center absolute left-3 cursor-pointer"
                        onClick={() => {
                            setUserClicked(false);
                            setCurrentUsername('');
                            setReceiverId(null);
                        }}>
                        <BackButtonIcon />
                    </span>
                )}

                <span className="self-center">{userClicked ? currentUsername : "Messages"}</span>

                {userClicked && (
                    <span className="self-center absolute right-3 cursor-pointer">
                        <div onClick = {()=>startMeeting()}>
                            <VideoCallIcon />
                        </div>
                    </span>
                )}
            </div>

            {userClicked ? (
                <div className="flex flex-col h-full">
                    <div className="h-[80%] flex flex-col overflow-y-auto">
                        {messages.map((item, index) => (
                            item.type === "MEETING" ? (
                                <div key={index} className={`w-fit ${userId === item.senderId ? "self-end ml-20 text-green-700" : "mr-20 text-green-700"}`}>
                                    <Link to={`/video/join/${item.meetingId}`}>
                                        <span>{item.content}</span>
                                    </Link>
                                </div>
                            ) : (
                                <div key={index} className={`w-fit ${userId === item.senderId ? "self-end bg-blue-500 text-white p-2 rounded-lg" : "bg-gray-200 p-2 rounded-lg"}`}>
                                    {item.content}
                                </div>
                            )
                        ))}
                    </div>

                    <div className="h-[15%] flex justify-around items-center p-2">
                        <input className="w-80 p-1" ref={inputRef} />
                        <SendButtonIcon onclick={sendMessage} />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-start w-full p-3">
                    {userProfiles?.map((item) => (
                        <div key={item.id} className="flex cursor-pointer" onClick={() => openUserChats(item.username, item.id)}>
                            <img src={item.profilePicture} className="size-8 rounded-full" alt="profile" />
                            <span className="ml-2">{item.username}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
