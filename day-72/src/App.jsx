import React from "react";
import Navbar from "./components/Navbar";
import Men from "./components/Men";
import Women from "./components/Women";

const App = () => {
  const user1 = {
    name: "Harshit",
    age: 30,
    gender: "male",
  };

  const user2 = {
    name: "Parul",
    age: 23,
    gender: "female",
  };

  const user3 = {
    name: "Bixi",
    age: 8,
    gender: "male",
  };

  function btnClicked() {
    console.log("Button is Clicked!\n");
  }

  return (
    <div>
      <Navbar
        title={"Sheryians"}
        links={["Home", "About", "Account", "Contact"]}
      />

      {/* <Navbar
        title={"Masai"}
        links={["Home", "About", "Account", "Assignments", "Projects"]}
      /> */}
      {user1.gender === "male" ? <Men /> : <Women />}
      {user2.gender === "female" ? <Women /> : <Men />}
      {user3.gender === "male" ? (
        user3.age > 10 ? (
          <Men />
        ) : (
          <Women />
        )
      ) : (
        <Women />
      )}

      <button
        className="active:scale-95 bg-emerald-400 text-white py-3 px-6 rounded font-bold my-2"
        onClick={btnClicked}
        // onClick={() => btnClicked()}
      >
        Click to Download
      </button>
    </div>
  );
};

export default App;
