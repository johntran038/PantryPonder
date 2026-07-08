import React, { useState, useEffect } from "react";

const FreeHeightPanel = ({ children }) => {

    const [cols, setCols] = useState(1);

    useEffect(() => {
        const updateCols = () => {
            if (window.innerWidth >= 1536) setCols(5); //2xl
            else if (window.innerWidth >= 1280) setCols(5); //xl
            else if (window.innerWidth >= 1024) setCols(4); //lg
            else if (window.innerWidth >= 768) setCols(3); //md
            else if (window.innerWidth >= 640) setCols(2); //sm
            else setCols(1); //xs or default
        };
        updateCols();
        window.addEventListener("resize", updateCols);
        return () => window.removeEventListener("resize", updateCols);
    }, [window.innerWidth]);

    const columns = []
    for (let i = 0; i < cols; i++) {
        columns.push([])
    }

    React.Children.forEach(children, (child, i) => {
        columns[i % cols].push(
            <div key={i} className="w-full">
                {child}
            </div>
        );
    });


    return (
        <div className="flex flex-row space-x-2">
            {columns.map((column, index) => (
                <div key={index} className="flex flex-col gap-y-2 flex-1">
                    {column}
                </div>
            ))}
        </div>
    );
};

export default FreeHeightPanel;