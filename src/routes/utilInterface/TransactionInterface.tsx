export interface TransactionInterface{
    createdAt:string;
    id:number;
    recieverAmount:number;
    recieverId:number;
    senderAmount:number;
    senderId:number;
    skillId:number;
    status:string;
    type:string;
    requestId:number;
}