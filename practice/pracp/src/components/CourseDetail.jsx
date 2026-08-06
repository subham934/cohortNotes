import React from 'react'
import { useParams } from 'react-router-dom'

const CourseDetail = () => {
    const params = useParams()
  return (
    <div>
        <h1 className='text-5xl font-bold underline rounded-2xl fixed left-[50vw] top-[30vh] -translate-1/2 bg-amber-300 px-7 py-5'>CourseDetail {params.ID}</h1>
    </div>
  )
}

export default CourseDetail