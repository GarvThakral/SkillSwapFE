import { Link } from "react-router-dom";
import { Button } from "../components/buttons";
import { RightArrowIcon } from "../components/rightArrowIcon";
import { VideoCallIcon } from "../components/videoCallIcon";
import { MessageButton } from "../components/messageButtonIcon";
import { PersonIcon } from "../components/personIcon";

export function Landing(){
    return(
        <div className = {'min-h-screen flex flex-col items-center p-6'}>
            <div className = {`flex flex-col items-center max-w-[60%] space-y-6 font-['DM_sans'] mb-12`}>
                <h1 className = {'text-3xl font-bold'}>Exchange Knowledge, No Money Needed!</h1>
                <h1 className = {'text-2xl'}>Trade Skills, Grow Together!</h1>
                <p className= {'text-center'}>Why pay when you can trade? SkillSwap is a platform where you can exchange skills with others—teach what you know, learn what you don’t. Whether it's coding for design, music for marketing, or any skill under the sun, connect with like-minded people and grow your expertise in a barter-style system</p>
                <div className = {'flex'}>
                    <Button style="Tertiary" text = "Get started" icon = {<RightArrowIcon/>}/>
                    <Link to = "about"><Button style="Secondary" text = "Learn More" /></Link>
                </div>
            </div>
            <div className = {'flex flex-col items-center space-y-6 w-full'}>
                <h1 className = {'text-3xl font-bold'}>How SkillTrade works</h1>
                <div className = {'flex justify-around w-full'}>
                    <div className = {'min-w-96 min-h-48 border-2 rounded-xl flex flex-col items-center justify-center'}>
                        <VideoCallIcon size = {12}/>
                        <span className= {'font-bold'}>Video Calls</span>
                        <span className = {"max-w-52 text-center"}>Connect face-to-face and learn in real-time.</span>
                    </div>
                    <div className = {'min-w-96 min-h-48 border-2 rounded-xl flex flex-col items-center justify-center'}>
                        <MessageButton onClick={()=>console.log("Hi")} />
                        <span className= {'font-bold'}>Messaging</span>
                        <span className = {"max-w-52 text-center"}>Chat, plan, and collaborate seamlessly.</span>
                    </div>
                    <div className = {'min-w-96 min-h-48 border-2 rounded-xl flex flex-col items-center justify-center'}>
                        <PersonIcon />
                        <span className= {'font-bold'}>Skill Exchange</span>
                        <span className = {"max-w-52 text-center"}>Schedule sessions and exchange skills.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}