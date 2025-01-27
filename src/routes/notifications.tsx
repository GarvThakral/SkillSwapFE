import axios from "axios";
import { TeachNotification, TradeNotification } from "./utilInterface/NotificationInterface";
import { useEffect, useState } from "react";
import { NotificationCard } from "../components/notificationCard";
const API_URL = import.meta.env.VITE_API_URL;

export function Notifications(){

    const [ teachNotifications , setTeachNotifications ] = useState<TeachNotification[] | null>(null);
    const [ tradeNotifications , setTradeNotifications ] = useState<TradeNotification[] | null>(null);
    const [ allNotifications , setAllNotifications ] = useState<(TeachNotification | TradeNotification)[]>([]);

    async function fetchAllRequests(){
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/teachRequest` ,
            {
                headers: {
                    token
                }
            }
        )
        const response2 = await axios.get(`${API_URL}/tradeRequest` ,
            {
                headers: {
                    token
                }
            }
        )
        console.log(response);
        setAllNotifications([ ...response.data.teachRequests , ...response2.data.tradeRequests ]);
    }

    // async function fetchTeachRequests(){
        
    //     const token = localStorage.getItem('token');
    //     const response = await axios.get(`${API_URL}/teachRequest` ,
    //         {
    //             headers: {
    //                 token
    //             }
    //         }
    //     )
    //     setTeachNotifications(response.data.teachRequests)

    // };

    // async function fetchTradeRequests(){
    //     const token = localStorage.getItem('token');
    //     const response = await axios.get(`${API_URL}/tradeRequest` ,
    //         {
    //             headers: {
    //                 token
    //             }
    //         }
    //     )
    //     console.log(response);
    //     setTradeNotifications(response.data.tradeRequests);

    // };

    useEffect(()=>{
        // fetchTeachRequests()
        // fetchTradeRequests()
        fetchAllRequests()
    },[]);

    return(
        <div className = {'flex justify-center p-3 h-screen'}>
            <div className = {'w-screen'}>
                {allNotifications?.map((item)=>{
                    return <NotificationCard {...item}/>
                })}
            </div>
        </div>
    );
}