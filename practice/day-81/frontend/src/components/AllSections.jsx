import React from 'react'
import Section1 from './Section1'
import Section2 from './Section2'

const AllSections = (props) => {
    console.log(props.courseData);
    
  return (
    <div>
        AllSections
        <Section1/>
        <Section2 courseData={props.courseData}/>
    </div>
  )
}

export default AllSections