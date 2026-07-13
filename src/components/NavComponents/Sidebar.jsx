import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaPersonCircleQuestion } from "react-icons/fa6";
import { IoPerson } from "react-icons/io5";
import { CiSquarePlus } from "react-icons/ci";
import { TbFridge } from "react-icons/tb";
import { ImCompass2 } from "react-icons/im";
import useScreenSize from "../../hook/useScreenSize";


const Sidebar = ({ className, onClick, session, username }) => {

    const navigate = useNavigate();

    const location = useLocation();
    const { screenSize } = useScreenSize();

    return (
        <div className={`bg-gray-500 ${className} text-5xl md:text-4xl     w-full md:w-auto fixed md:static bottom-0 md:bottom-auto`}>
            <div className="
                p-4 sticky top-0 space-x-6 flex justify-center items-center
                
                sm:space-x-20
                md:pt-10 md:space-x-0 md:space-y-2 md:block
                ">
                <div className="flex justify-center items-center">
                    <button className="bg-gray-200 p-1 rounded-lg cursor-pointer" onClick={() => { navigate(`/`) }}>
                        {/* Discover */}
                        <ImCompass2 />
                    </button>
                </div>
                <div className="flex justify-center items-center">
                    <button className="bg-gray-200 p-1 rounded-lg cursor-pointer opacity-50"
                        onClick={
                            () => { onClick(true) }
                        }>
                        {/* My Pantry */}
                        <TbFridge />
                    </button>
                </div>
                {/* <div className="flex justify-center items-center">
                    <button className="bg-gray-200 p-1 rounded-lg cursor-pointer">Saved Dishes</button>
                </div> */}
                {session ?
                    (
                        <div className="flex justify-center items-center">
                            <button className="bg-gray-200 p-1 rounded-lg cursor-pointer" onClick={() => { navigate(`/${username}`) }}>
                                {/* My Profile */}
                                <IoPerson />
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center">
                            <button className="bg-gray-200 p-1 rounded-lg cursor-pointer" onClick={() => { navigate("/login") }}>
                                {/* Login */}
                                <FaPersonCircleQuestion />
                            </button>
                        </div>
                    )
                }
                {(session) && (
                    <div className="flex justify-center items-center">
                        <button className="
                            bg-gray-200 p-1 rounded-lg cursor-pointer
                            disabled:opacity-50 disabled:cursor-default
                        "
                        onClick={() => { navigate(`/create-dish`)}}
                        disabled={location.pathname == '/create-dish'}
                        >
                            <CiSquarePlus />
                            {/* Create A Dish */}
                        </button>
                    </div>
                )}

                {/* VVVVVVVV DELETE AFTER TESTING VVVVVVVVVVVVV */}
                {/* <div className="flex justify-center items-center">
                    <button className={`${screenSize == "2xs" && "bg-red-700"} ${screenSize == "xs" && "bg-orange-300"} sm:bg-green-500 md:bg-gray-200 p-1 rounded-lg cursor-pointer`}>
                        <IoPerson />
                    </button>
                </div> */}
            </div>
        </div>
    )
};

export default Sidebar;