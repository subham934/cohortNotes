import React from "react";
import Course from "./Course";

const AllCourses = (props) => {
  return (
    <div>
      AllCourses
      <Course courseData={props.courseData} />
      {/* <Course />
      <Course />
      <Course /> */}
    </div>
  );
};

export default AllCourses;
