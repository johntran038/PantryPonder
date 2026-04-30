import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSupabase } from "../hook/useSupabase";
import { useNavigate } from "react-router-dom"


const Dish = () => {

    const { supabase } = useSupabase();

    const navigate = useNavigate();

    const [dish, setDish] = useState({});

    const { id } = useParams();

    console.log(id, "dsf");


    useEffect(() => {
        async function getDish() {
            // const { data } = await supabase.from("Dish").select("*").eq("dish_id", id);
            const { data, error } = await supabase
                .from("dish_with_ingredients")
                .select('*')
                .eq("dish_id", id)
                .single();
            setDish(data);
        }
        getDish();
    }, [])

    // console.log("Dish:", dish);

    // console.log("??", typeof dish.ingredients, dish.ingredients);


    return (
        <div className="h-screen bg-blue-200">
            <h1 className="mb-5 text-lg">
                <button onClick={() => { navigate(`/`) }}>
                    Back to Home
                </button>
            </h1>
            <ul>
                <li>Dish: {dish?.dish_name || ''}</li>
                {/* <li>Recipe: {dish?.recipe || ''}</li> */}
                <li>Ingredients:
                    {(dish && dish?.ingredients) &&
                        dish.ingredients.map((ingredient, key) => {

                            return <div key={key}>
                                {ingredient}
                            </div>
                        })
                    }
                </li>
            </ul>
            <label htmlFor="recipe">Recipe:</label>
            <textarea id="recipe" className="w-full" value={dish?.recipe} />
        </div>
    )
};

export default Dish;