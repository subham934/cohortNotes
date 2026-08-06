import React from "react";
import { Outlet, useParams } from "react-router-dom";

const AnyCourse = () => {

    const params = useParams()
    console.log(params.ID);

  return (
    <div>
      <h1 className="text-5xl font-bold underline rounded-2xl fixed left-[50vw] top-[63vh] -translate-1/2 bg-amber-300 px-7 py-5">
        AnyCourse {params.ID}
      </h1>
      <Outlet/>
    </div>
  );
};

export default AnyCourse;
