import React from "react";

const Sidebar = ({ className, onClick }) => {
    return (
        <div className="bg-green-200">
            <div className="mt-10 sticky top-0 space-y-2">
                <div className="bg-red-200 flex justify-center items-center">
                    Discover
                </div>
                <div className="bg-red-200 flex justify-center items-center">
                    <button 
                        onClick={
                            ()=>{onClick(true)}
                        }>
                            My Pantry
                    </button>
                </div>
                <div className="bg-red-200 flex justify-center items-center">
                    <button>Saved Dishes</button>
                </div>
                <div className="bg-red-200 flex justify-center items-center">
                    <button>My Profile</button>
                </div>
            </div>
        </div>
    )
};

export default Sidebar;