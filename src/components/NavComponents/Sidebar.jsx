import React from "react";
import { useNavigate, useLocation } from "react-router-dom";


const Sidebar = ({ className, onClick, session, username }) => {

    const navigate = useNavigate();

    const location = useLocation();

    return (
        <div className="bg-gray-500">
            <div className="mt-10 sticky top-0 space-y-2">
                <div className="flex justify-center items-center">
                    <button className="bg-gray-200 p-1 rounded-lg" onClick={() => { navigate(`/`) }}>
                        Discover
                    </button>
                </div>
                {/* <div className="flex justify-center items-center">
                    <button className="bg-gray-200 p-1 rounded-lg" 
                        onClick={
                            ()=>{onClick(true)}
                        }>
                            My Pantry
                    </button>
                </div> */}
                {/* <div className="flex justify-center items-center">
                    <button className="bg-gray-200 p-1 rounded-lg">Saved Dishes</button>
                </div> */}
                {session ?
                    (
                        <div className="flex justify-center items-center">
                            <button className="bg-gray-200 p-1 rounded-lg" onClick={() => { navigate(`/${username}`) }}>
                                My Profile
                            </button>
                        </div>
                    ):(
                        <div className="flex justify-center items-center">
                            <button className="bg-gray-200 p-1 rounded-lg" onClick={() => { navigate("/login") }}>
                                Login
                            </button>
                        </div>
                    )
                }
                {(session && location.pathname != '/create-dish') && (
                    <div className="flex justify-center items-center">
                        <button className="bg-gray-200 p-1 rounded-lg" onClick={() => { navigate(`/create-dish`) }}>
                            Create A Dish
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
};

export default Sidebar;