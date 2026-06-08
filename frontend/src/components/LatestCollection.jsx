
import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const LatestCollection = () => {

    const {products} = useContext(ShopContext)
    // console.log(products)
    const [latestProducts, setLatestProducts] = useState([])

    useEffect(()=>{
        setLatestProducts(products.slice(0,10));
    },[products])

  return (
    <div className='my-10'>
            <div className='text-center py-8 text-3xl'>
                <Title text1={'LATEST'} text2={'COLLECTIONS'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, possimus provident!
                </p>
            </div>
          {/* Rendering Products  */}
     <div className='grid grid-col-2 sm:grid-col-3 md:grid-cols-4 lg:grid-col-5 gap-4 gap-y-6'>
        {
            latestProducts.map((item)=>(
                <ProductItem key={item._id} _id={item._id} image={item.image} name={item.name} price={item.price}/>
            ))
        }

     </div>
        </div>
  )
}

export default LatestCollection