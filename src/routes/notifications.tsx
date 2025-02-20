import axios from "axios";
import { TeachNotification, TradeNotification } from "./utilInterface/NotificationInterface";
import { useEffect } from "react";
import { NotificationCard } from "../components/notificationCard";
import { useRecoilState } from "recoil";
import { allNotificationsArray, loaderState } from "../recoil/atoms";
import Loader from "../components/loader";
const API_URL = import.meta.env.VITE_API_URL;

export function Notifications(){

    const [ allNotifications , setAllNotifications ] = useRecoilState<(TeachNotification | TradeNotification)[]>(allNotificationsArray);
    const [ isLoading , setIsLoading ] = useRecoilState(loaderState);
    async function fetchAllRequests(){
        setIsLoading(true);
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
        setIsLoading(false);
    }
    useEffect(()=>{
        fetchAllRequests()
    },[]);

    return(
        <div className = {'flex justify-center p-3 h-screen'}>
            {isLoading ? <Loader/> :null}
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