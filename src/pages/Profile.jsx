import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import { useSupabase } from "../hook/useSupabase";
import { useSession } from "../hook/useSession";
import Tag from "../components/Tag";

const { supabase } = useSupabase();

const Profile = () => {

    const [profile, setProfile] = useState({});
    const [image, setImage] = useState('');
    const [dishName, setDishName] = useState('');
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
                .eq("username", username)
                .single();
            setProfile(data);
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
            
        }
        getAllIngredients();
    }, [])

    const getIngredientID = (name) => {
        const index = allIngredientNames.indexOf(name);
        return allIngredientIDs[index];
    };

    const verifyData = () => {
        if (!dishName.trim()) return false;
        if (!recipe.trim()) return false;
        if (!image) return false;
        if (ingredientIDs.length === 0) return false;
        return true;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!session) return;
        if (!verifyData()){
            alert("Make sure all fields are filled")
            return;
        };

        const fileName = `${session.user.id}/${Date.now()}-${image.name}`;
        //probably should make a check that everything is filled out

        //upload img to storage
        const { data, error:storageError } = await supabase.storage
            .from("dish-images")
            .upload(fileName, image);

        if (storageError) {
            console.error(storageError);
            return;
        }

        const { data: urlData } = supabase.storage
            .from("dish-images")
            .getPublicUrl(fileName);

        const img_url = urlData.publicUrl;

        //upload the user's dish
        const { data: dish, error: dishError } = await supabase.from("dish").insert({
            dish_name: dishName,
            recipe: recipe,
            img_url: img_url,
            creator_id: session.user.id,
        })
        .select()
        .single();

        if(dishError){

        }else{
            console.log("Dish Upload In Progress...");
        }

        const dishIngredients = ingredientIDs.map((ingredient_id) => ({
            dish_id: dish.dish_id,
            ingredient_id,
        }));
        
        const { data: dish_ingredients, error: dishIngredientsError } = await supabase
            .from("dish_ingredient")
            .insert(dishIngredients)
        .select();

        if(dishIngredientsError){

        }else{
            console.log("Dish Upload Complete!");
        }
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
        // console.log(ingredientNames);
        // console.log(ingredientIDs);
        
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
                <input type="file" required onChange={(e) => setImage(e.target?.files?.[0])}/>
                <input
                    type="text"
                    placeholder="dish name"
                    required
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="recipe"
                    required
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
                <p style={{ marginTop: '10px' }}>
                    <button>
                        post
                    </button>
                </p>
            </form>

            <div className="mt-10">
                <button onClick={handleLogout}>sign out</button>
            </div>
        </div>

    )
};

export default Profile;