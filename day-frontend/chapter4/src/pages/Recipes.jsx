import React, { useContext } from "react";
import { recipeContext } from "../context/RecipeContext";
import RecipeCard from "../components/RecipeCard";

const Recipes = () => {
  const { data } = useContext(recipeContext);

  const renderrecipes = data.map((recipe) => (
    <RecipeCard recipe={recipe} key={recipe.id} />
  ));

  return <div className="flex flex-wrap">{data.length > 0 ? renderrecipes : "No recipes found"}</div>;
};

export default Recipes;
