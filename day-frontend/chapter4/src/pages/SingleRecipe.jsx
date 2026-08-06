import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { recipeContext } from "../context/RecipeContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const SingleRecipe = () => {
  const { data, setdata } = useContext(recipeContext);
  const params = useParams();
  const navigate = useNavigate();
  const recipe = data.find((recipe) => params.id == recipe.id);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: recipe?.title,
      description: recipe?.description,
      chef: recipe?.chef,
      image: recipe?.image,
      category: recipe?.category,
      ingredients: recipe?.ingredients,
      instructions: recipe?.instructions,
    },
  });

  const updateHandler = (recipe) => {
    const index = data.findIndex((rolex) => params.id == rolex.id);
    // console.log(index);
    const copydata = [...data];
    copydata[index] = { ...copydata[index], ...recipe };
    setdata(copydata);
    localStorage.setItem("recipes", JSON.stringify(copydata));
    toast.success("Recipe updated!!");
    // navigate("/recipes");
  };

  const deleteHandler = () => {
    const conf = confirm("Are you sure you want to delete this item?");
    if (conf) {
      const filterdata = data.filter((item) => item.id != params.id);
      setdata(filterdata);
      localStorage.setItem("recipes", JSON.stringify(filterdata));

      navigate("/recipes");
      toast.success("Recipe deleted!!");
    } else {
      alert("element not deleted");
      toast.error("Recipe not deleted!!");
    }
  };

  // const favorite = ;

  const [favorite, setFavorite] = useState(
    JSON.parse(localStorage.getItem("favorite")) || [],
  );

  const FavHandler = () => {
    let copyFavorite = [...favorite];
    copyFavorite.push(recipe);
    setFavorite(copyFavorite);
    localStorage.setItem("favorite", JSON.stringify(copyFavorite));
    toast.success("Recipe added to favorite");
  };

  const UnFavHandler = () => {
    const filterFavorite = favorite.filter((item) => item.id != recipe.id);
    setFavorite(filterFavorite);
    localStorage.setItem("favorite", JSON.stringify(filterFavorite));
    toast.success("Recipe removed from favorite");
  };

  // useEffect(() => {
  //   // ye tab chalta hai jab component MOUNT hota hai
  //   console.log("SingleRecipe.jsx Mounted");

  //   // ye tab chalta hai jab component UNMOUNT hota hai
  //   return () => {
  //     console.log("SingleRecipe.jsx Unmounted");
  //   };
  // }, [favorite]);

  return recipe ? (
    <div className="flex justify-between items-start gap-32 mt-15">
      <div className="left w-1/2 p-2 flex flex-col gap-5.5 items-start">
        <div className="flex items-start mb-7">
          <h1 className="text-5xl font-black">{recipe.title}</h1>
          <div className="relative cursor-pointer">
            {favorite.find((fav) => fav.id == recipe?.id) ? (
              <i
                onClick={UnFavHandler}
                className="absolute text-7xl text-red-500 ri-poker-hearts-fill"
              ></i>
            ) : (
              <i
                onClick={FavHandler}
                className="absolute text-7xl text-red-500 ri-poker-hearts-line"
              ></i>
            )}
          </div>
        </div>

        <div className="flex items-start justify-between gap-5.5">
          <img
            className="h-[40vh] border-4 border-rose-400 rounded-2xl"
            src={recipe.image}
            alt=""
          />

          <div className="flex flex-col gap-5.5">
            <p className="font-semibold items-start">{recipe.description}</p>
            <small className="text-red-400 font-extrabold">{recipe.chef}</small>
          </div>
        </div>

        <div className="flex items-start justify-between gap-8">
          <div>{recipe.ingredients}</div>
          <div>{recipe.instructions}</div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(updateHandler)}
        className="w-1/2 p-2 flex items-center justify-center flex-col gap-y-3 py-5 px-15 border-2 border-rose-400 rounded-2xl w-fit mx-auto"
      >
        <input
          className="w-[500px] block border-b outline-0 p-2 "
          {...register("image")}
          type="url"
          placeholder="Enter Image URL"
        />
        <small className="text-red-300 self-start font-normal">
          This is how the error is shown
        </small>

        <input
          className="w-[500px] block border-b outline-0 p-2 "
          {...register("title")}
          type="text"
          placeholder="Recipe Title"
        />

        <input
          className="w-[500px] block border-b outline-0 p-2 "
          {...register("chef")}
          type="text"
          placeholder="Chef's Name"
        />

        <textarea
          className="block w-[500px] border-b outline-0 p-2 "
          {...register("description")}
          placeholder="Recipe Description..."
        ></textarea>

        <textarea
          className="block w-[500px] border-b outline-0 p-2 "
          {...register("ingredients")}
          placeholder="Write ingredients separated by commas..."
        ></textarea>

        <textarea
          className="block w-[500px] border-b outline-0 p-2 "
          {...register("instructions")}
          placeholder="Write cooking instructions..."
        ></textarea>

        <select
          className="block w-[500px] border-b outline-0 p-2 bg-gray-800"
          {...register("category")}
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="supper">Supper</option>
          <option value="dinner">Dinner</option>
        </select>

        <div className="flex items-center gap-5">
          <button
            type="submit"
            className="block mt-5 bg-blue-900 px-4 py-2 rounded-2xl text-white font-semibold cursor-pointer active:scale-95 active:bg-emerald-700 transition-all duration-200 ease-in-out"
          >
            Update Recipe
          </button>

          <button
            type="button"
            onClick={deleteHandler}
            className="block mt-5 bg-red-900 px-4 py-2 rounded-2xl text-white font-semibold cursor-pointer active:scale-95 active:bg-rose-700 transition-all duration-200 ease-in-out"
          >
            Delete Recipe
          </button>
        </div>
      </form>
    </div>
  ) : (
    "Loading..."
  );
};

export default SingleRecipe;
