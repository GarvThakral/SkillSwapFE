import { Button } from "../components/buttons";
import { RightArrowIcon } from "../components/rightArrowIcon";

export function Landing(){
    return(
        <div className = {'min-h-screen flex flex-col items-center p-6'}>
            <div className = {'flex flex-col items-center max-w-[60%] space-y-6'}>
                <h1 className = {'text-3xl'}>Exchange Knowledge, No Money Needed!</h1>
                <h1 className = {'text-2xl'}>Trade Skills, Grow Together!</h1>
                <p className= {'text-center'}>Why pay when you can trade? SkillSwap is a platform where you can exchange skills with others—teach what you know, learn what you don’t. Whether it's coding for design, music for marketing, or any skill under the sun, connect with like-minded people and grow your expertise in a barter-style system</p>
                <Button style="Primary" text = "Get started" icon = {<RightArrowIcon/>}/>
            </div>
        </div>
    );
}