import { ReactNode } from "react";

interface ButtonProps{
    text:string,
    icon?:ReactNode,
    style:"Primary"|"Secondary"|"Tertiary";
    onclick?:()=>void;
}

const buttonStyles = {
    "Primary":"bg-[#000000] text-[#ffffff] ",
    "Secondary":"bg-[#ffffff] text-[#000000] border-2 ",
    "Tertiary":"bg-[#000000] text-[#ffffff] "
}

export function Button(props:ButtonProps){
    return(
        <div className = {`m-2 p-2 flex justify-center items-center rounded-md ${buttonStyles[props.style]} hover:scale-[102%] duration-300`} onClick={props.onclick}>
            <button className= {"flex items-center min-w-28 justify-around"}>{props.text}{props.icon}</button>
        </div>
    )
}