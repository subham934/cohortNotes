import { useForm } from "react-hook-form";
import { nanoid } from "nanoid";
import { useContext } from "react";
import { recipeContext } from "../context/RecipeContext";
const Create = () => {
  const { data, setdata } = useContext(recipeContext);
  const { register, handleSubmit, reset } = useForm();

  const submitHandler = (recipe) => {
    recipe.id = nanoid();
    // console.log(recipe);

    // const copydata = [...data];
    // copydata.push(recipe);
    // setdata(copydata);
    // or
    setdata([...data, recipe]);

    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="flex items-center justify-center flex-col gap-y-3 py-5 px-15 border-2 border-rose-400 rounded-3xl w-fit mx-auto">
      <input
        className="w-[500px] block border-b outline-0 p-2 "
        {...register("image")}
        type="url"
        placeholder="Enter Image URL"
      />
      <small className="text-red-300 self-start font-normal">This is how the error is shown</small>

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

        <option value="cat-1">Starters </option>
        <option value="cat-2">Main Courses</option>
        <option value="cat-3">Desserts</option>
      </select>

      <button
        type="submit"
        className="block mt-5 bg-gray-900 px-4 py-2 rounded-2xl text-white font-semibold cursor-pointer active:scale-95 active:bg-amber-700 transition-all duration-200 ease-in-out"
      >
        Save Recipe
      </button>
    </form>
  );
};

export default Create;
