import React from "react";

const Card = () => {
  const age = 18;
  const user = "Rajesh";
  const arr = [10, 20, 30, 40];
  const users = ["A", "B", "C"];

  return (
    <div>
      <h1>{age}</h1>
      <p>{user}</p>
      {arr.map((elem, id) => {
        return <p key={id}>{elem}</p>;
      })}

      <ul>
        {users
          .filter((user) => user !== "B")
          .map((user) => {
            return <p key={user}>{user}</p>;
          })}
      </ul>
    </div>
  );
};

export default Card;