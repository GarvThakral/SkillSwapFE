import { atom } from "recoil";
import { ServiceCard } from "../routes/utilInterface/ServiceCardInterface";
import { TeachNotification, TradeNotification } from "../routes/utilInterface/NotificationInterface";

export const signInState = atom({
    key:"signInState",
    default:false
})


export const userTokens = atom({
    key:"userTokens",
    default:50
})
export const responseState = atom<ServiceCard[] | null>({
    key: "responseState",
    default: null,
});
export const originalResponseState = atom<ServiceCard[] | null>({
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

export const meetingReceiverId = atom({
  key:"ReceiverId",
  default:0
})

export const teachRequestTokens = atom({
  key:"Teach Tokens",
  default:50
})
export const tradeRequestRecieverTokens = atom({
  key:"Trade Tokens",
  default:50
})

export const allNotificationsArray = atom<(TeachNotification | TradeNotification)[]>({
  key: "all notifications",
  default: [], 
});