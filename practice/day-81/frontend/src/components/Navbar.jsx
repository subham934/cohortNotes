import React, {useState} from "react";

const Navbar = (props) => {
  const [newTheme, setNewTheme] = useState("");

  return (
    <div className="nav">
      <h1>Theme is {props.theme}</h1>
      
       
      <form
        onSubmit={(e) => {
          e.preventDefault();
          props.changeTheme(newTheme);
        }}
      >
        <input
          value={newTheme}
          type="text"
          placeholder="Enter Theme"
          onChange={(e) => setNewTheme(e.target.value)}
        />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default Navbar;
