import React from 'react'
import { useParams} from "react-router-dom"

const CourseDetail = () => {
    const params = useParams()

  return (
    <div className="absolute top-[50vh] left-[50vw] -translate-1/2">
      <h1 className="text-5xl bg-amber-300 px-5 py-2 rounded-2xl"> CourseDetail {params.courseId}</h1>
    </div>
  )
}

export default CourseDetail