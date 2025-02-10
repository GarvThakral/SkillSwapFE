import axios from "axios";
import { TeachNotification ,TradeNotification } from "../routes/utilInterface/NotificationInterface";
import { allNotificationsArray } from "../recoil/atoms";
import { useRecoilState } from "recoil";

const API_URL = import.meta.env.VITE_API_URL;


export function NotificationCard(NotificationProps: TeachNotification | TradeNotification){
    const token = localStorage.getItem('token');
    const [ allNotifications , setAllNotifications ] = useRecoilState<(TeachNotification | TradeNotification )[]>(allNotificationsArray);
    async function acceptRequest(type:string , notifId:any){
        const requestId = NotificationProps.id;
        const response = await axios.post(`${API_URL}/transaction/pending`,
            {
                user2Id:NotificationProps.senderId
            },
            {
                headers:{
                    token
                }
            }
        )
        if(response.status == 200){
            alert("Complete pending transaction");
            return;
        }
        const userTokens = await axios.post(`${API_URL}/user/tokens`,
            {
                userId:NotificationProps.receiver?.id
            }
        )
        console.log(userTokens.data.UsersTokens.tokens)
        if(type == "TEACH"){
            if(userTokens.data.UsersTokens.tokens < NotificationProps.recieverToken){
                alert("You dont have enough tokens to accept ")
                return;
            }
        }else if(type == "TRADE"){
            let rectok:number = NotificationProps.recieverToken
            let sentok:number = NotificationProps.senderToken
            let netToken = rectok-sentok
            console.log(netToken)
            if(netToken >= 0){
                if(userTokens.data.UsersTokens.tokens < netToken){
                    alert("You dont have enough tokens to accept ")
                    return;
                }
            }
        }

        setAllNotifications(allNotifications.filter((item)=>item.id != notifId))

        if(NotificationProps.type == "TEACH"){
            
            
            await axios.post(`${API_URL}/teachRequest/accept`,
                {
                    requestId:NotificationProps.id
                },
                {
                    headers:{
                        token
                    }
                }
            );

            const contentString = `${NotificationProps.description} . I am available ${NotificationProps.workingDays} .`
            await axios.post(`${API_URL}/messages`,
                {
                    senderId:NotificationProps.sender?.id,
                    content:contentString,
                    receiverId:NotificationProps.receiver?.id
                },
                {
                    headers:{
                        token
                    }
                }
            )
            
            await axios.post(`${API_URL}/transaction`,
                {
                    type:"TEACH_REQUEST",
                    recieverId:NotificationProps.senderId,
                    recieverSkillId:NotificationProps.skillId,                             
                    senderAmount:0,
                    recieverAmount:NotificationProps.recieverToken,
                    requestId:NotificationProps.id
                },
                {
                    headers:{
                        token
                    }
                }
            ) 
        }else if( NotificationProps.type == "TRADE" ){
            await axios.post(`${API_URL}/tradeRequest/accept`,
                {
                    requestId:NotificationProps.id
                },
                {
                    headers:{
                        token
                    }
                }
            );
            const contentString = `I would like to trade you ${NotificationProps.senderSkill?.title} in exchange for ${NotificationProps.receiverSkill?.title}. ${NotificationProps.description} . I am available ${NotificationProps.workingDays} .`
            await axios.post(`${API_URL}/messages`,
                {
                    senderId:NotificationProps.sender?.id,
                    content:contentString,
                    receiverId:NotificationProps.receiver?.id
                },
                {
                    headers:{
                        token
                    }
                }
            )
            await axios.post(`${API_URL}/transaction`,
                {
                    type:"TRADE_REQUEST",
                    recieverId:NotificationProps.senderId,
                    recieverSkillId:NotificationProps.receiverSkillId,
                    senderSkillId:NotificationProps.senderSkillId,                             
                    senderAmount:NotificationProps.senderToken,
                    recieverAmount:NotificationProps.recieverToken,
                    requestId
                },
                {
                    headers:{
                        token
                    }
                }
            ) 
        }

        
        
    };
    async function denyRequest(type:string , notifId:any){
        setAllNotifications(allNotifications.filter((item)=>item.id!=notifId))
        if(type == "TEACH"){
            await axios.post(`${API_URL}/teachRequest/deny`,
                {
                    requestId:NotificationProps.id
                },
                {
                    headers:{
                        token
                    }
                }
            );
            return;
        }
        await axios.post(`${API_URL}/tradeRequest/deny`,
            {
                requestId:NotificationProps.id
            },
            {
                headers:{
                    token
                }
            }
        );
        return;
        
    };
    
    return(
        <div className = {'w-[90%] h-[10%] flex justify-between bg-slate-300 p-2 rounded-xl mb-2'}>
            <div className = {'flex items-center'}>
                <img src = {NotificationProps.sender?.profilePicture} className = {'rounded-[50%] size-16'}></img>
                {NotificationProps.type == "TEACH" ? 
                <div className = {'flex items-center'}>
                    <span className = "pl-1">{NotificationProps.sender?.username} wants to you teach you </span>
                    <span className = {'p-1 text-blue-600'}>{NotificationProps.skill?.title} </span>
                    <span className = {'flex items-center'}>in exchange for {NotificationProps.recieverToken.toString()} <img src = "coin.png" className = {'size-6 inline'}></img></span>
                </div> :
                 <div>
                    <span className = "pl-1">{NotificationProps.sender?.username} wants to you teach you</span>
                    <span className = {'p-1 text-blue-600'}>{NotificationProps.senderSkill?.title} For {NotificationProps.senderToken.toString()}<img src = "coin.png" className = {'size-6 inline'}></img><span className = {'text-black'}> in exchange for </span>{NotificationProps.receiverSkill?.title} {NotificationProps.recieverToken}<img src = "coin.png" className = {'size-6 inline'}></img> ( )</span>
                </div>}

            </div>
            <div className = {'flex items-center space-x-4'}>
                <button className = {' bg-green-500 p-3 rounded-lg'} onClick={()=>acceptRequest(NotificationProps.type , NotificationProps?.id)}>Accept</button>
                <button className = {' bg-red-500 text-white p-3 rounded-lg'} onClick={()=>denyRequest(NotificationProps.type , NotificationProps?.id)}>Deny</button>
            </div>
        </div>
    );

}