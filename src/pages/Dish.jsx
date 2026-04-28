import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSupabase } from "../hook/useSupabase";


const Dish = () => {

    const { supabase } = useSupabase();

    const [dish, setDish] = useState({});

    const { id } = useParams();

    console.log(id, "dsf");


    useEffect(() => {
        async function getDish() {
            // const { data } = await supabase.from("Dish").select("*").eq("dish_id", id);
            const { data, error } = await supabase
                .from("dish_with_ingredients")
                .select('*')
                .eq("dish_id", id);
            setDish(data[0]);
        }
        getDish();
    }, [])

    // console.log("Dish:", dish);

    // console.log("??", typeof dish.ingredients, dish.ingredients);
    

    return (
        <div className="h-screen bg-blue-200">
            <li>
                <ul>Dish: {dish?.dish_name || ''}</ul>
                <ul>Recipe: {dish?.recipe || ''}</ul>
                <ul>Ingredients:
                {(dish && dish?.ingredients) && 
                        dish.ingredients.map((ingredient, key) => {

                            return <div key={key}>
                                {ingredient}
                            </div>
                        })
                    }
                </ul>
            </li>
        </div>
    )
};

export default Dish;