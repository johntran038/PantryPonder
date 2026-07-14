import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaPersonCircleQuestion } from "react-icons/fa6";
import { IoPerson } from "react-icons/io5";
import { CiSquarePlus } from "react-icons/ci";
import { TbFridge } from "react-icons/tb";
import { ImCompass2 } from "react-icons/im";
import useScreenSize from "../../hook/useScreenSize";
import NavButton from "./NavButton";


const Sidebar = ({ className, onClick, session, username }) => {

    const navigate = useNavigate();

    const location = useLocation();
    const { screenSize } = useScreenSize();

    return (
        <div className={`bg-gray-500 ${className} text-5xl md:text-4xl     w-full md:w-auto fixed md:static bottom-0 md:bottom-auto`} tooltip="">
            <div className="
                p-4 sticky top-0 space-x-6 flex justify-center items-center
                
                sm:space-x-20
                md:pt-10 md:space-x-0 md:space-y-2 md:block
            ">
                <NavButton tooltip="Discover" link={`/`}>
                    <ImCompass2 />
                </NavButton>
                {(session) && (<>
                    <NavButton tooltip="My Pantry" link={''} className="opacity-50">
                        <TbFridge />
                    </NavButton>
                    <NavButton tooltip="Create Dish" link={`/create-dish`}
                        button={
                            <button
                                onClick={() => { navigate(`/create-dish`) }}
                                disabled={location.pathname == '/create-dish'}
                                className="bg-gray-200 p-1 rounded-lg cursor-pointer
                                    disabled:opacity-50 disabled:cursor-default
                                ">
                                <CiSquarePlus />
                            </button>
                        }>
                    </NavButton>
                </>)}
                {session ?
                    (
                        <NavButton tooltip="Profile" link={`/${username}`}>
                            <IoPerson />
                        </NavButton>
                    ) : (
                        <NavButton tooltip="Log In / Sign Up" link={`/login`}>
                            <FaPersonCircleQuestion />
                        </NavButton>
                    )
                }
            </div>
        </div>
    )
};

export default Sidebar;