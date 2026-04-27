import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSupabase } from "../hook/useSupaBase";

const { supabase } = useSupabase();

const Profile = () => {

    const [profile, setProfile] = useState({});

    const { username } = useParams();

    useEffect(() => {
        async function getProfile() {
            const { data, error } = await supabase
                .from("profile")
                .select('*')
                .eq("username", username);
            setProfile(data[0]);
            console.log(error);
        }
        getProfile();
    }, [])

    console.log(profile);
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(false)
    }

    const [image, setImage] = useState('')
    const [recipe, setRecipe] = useState('')
    const [ingredients, setIngredients] = useState('')

    return (
        <div className="h-screen bg-blue-200">

            <form onSubmit={handleSubmit}>
                <input type="file" required/>
                <input
                    type="text"
                    placeholder="recipe"
                    value={recipe}
                    onChange={(e) => setRecipe(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="ingredients"
                    value={recipe}
                    required
                    onChange={(e) => setRecipe(e.target.value)}
                />
            </form>

            <p style={{ marginTop: '10px' }}>
                <button>
                    post
                </button>
            </p>
        </div>
    )
};

export default Profile;