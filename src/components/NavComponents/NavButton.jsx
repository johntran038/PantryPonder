import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tooltip } from "@material-tailwind/react";

const NavButton = ({ className, buttonClassName, button, children, link, tooltip }) => {
    const navigate = useNavigate();

    return (
        <div className={`flex justify-center items-center ${className}`}>
            <Tooltip content={tooltip} className="mx-2 bg-black p-2 rounded-md shadow-lg text-sm animate-none" placement="right"
                animate={{
                    mount: { transition: { duration: 0 } },
                    unmount: { transition: { duration: 0 } },
                }}
            >
                {!button ? (
                    <button
                        className={`bg-gray-200 p-1 rounded-lg cursor-pointer ${buttonClassName}`}
                        onClick={() => { navigate(link) }}
                    >
                        {children}
                    </button>
                ) : (
                    button
                )
                }</Tooltip>
        </div>
    )
};

export default NavButton;