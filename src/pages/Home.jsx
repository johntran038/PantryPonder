import React, { useState, useEffect } from "react";
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import Sidebar from "../components/Sidebar";
import FreeHeightPanel from "../components/FreeHeightPanel";
import Post from "../components/Post";
import PopUp from "../components/PopUp";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

const Home = () => {

    const [dish, setDish] = useState([]);

    const [openPopup, setOpenPopup] = useState(false);

    useEffect(() => {
        async function getDish() {
            const { data } = await supabase.from("dish").select("*");
            setDish(data);
        }
        getDish();
    }, [])

    useEffect(() => {
        console.log(dish);
    }, [dish])

    return (
        <div className="">
            <div className="fixed inset-0 flex items-center justify-center z-999 pointer-events-none">
                <PopUp open={openPopup} setOpen={setOpenPopup}>
                    test
                </PopUp>
            </div>
            <div className="h-screen grid grid-cols-8">
                <Sidebar onClick={setOpenPopup} />
                <div className="bg-blue-200 col-span-7 p-2">
                    <FreeHeightPanel cols={5}>
                        {dish.map((dish, index) => (
                            <Post key={index}
                                details={dish}
                            />
                        ))}
                    </FreeHeightPanel>
                </div>
            </div>
        </div>
    );
};

export default Home;