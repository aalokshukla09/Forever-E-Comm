import React from 'react'
import {assets} from '../assets/assets'

const Footer = () => {
  return (
    <div className='bg-white text-black py-1'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-10 text-sm px-5 sm:px-20'>
        <div>
          <img src={assets.logo} className='mb-5 w-32 bg-white' alt="" />
          <p className='w-full md:w-2/3 text-black'>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa sequi, earum laborum alias fuga repellendus.
          </p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-black'>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-black'>
            <li>+91-9876543210</li>
            <li>forever@gmail.com</li>
          </ul>
        </div>
        {/* Copyright Section */}
      <div className='col-span-full text-center'>
        <hr className='border-black w-1/2 mx-auto' />
        <p className='py-5 text-sm text-center text-black'>
          © 2026 - All Rights Reserved - Designed by Aalok Shukla
        </p>
      </div>
    </div>
    </div>
  )
}

export default Footer