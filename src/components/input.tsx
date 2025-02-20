import { SearchIcon } from "./searchIcon";
import {  ChangeEvent, useRef } from "react";

export function Input({changeFunction}:{changeFunction:(e:ChangeEvent<HTMLInputElement>) => Promise<void>}){
    const inputRef = useRef<HTMLInputElement>(null);
    return(
    <div className = {'flex h-10 bg-white items-center p-2 border-none rounded-xl max-w-72 w-[80%] outline-none text-black'} onClick = {()=>{inputRef.current?.focus()}}>
      <SearchIcon />
      <input ref = {inputRef} placeholder="Search for any skill" className = "outline-none w-full" onChange={changeFunction}></input>
    </div>
    );
}