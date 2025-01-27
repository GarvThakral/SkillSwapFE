export interface TeachNotification{
    id?: number;
    senderId?: number;
    receiverId?: number;
    skillId?: number;
    description?: string;
    workingDays?: string;
    status?: string;
    createdAt?: string;
    type:"TEACH"
    sender?: {
        id?: number;
        profilePicture?: string;
        username?:  string;
        availabilitySchedule?: string;
    },
    receiver?: {
        id?: number,
        profilePicture?: string;
        username?: string;
        availabilitySchedule?: string;
    },
    skill?: {
        id?: number;
        title?: string;
        description?: string;
        proficiencyLevel?: string;
    }
}

export interface TradeNotification{
    id?:number;
    senderId?:number;
    receiverId?:number;
    senderSkillId?:number;
    receiverSkillId?:number;
    description?:string; 
    workingDays?:string;
    status?: "PENDING" | "COMPLETED" | "CANCELED";
    createdAt?:string;
    type:"TRADE"
    sender?: {
        id?: number;
        profilePicture?: string;
        username?:  string;
        availabilitySchedule?: string;
    },
    receiver?: {
        id?: number,
        profilePicture?: string;
        username?: string;
        availabilitySchedule?: string;
    },
    senderSkill?:{
        id?:number,
        title?:string,
        description?:string,
        proficiencyLevel?:string
    },
    receiverSkill?:{
        id?:number,
        title?:string,
        description?:string,
        proficiencyLevel?:string
    }
}