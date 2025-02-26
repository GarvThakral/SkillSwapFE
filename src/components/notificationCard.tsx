import axios from "axios";
import { TeachNotification ,TradeNotification } from "../routes/utilInterface/NotificationInterface";
import { allNotificationsArray, serviceId } from "../recoil/atoms";
import { useRecoilState } from "recoil";
import { Button } from "./buttons";

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
                    requestId:NotificationProps.id,
                    serviceId:NotificationProps.serviceRel.id
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
        <div className = { `min-h-16 flex flex-col items-center md:flex-row justify-between p-2 rounded-xl mb-2 font-['DM_sans'] border-2 shadow-sm`}>
            <div className="flex items-center gap-2 text-clip self-start">
            <img 
                src={NotificationProps.sender?.profilePicture} 
                className="rounded-full size-12 shadow-lg border-2 border-gray-400"
            />

            <span className="flex items-center gap-1 flex-wrap">
                {NotificationProps.sender?.username} wants to teach you
                <span className="font-semibold">{NotificationProps.type === "TEACH" ? NotificationProps.skill?.title : NotificationProps.senderSkill?.title}</span>

                {NotificationProps.type !== "TEACH" && (
                <>
                    for 
                    <img src="token.svg" className="size-4 inline" />
                    {NotificationProps.senderToken} 
                    <span className="text-black"> in exchange for </span>
                    <span className="font-semibold ">{NotificationProps.receiverSkill?.title}</span> 
                    <img src="token.svg" className="size-4 inline " />
                    {NotificationProps.recieverToken}
                </>
                )}

                {NotificationProps.type === "TEACH" && (
                <>
                    in exchange for 
                    <img src="token.svg" className="size-4 inline" />
                    {NotificationProps.recieverToken} 
                </>
                )}
            </span>
            </div>

            <div className = {'flex items-center space-x-4 '}>
                <Button style = {"Primary"}  onclick={()=>acceptRequest(NotificationProps.type , NotificationProps?.id)} text = {"Accept"}/>
                <Button style = {"Secondary"}  onclick={()=>denyRequest(NotificationProps.type , NotificationProps?.id)} text = {"Deny"}/>
            </div>
        </div>
    );

}