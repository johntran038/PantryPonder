import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import { useSupabase } from "../hook/useSupaBase";
import { useSession } from "../hook/useSession";
import Tag from "../components/Tag";

const { supabase } = useSupabase();

const Profile = () => {

    const [profile, setProfile] = useState({});
    const [image, setImage] = useState('');
    const [recipe, setRecipe] = useState('');
    const [ingredientNames, setIngredientNames] = useState([]);
    const [ingredientIDs, setIngredientIDs] = useState([]);

    const [selectedIngredient, setSelectedIngredient] = useState('');
    const [allIngredientNames, setAllIngredientNames] = useState([]);
    const [allIngredientIDs, setAllIngredientIDs] = useState([]);



    const navigate = useNavigate();

    const { session, error } = useSession();

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

    
    useEffect(() => {
        async function getAllIngredients() {
            const { data, error } = await supabase
                .from("ingredient")
                .select('*');

            setAllIngredientNames(
                data.map((ingredient) => 
                    ingredient.ingredient_name
                )
            );
            setAllIngredientIDs(
                    data.map((ingredient) => {
                    return ingredient.ingredient_id
                })
            );

            console.log(data.map((ingredient) => 
                    ingredient.ingredient_name
                ));
            console.log(data.map((ingredient) => 
                    ingredient.ingredient_id
                ));
            
        }
        getAllIngredients();
    }, [])

    const getIngredientID = (name) => {
        const index = allIngredientNames.indexOf(name);
        return allIngredientIDs[index];
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

    }

    const handleAddIngredient = () => {
        if(!allIngredientNames.includes(selectedIngredient)) return;
        setIngredientNames((prev)=> 
            prev.includes(selectedIngredient)
            ? prev
            : [...prev, selectedIngredient]
        )
        const selectedID = getIngredientID(selectedIngredient)
        setIngredientIDs((prev)=> 
            prev.includes(selectedID)
            ? prev
            : [...prev, selectedID]
        )
        setSelectedIngredient('');
    };

    const handleRemoveIngredient = (ingredientToRemove) => {
        
        setIngredientNames(
            ingredientNames.filter(
                (ingredient) => ingredient != ingredientToRemove
            )
        );
        const idToRemove = getIngredientID(ingredientToRemove)
        setIngredientIDs(
            ingredientIDs.filter(
                (ingredient) => ingredient != idToRemove
            )
        );
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();

        if (!error) {
            navigate("/");
        } else {
            console.log("Logout error:", error);
        }
    }

    useEffect(()=>{
        console.log(ingredientNames);
        console.log(ingredientIDs);
        
    }, [ingredientIDs, ingredientNames]);

    const RenderTags = () => {

        return (<>
            {ingredientNames.map((ingredient, index)=>(
                <Tag key={index} name={ingredient} onRemove={handleRemoveIngredient}/>
            ))}
        </>);
    };

    return (
        <div className="h-screen bg-blue-200">
            <form onSubmit={handleSubmit} className="space-y-2">
                <input type="file" required />
                <input
                    type="text"
                    placeholder="recipe"
                    value={recipe}
                    onChange={(e) => setRecipe(e.target.value)}
                />
                <section>
                    <label htmlFor="ingredients" className="mr-2">Add ingredients:</label>
                     <input
                        type="text"
                        list="ingredient-list"
                        id="ingredients"
                        value={selectedIngredient}
                        className="outline-none bg-white px-1"
                        onChange={(e) => setSelectedIngredient(e.target.value)}
                    />
                    <datalist name="ingredient-list" id="ingredient-list">
                        {(allIngredientIDs && allIngredientNames) &&
                            allIngredientNames.map((data, index)=>
                                <option key={index} value={data}/>
                            )
                        }
                    </datalist>
                    <button type="button" className="ml-2 px-1 bg-gray-400"
                        onClick={handleAddIngredient}
                    >
                        Add Tag
                    </button>
                </section>
                <section>
                    <RenderTags/>
                </section>
            </form>

            <p style={{ marginTop: '10px' }}>
                <button>
                    post
                </button>
            </p>
            <div className="mt-10">
                <button onClick={handleLogout}>sign out</button>
            </div>
        </div>

    )
};

export default Profile;