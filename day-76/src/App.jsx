import React, { useState } from "react";
import Card from "./components/Card";
import Item from "./components/Item";

const App = () => {
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [userDesc, setUserDesc] = useState("");

  const localData = JSON.parse(localStorage.getItem("all-users")) || [];

  const [allUsers, setAllUsers] = useState(localData);

  // console.log(localData);

  const submitHandler = (e) => {
    e.preventDefault();

    const oldUsers = [...allUsers];
    oldUsers.push({ username, userRole, userDesc, imageURL });

    setAllUsers(oldUsers);
    localStorage.setItem("all-users", JSON.stringify(oldUsers));

    setUsername("");
    setUserRole("");
    setImageURL("");
    setUserDesc("");
  };

  const deleteHandler = (_, idx) => {
    const copyUser = [...allUsers];

    const conf = confirm("Are you sure you want to delete this item?");

    if (conf) {
      copyUser.splice(idx, 1);
    } else {
      alert("element not deleted");
    }

    setAllUsers(copyUser);
    localStorage.setItem("all-users", JSON.stringify(copyUser));
  };

 const cardData1 = {
    username:'Anubhav',
    role:'Engineer',
    email:'anu@gmail.com',
    profile:'https://images.unsplash.com/photo-1761934797418-f8670e41268a?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
  const cardData2 = {
    username:'Danish',
    role:'Mentor',
    email:'danish@gmail.com',
    profile:'https://plus.unsplash.com/premium_photo-1766746551190-2f186c2f2360?q=80&w=850&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }

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

      <Item cardData={cardData1} />
      <Item cardData={cardData2} />
    </div>
  );
};

export default App;
