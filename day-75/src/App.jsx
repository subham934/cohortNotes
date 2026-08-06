import { useState } from "react";
import Card from "./components/Card";

const App = () => {
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [userDesc, setUserDesc] = useState("");

  const [allUsers, setAllUsers] = useState([]);

  const submitHandler = (e) => {
    e.preventDefault();

    const oldUsers = [...allUsers];
    oldUsers.push({ username, userRole, userDesc, imageURL });

    setAllUsers(oldUsers);
    console.log(oldUsers);

    setUsername("");
    setUserRole("");
    setImageURL("");
    setUserDesc("");
  };

  const deleteHandler = (_, idx) => {
    const copyUser = [...allUsers];
    copyUser.splice(idx, 1);
    setAllUsers(copyUser);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <form
        className="p-2 flex flex-wrap justify-center "
        onSubmit={submitHandler}
      >
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border-2 px-5 py-2 rounded text-xl font-semibold m-2 w-[45%]"
          type="text"
          placeholder="Enter Name"
        />
        <input
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
          className="border-2 px-5 py-2 rounded text-xl font-semibold m-2 w-[45%]"
          type="text"
          placeholder="Image URL"
        />
        <input
          value={userRole}
          onChange={(e) => setUserRole(e.target.value)}
          className="border-2 px-5 py-2 rounded text-xl font-semibold m-2 w-[45%]"
          type="text"
          placeholder="Enter Role"
        />
        <input
          value={userDesc}
          onChange={(e) => setUserDesc(e.target.value)}
          className="border-2 px-5 py-2 rounded text-xl font-semibold m-2 w-[45%]"
          type="text"
          placeholder="Enter Description"
        />
        <button className="px-5 py-2 bg-emerald-500 rounded active:scale-95 text-xl font-semibold m-2 w-[90%] transition-all duration-[200ms] ease-[ease]">
          Create User
        </button>
      </form>

      <div className="py-10 px-4 flex flex-wrap gap-5">
        {allUsers.map((elem, idx) => {
          return (
            <Card
              username={elem.username}
              role={elem.userRole}
              desc={elem.userDesc}
              img={elem.imageURL}
              key={idx}
              onClick={(e) => deleteHandler(e, idx)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default App;
