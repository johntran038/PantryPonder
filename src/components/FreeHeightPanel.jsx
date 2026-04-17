import React, { useState, useEffect } from "react";

const FreeHeightPanel = ({ children, cols = 1 }) => {

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