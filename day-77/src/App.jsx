import React from "react";
import axios from "axios";
import { useState } from "react";
import User from "./User";
import { useEffect } from "react";

const App = () => {
  const [allData, setAllData] = useState([]);

  const getData = async () => {
    // const response = await axios.get('https://picsum.photos/v2/list?page=2&limit=100')

    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users/",
    );

    // const res = await axios.get('https://fakestoreapi.com/products/')

    setAllData(response.data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="all-cards">
        {allData.map((elem, idx) => {
          return (
            <div key={elem.id}>
              <User elem={elem} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
