import React from "react";
import { useNavigate } from "react-router-dom";

const Post = ({ className, details={} }) => {

    const navigate = useNavigate();

    const {dish_id, dish_name, img_url, ingredients, recipe} = details;

    //this is just to test it out
    const heightList = ["h-40", "h-32", "h-60", "h-12", "h-72", "h-48", "h-28", "h-64"];
    const colorList = ['bg-red-500', 'bg-blue-500', 'bg-green-500']
    const randomHeightIndex = Math.floor(Math.random() * heightList.length);

    const getRandomData = (list) => {
        const randomIndex = Math.floor(Math.random() * list.length);
        return list[randomIndex];
    };
    

    return (
        // <div className={`${className} ${getRandomData(colorList)} ${getRandomData(heightList)}`}
        <div className={`${className} bg-purple-300`}
            onClick={()=>{navigate(`/dish/${dish_id}`)}}
        >
            <img src={img_url} alt="" />
            {dish_name || "post"}
        </div>
    )
};

export default Post;