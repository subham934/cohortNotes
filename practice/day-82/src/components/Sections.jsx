import React, { useContext } from "react";
import { UserDataContext } from "../context/UserContext";



const Sections = (props) => {

    const user = useContext(UserDataContext);

  return (
    <div className="h-[90vh] bg-zinc-800">
      <h1 className="text-2xl">Sections</h1>
        <h1>{props.brand}</h1>
        <p>Welcome, {user}!</p>
        {props.children}
    </div>
  );
};

export default Sections;
