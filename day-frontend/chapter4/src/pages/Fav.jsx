import React from "react";
import RecipeCard from "../components/RecipeCard";
const Fav = () => {
  const favorite = JSON.parse(localStorage.getItem("favorite") || []);

  const renderFavorite = favorite.map((recipe) => (
    <RecipeCard recipe={recipe} key={recipe.id} />
  ));
  return (
    <div>
      <div className="flex flex-wrap">
        {favorite.length > 0 ? renderFavorite : "No recipes found"}
      </div>
    </div>
  );
};

export default Fav;
