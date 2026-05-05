import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import { useSupabase } from "../hook/useSupabase";
import { useSession } from "../hook/useSession";
import Tag from "../components/UIComponents/Tag";
import Sidebar from "../components/NavComponents/Sidebar";


const Profile = () => {
    const { supabase } = useSupabase();

    const [profile, setProfile] = useState({});

    const navigate = useNavigate();

    const { session, error } = useSession();

    const { username } = useParams();


    useEffect(() => {
        if (!username) return;
        async function getData() {
            const { data, error } = await supabase
                .from("public_profile")
                .select(`
                    *,
                    personal:profile(*)
                `)
                .eq("username", username)
                .single();

            if(error){
                console.log(error);
                return;
            }
            
            setProfile(data);
        }
        getData();
    }, [username])
    

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();

        if (!error) {
            navigate("/");
        } else {
            console.log("Logout error:", error);
        }
    }

    console.log(session);


    return (
        <div className="h-screen bg-blue-200  grid grid-cols-8">
            <Sidebar session={session} username={username} />
            {/* <h1 className="mb-5 text-lg">
                <button onClick={() => { navigate(`/`) }}>
                    Back to Home
                </button>
            </h1> */}
            <div className="col-span-7">
            {session &&
                <div className="p-4">
                    {profile &&
                        <ul>
                            <li>Username: {profile?.username || ''}</li>
                            <li>Display Name: {profile?.display_name || ''}</li>
                            <li>Email: {profile?.personal?.email || ''}</li>
                        </ul>
                    }
                    <button className="mt-20 hover:bg-red-500 hover:text-white p-1 rounded-lg underline" onClick={handleLogout}>Sign Out</button>
                </div>
            }
            </div>
        </div>

    )
};

export default Profile;