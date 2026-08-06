import React from "react";
import { Link } from "react-router-dom";
const RecipeCard = (props) => {
  const { id, image, title, description, chef } = props.recipe;
  return (
    <>
      <Link
        className="hover:scale-105 duration-300 mr-5 mb-3 block w-[23vw] rounded-2xl overflow-hidden shadow-md"
        to={`/recipes/details/${id}`}
      >
        <img
          src={image}
          className="w-full h-[40vh] object-center object-cover"
          alt=""
        />
        <h1 className="mt-2 font-black px-2">{title}</h1>
        <small className="px-2 text-red-400">{chef}</small>
        <p className="px-2 pb-3">
          {description.slice(0, 100)}... <small>more</small>
        </p>
      </Link>
    </>
  );
};

export default RecipeCard;
