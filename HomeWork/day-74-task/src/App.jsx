import React, { useState, useEffect } from "react";

const App = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [allUsers, setAllUsers] = useState(() => {
    const saved = localStorage.getItem("allUsers");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("allUsers", JSON.stringify(allUsers));
  }, [allUsers]);

  const submitHandler = (e) => {
    e.preventDefault();

    const newAllUsers = [...allUsers, { username, email, number }];
    setAllUsers(newAllUsers);

    // console.log(newAllUsers);
    setUsername("");
    setEmail("");
    setNumber("");
  };

  const deleteUser = (index) => {
    const updatedUsers = allUsers.filter((_, i) => i !== index);
    setAllUsers(updatedUsers);
  };

  return (
    <>
      <div className="container">
        <div className="left">
          <form onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="Enter Name"
              id="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <input
              type="email"
              placeholder="Enter Email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              type="number"
              placeholder="Enter Your Number"
              value={number}
              onChange={(e) => {
                setNumber(e.target.value);
              }}
              id="number"
            />
            <button type="submit">Submit</button>
          </form>
        </div>
        <div className="right">
          {allUsers.map((props, id) => {
            return (
              <div className="contact" key={id}>
                <div className="phone">
                  <h3 className="name">{props.username}</h3>
                  <h6>{props.email}</h6>
                </div>
                <div className="number">
                  <h2>{props.number}</h2>
                  <button onClick={() => deleteUser(id)}>
                    <i className="ri-close-large-fill"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default App;
