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


        const response = await axios.get(`${API_URL}/teachRequest/get`,
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
        <div className = {`flex items-center pt-16 h-screen flex-col font-['DM_sans']`}>
            {/* {isLoading ? <Loader/> :null} */}
            
            <span className = {'md:w-[80%] w-[90%] ml-2 font-bold text-xl '}>Notifications</span>
            <div className = {'md:w-[80%] w-[90%] min-w-32 min-h-32 border-2 rounded-lg p-4 flex flex-col'}>
                {allNotifications?.length == 0 ? <span className ={'self-center my-auto'}>No notifications yet .....</span>:null}
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