import { ReactNode } from "react";

interface ButtonProps{
    text:string,
    icon?:ReactNode,
    style:"Primary"|"Secondary"|"Tertiary";
    onclick?:()=>void;
}

const buttonStyles = {
    "Primary":"bg-[#0B2638] text-[#ffffff]",
    "Secondary":"bg-[#0B2638] text-[#008FE9]",
    "Tertiary":"bg-[#FF6F20] text-[#ffffff]"
}

export function Button(props:ButtonProps){
    return(
        <div className = {`p-2  w-32 flex justify-center items-center rounded-lg ${buttonStyles[props.style]}`} onClick={props.onclick}>
            <button>{props.text}{props.icon}</button>
        </div>
    )
}