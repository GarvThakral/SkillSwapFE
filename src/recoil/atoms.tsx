import { atom } from "recoil";

interface ServiceResponse{
    createdAt:string;
    id:Number;
    requesterId:Number;
    skillId:Number
    status:"PENDING"|"COMPLETED"|"CANCELLED";
    updatedAt:string;
    user:{
      availabilitySchedule:string;
      profilePicture:string;
      username:string;
    };
    skill:{
      description:string;
      proficiencyLevel:"BEGINNER" | "INTERMEDIATE" | "ADVANCED";
      title:string;
  }
  }

export const signInState = atom({
    key:"signInState",
    default:false
})

export const userTokens = atom({
    key:"userTokens",
    default:50
})
export const responseState = atom<ServiceResponse[] | null>({
    key: "responseState",
    default: null,
});
export const originalResponseState = atom<ServiceResponse[] | null>({
  key: "originalResponseState",
  default: null,
});

export const receiverId = atom({
  key: "receiverId",
  default:0
})
export const skillId = atom({
  key: "skillId",
  default:0
})
export const messageButtonState = atom({
  key: "messageButton",
  default:false
})