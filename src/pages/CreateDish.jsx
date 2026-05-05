import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import { useSupabase } from "../hook/useSupabase";
import { useSession } from "../hook/useSession";
import Sidebar from "../components/NavComponents/Sidebar";
import Tag from "../components/UIComponents/Tag";
import PopUp from "../components/UIComponents/PopUp";
import { LuHardDriveUpload } from "react-icons/lu";

const { supabase } = useSupabase();

const CreateDish = () => {

    const [username, setUsername] = useState('');

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
        async function getData() {
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
        getData();
    }, [])

    const getIngredientID = (name) => {
        const index = allIngredientNames.indexOf(name);
        return allIngredientIDs[index];
    };

    const verifyData = () => {
        if (!dishName.trim()) return false;
        if (!recipe.trim()) return false;
        if (!image) return false;
        if (selectedIngredient != '') return false;
        if (ingredientIDs.length === 0) return false;
        return true;
    };


    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!session) return;
        if (!verifyData()) {
            if (selectedIngredient != '') {
                alert(`Please press "Add Tag" to add "${selectedIngredient}"`);
            } else {
                alert("Make sure all fields are filled");
            }
            return;
        };

        const fileName = `${session.user.id}/${Date.now()}-${image.name}`;

        //upload img to storage
        const { data, error: storageError } = await supabase.storage
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

        if (dishError) {
            console.log(dishError);
        } else {
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

        if (dishIngredientsError) {
            console.log(dishIngredientsError);
        } else {
            console.log("Dish Upload Complete!");
        }
    }

    const handleAddIngredient = () => {
        const target = selectedIngredient.trim();
        if (target == "") return;
        if (!allIngredientNames.includes(target)) {
            alert(`The ingredient "${target}" is not found in the database`);
            setSelectedIngredient("");
            return;
        };
        setIngredientNames((prev) =>
            prev.includes(target)
                ? prev
                : [...prev, target]
        );
        const selectedID = getIngredientID(target)
        setIngredientIDs((prev) =>
            prev.includes(selectedID)
                ? prev
                : [...prev, selectedID]
        );
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

    useEffect(() => {
        if (!image) return;
        // console.log(URL.createObjectURL(image));

    }, [image]);

    // useEffect(() => {
    //     if (selectedIngredient != "") {
    //         handleAddIngredient();
    //     }
    // }, [selectedIngredient]);

    const RenderTags = () => {
        return (<>
            {ingredientNames.map((ingredient, index) => (
                <Tag key={index} name={ingredient} onRemove={handleRemoveIngredient} />
            ))}
        </>);
    };

    return (
        <div className="h-screen bg-blue-200 grid grid-cols-8">
            <Sidebar session={session} username={username} />
            <form onSubmit={handleSubmit} className="space-y-2 pt-1 col-span-6">

                <div className="grid grid-cols-2 space-x-4">

                    <section className="col-span-full flex items-center p-5">
                        <h1 className="text-lg">Create A Dish</h1>
                        <button type="submit" className="ml-auto bg-gray-200 outline-1 outline-gray-400 text-lg p-2 rounded-lg">
                            Post Dish
                        </button>
                    </section>
                    <section className="flex mx-4 select-none">
                        <label htmlFor="img" className="rounded-3xl h-fit ml-auto cursor-pointer outline-1 outline-gray-400 group relative">
                            {image
                                ? <img className="w-90 rounded-3xl" src={URL.createObjectURL(image)} alt={image?.name || ""} />
                                :
                                <div className="bg-gray-200 h-120 w-90 rounded-3xl flex flex-col justify-center items-center">
                                    <LuHardDriveUpload className="group-hover:z-999 group-hover:text-neutral-300" />
                                    <div className="group-hover:z-999 group-hover:text-neutral-300">Choose file to upload</div>
                                </div>
                            }
                            <div className="absolute inset-0 opacity-0 hover:opacity-100
                                rounded-3xl flex flex-col justify-between items-center 
                                bg-linear-to-b from-neutral-600 text-neutral-300
                                "
                            >
                                <div className="flex items-center h-full z-10">
                                    {image &&
                                        <div className="flex flex-col justify-center items-center">
                                            <LuHardDriveUpload />
                                            <div className="">Upload New File</div>
                                        </div>
                                    }
                                </div>
                                <div className="px-5 mb-5 text-center z-10">
                                    File can be .png, .jpg, .jpeg, or .webp and must be less than 5MB
                                </div>
                                <div className="absolute inset-0 bg-neutral-900 rounded-3xl z-1 opacity-50"></div>
                            </div>

                        </label>
                        <input
                            className="display-none hidden"
                            id="img"
                            type="file"
                            name="img"
                            accept="image/png, image/jpeg, image/webp, image/jpg"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (e.target?.files[0]?.size > 5 * 1024 * 1024) {
                                    alert("The file size must not exceed 5 MB");
                                    e.target.value = "";
                                    return;
                                }
                                setImage(e.target?.files?.[0]);
                            }}
                        />
                    </section>
                    <section className="space-y-4 mx-4">
                        <div className="bg-white outline-1 outline-gray-400 p-2 rounded-xl">
                            <label htmlFor="dish-name" className="block text-sm text-gray-700">Dish Name</label>
                            <input
                                className="outline-none"
                                id="dish-name"
                                type="text"
                                placeholder="Enter Dish Name"
                                required
                                value={dishName}
                                onChange={(e) => setDishName(e.target.value)}
                            />
                        </div>
                        <div className="bg-white outline-1 outline-gray-400 py-4 px-2 rounded-xl">
                            <label htmlFor="recipe" className="block text-sm text-gray-700 mb-2">Recipe</label>
                            <textarea
                                className="w-full min-h-25 max-h-45 outline-none block resize-none overflow-x-auto overflow-y-auto whitespace-nowrap"
                                id="recipe"
                                type="textarea"
                                placeholder="Enter Recipe"
                                required
                                value={recipe}
                                onChange={(e) => {
                                    setRecipe(e.target.value);
                                    e.target.style.height = "auto";
                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                }}
                            />
                        </div>
                        <div className="bg-white outline-1 outline-gray-400 py-4 px-2 rounded-xl">
                            <label htmlFor="dish-name" className="block text-sm text-gray-700">Ingredients ({ingredientNames.length})</label>
                            <div className="flex">
                                <input
                                    type="text"
                                    list="ingredient-list"
                                    id="ingredients"
                                    value={selectedIngredient}
                                    placeholder="Add Ingredient"
                                    className="outline-none bg-white outline-1 outline-gray-400 px-1 flex-grow"
                                    onChange={(e) => {
                                        setSelectedIngredient(e.target.value);
                                    }}
                                    onBlur={
                                        () => {
                                            // setTimeout(() => {
                                            //     if(selectedIngredient.trim() != ""){
                                            //         if(confirm(`You forgot to add "${selectedIngredient}" into your ingredient list. Do you want to add it?`)){
                                            //             handleAddIngredient();
                                            //         }else{
                                            //             setSelectedIngredient("");
                                            //         }
                                            //     }
                                            // }, 2000)
                                        }
                                    }
                                // onKeyUp={(e) => {
                                //     if (!(e instanceof KeyboardEvent)) return;
                                //     console.log("keyup", e.target.value);
                                // }}
                                // onSelect={
                                //     (e) => {
                                // console.log(e.nativeEvent);
                                // console.log(e.nativeEvent instanceof Event);

                                // const event = e.nativeEvent
                                // if(event instanceof MouseEvent && event.type == 'keyup'){
                                //     console.log("I bet you clicked into it");
                                // }
                                // if(event instanceof KeyboardEvent && event.type == 'keyup'){
                                //     console.log("I bet you typed");
                                // }
                                // if(event instanceof KeyboardEvent && event.type == 'keyup'){
                                //     console.log("I bet you typed");
                                // }
                                //         }
                                //     }
                                />
                                <datalist name="ingredient-list" id="ingredient-list">
                                    {(allIngredientIDs && allIngredientNames) &&
                                        allIngredientNames.map((data, index) =>
                                            <option key={index} value={data} />
                                        )
                                    }
                                </datalist>
                                <button type="button" className="ml-2 px-1 bg-white outline-1 outline-gray-400"
                                    onClick={handleAddIngredient}
                                >
                                    Add Tag
                                </button>
                            </div></div>
                        <div className="flex flex-wrap gap-4">
                            <RenderTags />
                        </div>
                    </section>
                </div>
            </form>
        </div>

    )
};

export default CreateDish;