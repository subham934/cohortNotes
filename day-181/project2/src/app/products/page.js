import ProductCard from '@/components/ProductCard'
import React from 'react'

const page = async () => {

    let res = await fetch('https://fakestoreapi.com/products')
    let products = await res.json()
    console.log(products)

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {
            products.map(elem => (
                <ProductCard key={elem.id} product={elem} />
            ))
        }
    </div>
  )
}

export default page