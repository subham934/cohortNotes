import React from 'react'

const Course = (props) => {
  
  return (
    <div style={{background:'pink', padding: '20px', width:'fit-content', margin: '5px', borderRadius: '10px'}}>
      <h1>{props.courseData.courseName}</h1>
      <h2>{props.courseData.instructor}</h2>
      <h3>{props.courseData.mentor}</h3>
      <h4>{props.courseData.duration}</h4>
    </div>
  )
}

export default Course
