import React from 'react'
import AllCourses from './AllCourses'

const Section2 = (props) => {

  console.log('section2', props.courseData);
  
  return (
    <div>
      <h1>Section2</h1>
      <AllCourses courseData={props.courseData}/>
    </div>
  )
}

export default Section2
