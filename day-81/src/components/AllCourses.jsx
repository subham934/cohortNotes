import React from "react";
import Course from "./Course";

const AllCourses = (props) => {

  
  
  return (
    <div>
      <h1>AllCourses</h1>
      <Course courseData={props.courseData} />
      <Course courseData={props.courseData} />
      <Course courseData={props.courseData} />
    </div>
  );
};

export default AllCourses;
