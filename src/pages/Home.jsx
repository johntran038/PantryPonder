import React, { useState } from "react";
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import Sidebar from "../components/Sidebar";
import FreeHeightPanel from "../components/FreeHeightPanel";
import Post from "../components/Post";
import PopUp from "../components/PopUp";

const Home = () => {
    
    
    const [openPopup, setOpenPopup] = useState(false);

    return (
        <div className="">
            <div className="fixed inset-0 flex items-center justify-center z-999 pointer-events-none">
                <PopUp open={openPopup} setOpen={setOpenPopup}/>
            </div>
            <div className="h-screen grid grid-cols-8">
                <Sidebar onClick={setOpenPopup}/>
                <div className="bg-blue-200 col-span-7 p-2">
                    <FreeHeightPanel cols={5}>
                        <Post className="h-40 bg-red-500" />
                        <Post className="h-32 bg-red-500" />
                        <Post className="h-60 bg-red-500">3</Post>
                        <Post className="h-12 bg-blue-500">4</Post>
                        <Post className="h-72 bg-blue-500">5</Post>
                        <Post className="h-48 bg-blue-500">6</Post>
                        <Post className="h-28 bg-green-500"></Post>
                        <Post className="h-40 bg-green-500"></Post>
                        <Post className="h-64 bg-green-500"></Post>

                        
                        <Post className="h-40 bg-red-500" />
                        <Post className="h-32 bg-red-500" />
                        <Post className="h-60 bg-red-500">3</Post>
                        <Post className="h-12 bg-blue-500">4</Post>
                        <Post className="h-72 bg-blue-500">5</Post>
                        <Post className="h-48 bg-blue-500">6</Post>
                        <Post className="h-28 bg-green-500"></Post>
                        <Post className="h-40 bg-green-500"></Post>
                        <Post className="h-64 bg-green-500"></Post>
                        <Post className="h-40 bg-red-500" />
                        <Post className="h-32 bg-red-500" />
                        <Post className="h-60 bg-red-500">3</Post>
                        <Post className="h-12 bg-blue-500">4</Post>
                        <Post className="h-72 bg-blue-500">5</Post>
                        <Post className="h-48 bg-blue-500">6</Post>
                        <Post className="h-28 bg-green-500"></Post>
                        <Post className="h-40 bg-green-500"></Post>
                        <Post className="h-64 bg-green-500"></Post>
                        <Post className="h-40 bg-red-500" />
                        <Post className="h-32 bg-red-500" />
                        <Post className="h-60 bg-red-500">3</Post>
                        <Post className="h-12 bg-blue-500">4</Post>
                        <Post className="h-72 bg-blue-500">5</Post>
                        <Post className="h-48 bg-blue-500">6</Post>
                        <Post className="h-28 bg-green-500"></Post>
                        <Post className="h-40 bg-green-500"></Post>
                        <Post className="h-64 bg-green-500"></Post>
                    </FreeHeightPanel>
                </div>
            </div>
        </div>
    );
};

export default Home;