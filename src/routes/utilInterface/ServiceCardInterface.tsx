export interface ServiceCard{
    clickFunction ?: (jobId:number)=>void;
    createdAt?:string;
    id?:Number;
    requesterId:Number;
    skillId:Number
    status:"PENDING"|"COMPLETED"|"CANCELLED";
    updatedAt:string;
    sender:{
        id:string;
        availabilitySchedule:string;
        profilePicture:string;
        username:string;
    };
    receiver:{
        id:string;
        availabilitySchedule:string;
        profilePicture:string;
        username:string;
    };
    skill:{
        id:string;
        description:string;
        proficiencyLevel:"BEGINNER" | "INTERMEDIATE" | "ADVANCED";
        title:string;
    }
}