import React from 'react'
import {assets} from '../assets/assets'

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row border border-gray-400'>

      {/* Hero Left Side */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0 px-5 sm:px-10'>
        <div className='text-[#414141]'>
          <div className='flex items-center gap-2'>
            <p className='w-8 md:w-11 h-0.5 bg-[#414141]'></p>
            <p className='font-medium text-sm md:text-base'>OUR BESTSELLERS</p>
          </div>
          <h1 className='prata-regular text-3xl sm:text-4xl lg:text-5xl leading-relaxed mt-3'>
            Latest Arrivals
          </h1>
          <div className='flex items-center gap-2 mt-3'>
            <p className='font-semibold text-sm md:text-base hover:underline cursor-pointer'>SHOP NOW</p>
            <p className='w-8 md:w-11 h-0.5 bg-[#414141]'></p>
          </div>
        </div>
      </div>

      {/* Hero Right Side */}
      <div className='w-full sm:w-1/2'>
        <img className='w-full h-auto object-cover' src={assets.hero_img} alt="Latest Arrivals" />
      </div>
    </div>
  )
}

export default Hero