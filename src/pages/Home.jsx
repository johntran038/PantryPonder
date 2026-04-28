import React, { useState, useEffect } from "react";
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import Sidebar from "../components/Sidebar";
import FreeHeightPanel from "../components/FreeHeightPanel";
import Post from "../components/Post";
import PopUp from "../components/PopUp";
import { useSupabase } from "../hook/useSupabase";
import { useSession } from "../hook/useSession";


const Home = () => {
    const { supabase } = useSupabase();
    const { session, loading } = useSession();

    const [dish, setDish] = useState([]);
    const [username, setUsername] = useState([]);

    const [openPopup, setOpenPopup] = useState(false);

    useEffect(() => {
        async function getDish() {
            const { data } = await supabase.from("dish").select("dish_id, dish_name, img_url");
            setDish(data);
        }
        getDish();
    }, [])

    useEffect(() => {
        if (!session?.user?.id) return;
        async function getUsername() {
            const { data } = await supabase
                .from("profile")
                .select("username")
                .eq("id", session?.user.id)
                .single();
            setUsername(data?.username);
        }
        getUsername();
    }, [session])

    useEffect(() => {
        if (!session?.user?.id) return;
        console.log(session.user.email);
    }, [session])

    useEffect(() => {
        // console.log(dish);
    }, [dish])

    return (
        <div className="">
            <div className="fixed inset-0 flex items-center justify-center z-999 pointer-events-none">
                <PopUp open={openPopup} setOpen={setOpenPopup}>
                    test
                </PopUp>
            </div>
            <div className="h-screen grid grid-cols-8">
                <Sidebar onClick={setOpenPopup} session={session} username={username} />
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