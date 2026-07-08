import React, { useState, useEffect } from "react";
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import Sidebar from "../components/NavComponents/Sidebar";
import FreeHeightPanel from "../components/UIComponents/FreeHeightPanel";
import Post from "../components/DishPostComponents/Post";
import PopUp from "../components/UIComponents/PopUp";
import { useSupabase } from "../hook/useSupabase";
import { useSession } from "../hook/useSession";
import { IoIosSearch } from "react-icons/io";
import Tag from "../components/UIComponents/Tag";
import { offlineMode, mockDishesDisplayed, mockDish } from "../utils/config";


const Home = () => {
    const { supabase } = useSupabase();
    const { session, loading } = useSession();

    const [dish, setDish] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [username, setUsername] = useState([]);

    const [openPopup, setOpenPopup] = useState(false);
    const [searchFocus, setSearchFocus] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState('');
    const [searchIngredients, setSearchIngredients] = useState([]);

    const getIngredientID = (name) => {
        return ingredients.find(ingredient => ingredient.ingredient_name == name)?.ingredient_id;
    };

    useEffect(() => {
        async function getData() {
            const { data: DishData } = await supabase.from("dish").select("dish_id, dish_name, img_url, creator_id");
            const { data: IngredientData } = await supabase.from("ingredient").select("ingredient_name, ingredient_id");
            setDish(DishData);
            setIngredients(IngredientData);
        }
        getData();
    }, [])

    // console.log(dish);


    useEffect(() => {
        async function getData() {
            if (searchIngredients?.length == 0) {
                const { data: DishData } = await supabase.from("dish").select("dish_id, dish_name, img_url, creator_id");
                setDish(DishData);
            } else {
                const ingredientIds = searchIngredients.map(ingredient => ingredient.id);
                const { data: filteredDishData } = await supabase
                    .from("dish_with_ingredients")
                    .select("dish_id, dish_name, img_url, creator_id")
                    .contains("ingredient_ids", ingredientIds);
                setDish(filteredDishData);
            }
        }
        getData();
    }, [searchIngredients])


    useEffect(() => {
        if (!session?.user?.id) return;
        async function getUsername() {
            const { data } = await supabase
                .from("public_profile")
                .select("username")
                .eq("id", session?.user.id)
                .single();
            setUsername(data?.username);
        }
        getUsername();
    }, [session])

    useEffect(() => {
        if (!session?.user?.id) return;
        // console.log(session.user.email);
    }, [session])

    useEffect(() => {
        // console.log(ingredients,"Sdf");
        // console.log(ingredients.map(ingredient=>ingredient.ingredient_name), "Ds");
        // console.log(ingredients.filter(ingredient=>ingredient.ingredient_name=='egg')[0], "Ds");
        // console.log(getIngredientID('beans'));

    }, [ingredients])

    const handleAddIngredient = () => {
        const target = selectedIngredient.trim();
        if (target == "") return;
        if (!ingredients.map(ingredient => ingredient.ingredient_name).includes(target)) {
            setSelectedIngredient("");
            return;
        };
        const targetID = getIngredientID(target);


        setSearchIngredients((prev) =>
            prev.includes(target)
                ? prev
                : [...prev, { id: targetID, name: target }]
        );
        setSelectedIngredient('');
    };

    const handleRemoveIngredient = (ingredientToRemove) => {
        setSearchIngredients(
            searchIngredients.filter(
                (ingredient) => ingredient.name != ingredientToRemove
            )
        );
    };


    const RenderTags = () => {
        return (<>
            {searchIngredients.map((ingredient, index) => (
                <Tag key={index} name={ingredient.name} onRemove={handleRemoveIngredient} />
            ))}
        </>);
    };

    return (
        <div className="">
            {/* <div className="fixed inset-0 flex items-center justify-center z-999 pointer-events-none">
                <PopUp open={openPopup} setOpen={setOpenPopup}>
                    test
                </PopUp>
            </div> */}
            <div className="h-screen grid grid-cols-8">
                <Sidebar onClick={setOpenPopup} session={session} username={username} />
                <div className="bg-blue-200 col-span-7 p-2">
                    <section className="p-5">
                        <div className={`flex p-1 bg-white focus-within:bg-gray-200 rounded-xl`}>
                            <input list="search-ingredient" className="w-full outline-none" type="text" placeholder="Search by Ingredient"
                                value={selectedIngredient} onChange={e => setSelectedIngredient(e.target.value)}
                            />
                            <datalist id="search-ingredient" placeholder="Search Ingredients...">
                                {ingredients && ingredients.map((ingredient, index) => (
                                    <option key={index} value={ingredient.ingredient_name} />
                                ))}
                            </datalist>
                            <button className="hover:bg-yellow-500 hover:text-blue-500 m-1 text-3xl rounded-xl" onClick={handleAddIngredient}><IoIosSearch /></button>
                        </div>
                        {searchIngredients &&
                            <div className="flex flex-wrap gap-4 py-4">
                                <RenderTags />
                            </div>
                        }
                    </section>
                    <FreeHeightPanel cols={5}>
                        {offlineMode ?  (
                            Array.from({ length:mockDishesDisplayed }, (_, index) => (
                                <Post key={index}
                                    details={mockDish}/>
                            ))
                        ) : (
                            dish.map((dish, index) => (
                                <Post key={index}
                                    details={dish}
                                />
                            )))
                        }
                    </FreeHeightPanel>
                </div>
            </div>
        </div>
    );
};

export default Home;