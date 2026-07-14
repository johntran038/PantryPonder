import React from "react";
import { RxCross1 } from "react-icons/rx";
import useScreenSize from "../hook/useScreenSize";

const ResponsiveHelper = ({ className }) => {

    const { screenSize, ifScreen } = useScreenSize();
    
    return (
        <div className=" absolute top-0 w-full z-100">
            <div className="relative h-15 flex justify-center items-center">
                <div className="relative z-10 text-4xl font-bold text-white [-webkit-text-stroke:1.5px_black] uppercase">
                    {screenSize}
                </div>
                <div className={`absolute opacity-70 inset-0
                ${ifScreen("2xs", "bg-red-500")}
                ${ifScreen("xs", "bg-orange-500")}
                sm:bg-yellow-500
                md:bg-lime-500
                lg:bg-green-500
                xl:bg-teal-500
                2xl:bg-sky-500
                ${className}`}>

                </div>
            </div>
        </div>
    )
};

export default ResponsiveHelper;