import axios from "axios";
import { TeachNotification, TradeNotification } from "./utilInterface/NotificationInterface";
import { useEffect } from "react";
import { NotificationCard } from "../components/notificationCard";
import { useRecoilState } from "recoil";
import { allNotificationsArray } from "../recoil/atoms";
const API_URL = import.meta.env.VITE_API_URL;

export function Notifications(){

    const [ allNotifications , setAllNotifications ] = useRecoilState<(TeachNotification | TradeNotification)[]>(allNotificationsArray);

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
                    if(item.status == "PENDING"){
                        return <NotificationCard {...item}/>
                    }
                    else{
                        return null
                    }
                })}
            </div>
        </div>
    );
}