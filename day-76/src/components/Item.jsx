import React from 'react'

const Item = ({cardData}) => {
  // console.log(props.cardData.username);
  
  return (
    <div className='h-[300px] w-[300px] m-5 bg-white text-black rounded-2xl overflow-hidden'>
      <div className='h-[50%] w-[100%]'>
        <img src={cardData.profile} className='h-[100%] w-[100%] object-cover' alt="" />
      </div>
      <div className='h-[50%] w-100% m-[20px]'>
        <h2 className='text-[25px] '>{cardData.username}</h2>
        <h4 className='text-[12px] text-[#888] font-medium '>{cardData.email}</h4>
        <h3 className='text-[20px] text-[#579412] font-semibold mt-[30px]'>{cardData.role}</h3>
      </div>
    </div>
  )
}

export default Item
