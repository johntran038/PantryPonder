import React from "react";
import { RxCross1 } from "react-icons/rx";

const Tag = ({ className, name, onRemove }) => {
    

    return (
        <div className="rounded-2xl bg-gray-400 p-2 w-fit flex items-center space-x-1">
             <div className="text-lg">{name}</div>
            <button type="button" className="px-1 text-sm hover:cursor-pointer" onClick={()=>onRemove(name)}><RxCross1/></button>
        </div>
    )
};

export default Tag;