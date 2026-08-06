import React, { useContext } from 'react'
import { recipeContext } from "../context/RecipeContext" 

const Recipes = () => {
  const { data } = useContext(recipeContext)
  
  const renderrecipes = data.map((recipe) => (
    <div key={recipe.id}>
      <h1>{recipe.title}</h1>
    </div>
  ));

  return (
    <div>
      {renderrecipes}
    </div>
  )
}

export default Recipes