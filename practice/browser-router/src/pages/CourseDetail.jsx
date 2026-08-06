import React from "react";
import { useParams } from "react-router-dom";

const CourseDetail = () => {
  const pa = useParams();
  return (
    <div>
      <h1>CourseDetail {pa.courseId}</h1>
    </div>
  );
};

export default CourseDetail;
