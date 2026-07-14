import React from "react";
import { RxCross1 } from "react-icons/rx";
import { Tooltip } from "@material-tailwind/react";

const ToolTip = ({ className, children }) => {
    

    return (
        <Tooltip content={"test"} className="bg-black p-1 rounded-md shadow-lg text-sm">
        <div className="rounded-2xl bg-gray-400 p-2 w-fit flex items-center space-x-1">
            {children}
        </div>
        </Tooltip>
    )
};

export default ToolTip;