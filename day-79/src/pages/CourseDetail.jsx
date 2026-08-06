import React from 'react'
import { useParams } from 'react-router-dom'

const CourseDetail = () => {

    const params = useParams()

  return (
    <div>

        {/* since this page is appearing after AnyCourse page, we can use params */}

       <h1 className='text-5xl font-bold underline rounded-2xl fixed  left-[50vw] uppercase -translate-x-1/2 bg-amber-300 whitespace-nowrap px-7 py-5'>{params.ID} Course Detail PAGE</h1>
    </div>
  )
}

export default CourseDetail
