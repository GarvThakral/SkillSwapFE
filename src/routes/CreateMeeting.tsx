import { useEffect } from 'react';
import { useDyteClient , DyteProvider } from '@dytesdk/react-web-core';
import { MyMeeting } from '../components/myMeetingComponent';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { meetingReceiverId } from '../recoil/atoms';
const API_URL = import.meta.env.VITE_API_URL;

export default function Meeting({meetingId }:{meetingId?:string }) {
  
  const [meeting, initMeeting] = useDyteClient();
  const [ meetingRecid , setMeetingRecId ] = useRecoilState(meetingReceiverId) 

  async function createMeetingAndClient(){
    const createMeeting = async () => {
      const response = await fetch(`${API_URL}/meeting/meetings`, {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "My Test Meeting" }),
      });
    
      const data = await response.json();
      return data.data.id; 
    };
    
    const addParticipant = async (meeting_id:string) => {
      const participant_id = localStorage.getItem('userId')
      const response = await fetch(`${API_URL}/meeting/addParticipant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meeting_id: meeting_id,
          participant_id, 
        }),
      });
    
      const data = await response.json();
      return data.data.token;  
    };
    let meeting_id;
    if(meetingId){
      console.log(meetingId)
      meeting_id = meetingId;
    }else{
      meeting_id = await createMeeting();
    }
    const authToken = await addParticipant(meeting_id);
    const token = localStorage.getItem('token')
    const sending = await axios.post(`${API_URL}/messages`,
      {
          content:"Join",
          receiverId:meetingRecid,
          meetingId:meeting_id,
          type:"MEETING"
      },
      {
          headers:{
              token
          }
      }
    )
    
    initMeeting({
      authToken: authToken,
      defaults: {
        audio: false,
        video: false,
      },
    });
  }
  useEffect(() => {
    createMeetingAndClient()
  }, []);

  return(
    <DyteProvider value = {meeting} fallback = {<i>Loading ... </i>}>
      <MyMeeting />
    </DyteProvider>
  ); // TODO: render the UI
}