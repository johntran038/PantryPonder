import React from "react";

const Tag = ({ className, name, onRemove }) => {
    

    return (
        <div className="rounded-lg bg-gray-400 px-1 w-fit">
            {name}
            <button type="button" className="px-1" onClick={()=>onRemove(name)}>x</button>
        </div>
    )
};

export default Tag;