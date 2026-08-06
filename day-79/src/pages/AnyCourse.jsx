import React from 'react'
import { useParams } from 'react-router-dom'

const AnyCourse = () => {

    const params = useParams()
    console.log(params.ID);
    
  return (
    <div>
       <h1 className='text-5xl uppercase font-bold underline rounded-2xl fixed  left-[50vw] -translate-x-1/2 bg-amber-300 whitespace-nowrap px-7 py-5'>{params.ID} COURSE PAGE</h1>
    </div>
  )
}

export default AnyCourse
