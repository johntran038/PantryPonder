import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSupabase } from "../hook/useSupabase";
import { useNavigate } from "react-router-dom"


const Dish = () => {

    const { supabase } = useSupabase();

    const navigate = useNavigate();

    const [dish, setDish] = useState({});

    const { id } = useParams();

    // console.log(id, "dsf");
    console.log(dish);


    useEffect(() => {
        async function getData() {
            const { data, error } = await supabase
                .from("dish_with_ingredients")
                .select('*')
                .eq("dish_id", id)
                .single();
            setDish(data);
        }
        getData();
    }, [])

    // console.log("Dish:", dish);

    // console.log("??", typeof dish.ingredients, dish.ingredients);


    return (
        <div className="h-screen bg-blue-200 p-5">
            <h1 className="mb-5 text-lg">
                <button onClick={() => { navigate(`/`) }}>
                    Back to Home
                </button>
            </h1>
            <div className="min-w-[50%] w-fit">
            <img className="h-60" src={dish.img_url} alt={`Image of ${dish?.dish_name || "Dish"}`} />
            <section className="outline-1">Dish: {dish?.dish_name || ''}</section>
            {/* <li>Recipe: {dish?.recipe || ''}</li> */}
            <section className="outline-1 ">
                <span>
                    Ingredients:&nbsp;
                </span>
                {(dish && dish?.ingredients) &&
                    dish.ingredients.map((ingredient, index) =>
                        ingredient +
                        (index < dish.ingredients.length - 1 ? ", " : "")
                    )
                }
            </section>
            <section className="outline-1">
                <label htmlFor="recipe">Recipe:</label>
                <textarea id="recipe" className="w-full resize-none select-none" disabled value={dish?.recipe} />
            </section>
            </div>
        </div>
    )
};

export default Dish;