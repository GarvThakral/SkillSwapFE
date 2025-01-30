import { useParams } from "react-router-dom";
import Meeting from "./CreateMeeting";

export function JoinMeeting(){
    const {id} = useParams();
    return(
        <div>
            <Meeting meetingId = {id}/>
        </div>
    );
}