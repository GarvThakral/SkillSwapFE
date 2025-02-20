import axios from "axios";
import { Button } from "../components/buttons";
import { useEffect, useRef, useState } from "react";
import { loaderState, receiverId, skillId, tradeRequestRecieverTokens } from "../recoil/atoms";
import { useRecoilState } from "recoil";
import { SkillProps } from "./utilInterface/SkillInterface";
import { SearchIcon } from "../components/searchIcon";
import Loader from "../components/loader";

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
        }, {
            headers: { token },
        });
        setIsLoading(false);

    }

    return (
        <div className="min-h-screen w-screen flex flex-col items-center space-y-4">
            {isLoading ? <Loader/>:null}
            <span>What skill would you like to offer?</span>
            <div className="h-18 w-64 flex items-center p-2 rounded-2xl bg-blue-400 bg-opacity-20 space-x-3">
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
            <span className="text-2xl">How much do you wanna charge?</span>
            <input type="number" defaultValue={50} className="p-2 border-2 w-20" ref={priceRef} />

            <span>When are you available to trade?</span>
            <input ref={dayRef} placeholder="Add your preferred days" />

            <span>Add a comment</span>
            <input ref={descRef} placeholder="I work on Tuesdays but I'm available after 9..." className="w-96" />

            <Button text="Send request" style="Primary" onclick={createTradeRequest} />
        </div>
    );
}
    