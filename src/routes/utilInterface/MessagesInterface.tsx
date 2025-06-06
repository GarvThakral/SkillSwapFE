
export interface MessageInterface{
    id?: number,
    senderId?: number,
    receiverId?: number,
    content?: string,
    createdAt?: string
    type?: "REGULAR" | "MEETING",
    meetingId?:string;
    sender?:{
        profilePicture:string;
    }
    receiver?:{
        profilePicture:string;
    }
}