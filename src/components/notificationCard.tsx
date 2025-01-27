import axios from "axios";
import { TeachNotification ,TradeNotification } from "../routes/utilInterface/NotificationInterface";

const API_URL = import.meta.env.VITE_API_URL;

export function NotificationCard(NotificationProps: TeachNotification | TradeNotification){
    const token = localStorage.getItem('token');
    async function acceptRequest(){
        const response = await axios.post(`${API_URL}/teachRequest/accept`,
            {
                requestId:NotificationProps.id
            },
            {
                headers:{
                    token
                }
            }
        );
        console.log(response);
    };
    async function denyRequest(){
      
        const response = await axios.post(`${API_URL}/teachRequest/deny`,
            {
                requestId:NotificationProps.id
            },
            {
                headers:{
                    token
                }
            }
        );
        console.log(response);
    };
    
    return(
        <div className = {'w-[80%] h-[10%] flex justify-between bg-slate-300 p-2 rounded-xl mb-2'}>
            <div className = {'flex items-center'}>
                <img src = {NotificationProps.sender?.profilePicture} className = {'rounded-[50%] size-16'}></img>
                {NotificationProps.type == "TEACH" ? 
                <div>
                    <span className = "pl-1">{NotificationProps.sender?.username} wants to you teach you</span>
                    <span className = {'p-1 text-blue-600'}>{NotificationProps.skill?.title}</span>
                </div> :
                 <div>
                    <span className = "pl-1">{NotificationProps.sender?.username} wants to you teach you</span>
                    <span className = {'p-1 text-blue-600'}>{NotificationProps.senderSkill?.title}<span className = {'text-black'}> in exchange for </span>{NotificationProps.receiverSkill?.title}</span>
                </div>}

            </div>
            <div className = {'flex items-center space-x-4'}>
                <button className = {' bg-green-500 p-3 rounded-lg'} onClick={()=>acceptRequest()}>Accept</button>
                <button className = {' bg-red-500 text-white p-3 rounded-lg'} onClick={()=>denyRequest()}>Deny</button>
            </div>
        </div>
    );

}