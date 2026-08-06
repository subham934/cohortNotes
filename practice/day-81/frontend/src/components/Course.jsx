import React from "react";

const Course = (props) => {
  return (
    <div>
        <b><i>Course</i></b>
      
      <h3>{props.courseData.courseName}</h3>
      <p>Price: ${props.courseData.price}</p>
      <p>Instructor: {props.courseData.instructor}</p>
      <p>Duration: {props.courseData.duration}</p>
    </div>
  );
};

export default Course;
