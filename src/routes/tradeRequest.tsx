import axios from "axios";
import { Button } from "../components/buttons";
import { useEffect, useRef, useState } from "react";
import { loaderState, receiverId, serviceId, skillId, skillName, tradeRequestRecieverTokens, userName } from "../recoil/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { SkillProps } from "./utilInterface/SkillInterface";
import { SearchIcon } from "../components/searchIcon";

const API_URL = import.meta.env.VITE_API_URL;

export function TradeService() {
    const dayRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);

    const [recId] = useRecoilState(receiverId);
    const [skillsId] = useRecoilState(skillId);
    const [senderSkillId, setSenderSkillId] = useState<number | null>(null);
    const [tradeRecieverTokens] = useRecoilState(tradeRequestRecieverTokens);

    const [existingSkills, setExistingSkills] = useState<SkillProps[]>([]);
    const [filteredSkills, setFilteredSkills] = useState<SkillProps[]>([]);
    const [searching, setSearching] = useState(false);
    const [ isLoading , setIsLoading ] = useRecoilState(loaderState)

    const [skillsName] = useRecoilState(skillName);
    const [usersName] = useRecoilState(userName);

    const servId = useRecoilValue(serviceId); 

    useEffect(() => {
        axios.get(`${API_URL}/skill`).then(response => {
            setExistingSkills(response.data.skills);
            setFilteredSkills(response.data.skills);
        });
    }, []);

    function searchSkills(e: React.ChangeEvent<HTMLInputElement>) {
        inputRef.current!.value = e.target.value;
    }

    async function createTradeRequest() {
        setIsLoading(true);
        const skillExists = existingSkills.some(skill => skill.title === inputRef.current?.value);
        if (!skillExists) {
            alert("Invalid skill selected");
            setIsLoading(false);
            return;
        }

        const token = localStorage.getItem("token");
        const senderToken = parseInt(priceRef.current?.value || "0");
        const netAmount = tradeRecieverTokens - senderToken;

        if (netAmount >= 0) {
            const userId = parseInt(localStorage.getItem("userId") || "0");
            const userTokens = await axios.post(`${API_URL}/user/tokens`, { userId });
            if (userTokens.data.UsersTokens.tokens < netAmount) {
                alert("You don't have enough tokens to make this transaction");
                setIsLoading(false);
                return;
            }
        }

        await axios.post(`${API_URL}/tradeRequest`, {
            receiverSkillId: skillsId,
            senderSkillId,
            description: descRef.current?.value,
            receiverId: recId,
            workingDays: dayRef.current?.value,
            senderToken,
            recieverToken: tradeRecieverTokens,
            serviceId:servId

        }, {
            headers: { token },
        });
        setIsLoading(false);

    }

    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center space-y-4">
            {isLoading ? null:null}
            <div className="shadow-2xl p-6 w-[40%] min-h-[70%] flex flex-col justify-between items-center space-y-5 "> 
                {parseInt(inputRef.current?.value ?? "0") == 0 ? null:<span className = {'flex flex-wrap text-3xl font-bold items-center'}>Trading &nbsp;<span className = {'font-extrabold'}>{usersName} </span>&nbsp;<span className = {'text-blue-600'}>{skillsName}</span>&nbsp; in exchange for &nbsp;</span>}
                <span className = {'font-semibold text-xl'}>What skill would you like to offer?</span>
                <div className=" flex items-center p-2 border-b-2 bg-opacity-20 space-x-3">
                    <SearchIcon />
                    <input
                        type="search"
                        ref={inputRef}
                        placeholder="Search for any skill..."
                        className="outline-none bg-transparent placeholder-slate-950"
                        onChange={searchSkills}
                        onFocus={() => setSearching(true)}
                    />
                </div>
                {searching && (
                    <div className="overflow-y-auto h-28 border-2 w-64 p-3">
                        {filteredSkills.map((item) => (
                            <div key={item.id} onClick={() => {
                                inputRef.current!.value = item.title;
                                setSearching(false);
                                setSenderSkillId(item.id);
                            }}>
                                {item.title}
                            </div>
                        ))}
                    </div>
                )}
                <span className="font-semibold text-xl">How much do you wanna charge?</span>
                <input type="number" defaultValue={50} className="p-2 border-b-2 w-20 text-center" ref={priceRef} />
                <span className = {'font-semibold text-xl'}>When are you available to teach ? </span>
                <input className = {'outline-none border-b-2 '} ref = {dayRef} placeholder = {'Add your prefered days'}></input>
                <span className = {'font-semibold text-xl'}>Add a comment</span>
                <input className = {'outline-none border-b-2 w-96'} ref = {descRef} placeholder = {'I work on tuesdays but id be avalialble after 9 .... '} ></input>
                {}
                <Button text="Send request" style="Primary" onclick={createTradeRequest} />
            </div>
        </div>
        
    );
}
    