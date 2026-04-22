import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

const Dish = () => {

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

    console.log(dish);
    


    return (
        <div className="h-screen bg-blue-200">
            <li>
                <ul>Dish: {dish?.dish_name ||''}</ul>
                <ul>Recipe: {dish.recipe || ''}</ul>
                <ul>Ingredients: {dish.ingredients || ''}</ul>
            </li>
        </div>
    )
};

export default Dish;