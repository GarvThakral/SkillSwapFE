import { SearchIcon } from "./searchIcon";
import { useRef } from "react";

export function Input({changeFunction}:{changeFunction:()=>void}){
    const inputRef = useRef<HTMLInputElement>(null);
    return(
    <div className = {'flex h-10 bg-white items-center p-2 border-none rounded-xl w-96 outline-none text-black'} onClick = {()=>{inputRef.current?.focus()}}>
      <SearchIcon />
      <input ref = {inputRef} placeholder="Search for any skill" className = "outline-none w-80" onChange={changeFunction}></input>
    </div>
    );
}