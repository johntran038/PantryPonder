import React from "react";

const Post = ({ className, details }) => {

    // const {dishName, image, ingredients, recipe} = details;

    //this is just to test it out
    const heightList = [40, 32, 60, 12, 72, 48, 28, 64];
    const colorList = ['bg-red-500', 'bg-blue-500', 'bg-green-500']
    const randomHeightIndex = Math.floor(Math.random() * heightList.length);

    const getRandomData = (list) => {
        const randomIndex = Math.floor(Math.random() * list.length);
        return list[randomIndex];
    };

    return (
        <div className={`${className} ${getRandomData(colorList)} h-${getRandomData(heightList)}`}>
            post
        </div>
    )
};

export default Post;