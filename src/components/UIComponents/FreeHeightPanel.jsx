import React, { useState, useEffect } from "react";
import useScreenSize from "../../hook/useScreenSize";

const FreeHeightPanel = ({ children }) => {

    const screenSize = useScreenSize();

    const [cols, setCols] = useState(1);

    useEffect(() => {
        if (screenSize == "2xl") setCols(5);
        else if (screenSize == "xl") setCols(5);
        else if (screenSize == "lg") setCols(4);
        else if (screenSize == "md") setCols(3);
        else if (screenSize == "sm") setCols(2);
        else if (screenSize == "xs") setCols(2);
        else setCols(1); //xs or default
    }, [screenSize]);


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