import React from "react";
import { Outlet, useParams } from "react-router-dom";

const AnyCourse = () => {
  const param = useParams();
  return (
    <div>
      <h1>AnyCourse {param.courseId}</h1>
      <Outlet />
    </div>
  );
};

export default AnyCourse;

