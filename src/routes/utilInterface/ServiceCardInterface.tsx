export interface ServiceCard{
    clickFunction ?: (jobId:number)=>void;
    createdAt?:string;
    description:string;
    id:number;
    requesterId:number;
    tokenPrice:number;
    skillId:number;
    status:"PENDING"|"COMPLETED"|"CANCELLED";
    updatedAt:string;
    user:{
        id:number;
        availabilitySchedule:string;
        profilePicture:string;
        username:string;
        receivedRatings?: [
            {
                id:number,
                receiverId:number,
                raterId:number,
                rating:number,
                comment:string
            }
        ]
    };
    skill:{
        id:number;
        description:string;
        proficiencyLevel:"BEGINNER" | "INTERMEDIATE" | "ADVANCED";
        title:string;
    }
}