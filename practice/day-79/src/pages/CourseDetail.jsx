import React from 'react'
import { useParams } from 'react-router-dom'

const CourseDetail = () => {

    const params = useParams()
  return (
    <div>
        <h1 className='text-[70px] underline font-bold fixed left-1/2 -translate-x-1/2 uppercase whitespace-nowrap'> CourseDetails {params.ID}  Page</h1>
    </div>
  )
}

export default CourseDetail