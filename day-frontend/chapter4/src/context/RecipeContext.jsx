import React, { useState, createContext, useEffect } from "react";

export const recipeContext = createContext();

const RecipeContext = (props) => {
  const [data, setdata] = useState([]);

  useEffect(() => {
    setdata(JSON.parse(localStorage.getItem("recipes")) || []);
  }, []);
  
  return (
    <recipeContext.Provider value={{ data, setdata }}>
      {props.children}
    </recipeContext.Provider>
  );
};

export default RecipeContext;







// {
//       id: 1,
//       title: "Classic Margherita Pizza",
//       description:
//         "A timeless Italian classic made with fresh mozzarella, ripe tomatoes, and fragrant basil on a crispy golden crust. Simple, delicious, and perfect for any occasion.",
//       ingredients: [
//         "Pizza dough",
//         "Tomato sauce",
//         "Fresh mozzarella cheese",
//         "Fresh basil leaves",
//         "Olive oil",
//         "Salt and pepper to taste",
//       ],
//       instructions: [
//         "Preheat the oven to 475°F (245°C).",
//         "Roll out the pizza dough and spread tomato sauce evenly.",
//         "Top with slices of fresh mozzarella and fresh basil leaves.",
//         "Drizzle with olive oil and season with salt and pepper.",
//         "Bake in the preheated oven for 12-15 minutes or until the crust is golden brown.",
//         "Slice and serve hot.",
//       ],
//       userId: 166,
//       image: "https://cdn.dummyjson.com/recipe-images/1.webp",
//       chef: "Sanjeev kapoor",
//       category: "dinner",
//     },
//     {
//       id: 2,
//       title: "Vegetarian Stir-Fry",
//       description:
//         "A healthy and flavorful Asian-style vegetarian stir-fry made with golden-brown tofu and a colorful mix of fresh vegetables like broccoli, carrots, and bell peppers. Tossed in a savory soy sauce blend with aromatic garlic and ginger, and finished with a touch of sesame oil, this dish is light, nutritious, and perfect for a quick lunch or dinner served over warm rice.",
//       ingredients: [
//         "Tofu, cubed",
//         "Broccoli florets",
//         "Carrots, sliced",
//         "Bell peppers, sliced",
//         "Soy sauce",
//         "Ginger, minced",
//         "Garlic, minced",
//         "Sesame oil",
//         "Cooked rice for serving",
//       ],
//       instructions: [
//         "In a wok, heat sesame oil over medium-high heat.",
//         "Add minced ginger and garlic, sauté until fragrant.",
//         "Add cubed tofu and stir-fry until golden brown.",
//         "Add broccoli, carrots, and bell peppers. Cook until vegetables are tender-crisp.",
//         "Pour soy sauce over the stir-fry and toss to combine.",
//         "Serve over cooked rice.",
//       ],
//       prepTimeMinutes: 15,
//       cookTimeMinutes: 20,
//       servings: 3,
//       difficulty: "Medium",
//       cuisine: "Asian",
//       caloriesPerServing: 250,
//       tags: ["Vegetarian", "Stir-fry", "Asian"],
//       userId: 143,
//       image: "https://cdn.dummyjson.com/recipe-images/2.webp",
//       chef: "Subham Dhar",

//       category: "lunch",
//     },
