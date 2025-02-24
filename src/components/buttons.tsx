import { ReactNode } from "react";

interface ButtonProps{
    text:string,
    icon?:ReactNode,
    style:"Primary"|"Secondary"|"Tertiary";
    onclick?:()=>void;
}

const buttonStyles = {
    "Primary":"bg-[#000000] text-[#ffffff]",
    "Secondary":"bg-[#0B2638] text-[#008FE9]",
    "Tertiary":"bg-[#FF6F20] text-[#ffffff]"
}

export function Button(props:ButtonProps){
    return(
        <div className = {`p-2 min-w-28 flex justify-center items-center rounded-md ${buttonStyles[props.style]} hover:scale-[102%] duration-300`} onClick={props.onclick}>
            <button className= {"flex items-center min-w-36 justify-around"}>{props.text}{props.icon}</button>
        </div>
    )
}