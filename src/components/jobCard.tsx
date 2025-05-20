"use client";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  receiverId,
  skillId,
  teachRequestTokens,
  tradeRequestRecieverTokens,
} from "../recoil/atoms";
import { ServiceCard } from "../routes/utilInterface/ServiceCardInterface";

// Define the interface for the user and skill
interface User {
  id: number;
  username: string;
  profilePicture?: string;
}

interface Skill {
  id: number;
  title: string;
  description: string;
  proficiencyLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
}

const API_URL = import.meta.env.VITE_API_URL;

const profTextStyles = {
  BEGINNER: "bg-green-100 text-green-700 border-green-200",
  INTERMEDIATE: "bg-yellow-100 text-yellow-700 border-yellow-200",
  ADVANCED: "bg-red-100 text-red-700 border-red-200",
};

export function JobCard(props: ServiceCard) {
  const navigate = useNavigate();
  const [recId, setRecId] = useRecoilState(receiverId);
  const setSkillId = useSetRecoilState(skillId);
  const setTeachTokenValue = useSetRecoilState(teachRequestTokens);
  const setTradeRecieverTokens = useSetRecoilState(tradeRequestRecieverTokens);
  const token = localStorage.getItem("token");

  async function checkPendingTransaction(user2Id: number) {
    try {
      const response = await axios.post(
        `${API_URL}/transaction/pending`,
        { user2Id },
        { headers: { token } }
      );
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async function createTeachRequest() {
    const targetUserId = props.user.id;
    setRecId(targetUserId);
    const isPending = await checkPendingTransaction(targetUserId);

    if (isPending) {
      alert("Complete your remaining transaction with this user first");
      return;
    }

    const userId = Number.parseInt(localStorage.getItem("userId") ?? "0");
    await axios.post(`${API_URL}/user/tokens`, { userId });

    setTeachTokenValue(props.tokenPrice);
    setSkillId(props.skill.id);
    navigate("/teachRequest");
  }

  async function createTradeRequest() {
    const targetUserId = props.user.id;
    setRecId(targetUserId);
    const isPending = await checkPendingTransaction(targetUserId);

    if (isPending) {
      alert("Complete your remaining transaction with this user first");
      return;
    }

    setSkillId(props.skill.id);
    setTradeRecieverTokens(props.tokenPrice);
    navigate("/tradeRequest");
  }

  return (
    <div className="w-96 rounded-xl bg-white h-80 overflow-hidden my-2 mx-2 shadow-lg hover:shadow-xl hover:scale-105 duration-300 border border-gray-100">
      {/* Head Block */}
      <div
        className="flex justify-between items-center border-b border-gray-200 p-4 h-[25%] relative bg-gradient-to-r from-purple-50 to-blue-50"
        onClick={() => props.clickFunction?.(props.id)}
      >
        {/* Token Price */}
        <div className="absolute top-4 left-4 flex items-center bg-white px-2 py-1 rounded-full shadow-sm">
          <img src="/coin.png" className="w-5 h-5 mr-1" alt="Token" />
          <span className="font-bold text-purple-700">{props.tokenPrice}</span>
        </div>

        {/* Profile */}
        <div className="flex justify-center mx-auto items-center">
          <img
            src={props.user.profilePicture || "/placeholder.svg"}
            className="rounded-full w-10 h-10 border-2 border-white shadow-sm"
            alt="Profile"
          />
          <div className="ml-2">
            <p className="font-medium text-gray-800">{props.user.username}</p>
            <p className="text-yellow-500 text-xs">★★★★★</p>
          </div>
        </div>

        {/* Proficiency Badge */}
        <div
          className={`absolute top-4 right-4 px-2 py-1 rounded-md text-xs font-semibold ${
            profTextStyles[props.skill.proficiencyLevel]
          }`}
        >
          {props.skill.proficiencyLevel}
        </div>
      </div>

      {/* Body Block */}
      <div className="flex flex-col justify-between h-[75%] p-5">
        <div className="flex flex-col items-center">
          <p className="font-bold text-lg text-gray-800 mb-2">"{props.skill.title}"</p>
          <p className="text-center text-gray-600 line-clamp-3">{props.skill.description}</p>
        </div>
        <div className="flex justify-around w-full mt-4">
          <button
            onClick={createTeachRequest}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            Teach
          </button>
          <button
            onClick={createTradeRequest}
            className="px-6 py-2 bg-white text-purple-600 border-2 border-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
          >
            Trade
          </button>
        </div>
      </div>
    </div>
  );
}
