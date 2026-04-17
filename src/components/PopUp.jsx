import React, { useState, useEffect, useRef } from "react";

const PopUp = ({ className, open, setOpen }) => {

    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                console.log("Clicked outside!");
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (<>
        {open && (
        <div ref={ref} className={`bg-white rounded-lg shadow-lg p-6 h-150 w-250 outline pointer-events-auto ${className}`}>
            test
        </div>
    )}
    </>)
};

export default PopUp;