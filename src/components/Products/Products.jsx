import React, { useRef, useState } from 'react'
import Heading from '../Heading/Heading'
import ProductList from '../../components/ProductList/ProductList'
import Cards from '../Cards/Cards'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/all'

gsap.registerPlugin(ScrollTrigger)

const Products = () => {
    const containerRef=useRef() // this line is for gsap

    useGSAP(()=>{
        gsap.from(".category-btn",{
            opacity:0,
            y:50,
            duration:1,
            stagger:0.3,
            ease:'power1.out',
            scrollTrigger:{
                trigger:".category-btn",
                start:"top 80%",
                end:"bottom 70%",
                // markers:true,
                scrub:2
            }
        })
    },{scope:containerRef})




    const  categories=["All","Fruits","Vegetables","Dairy","Meat & Seafood"]
    const [activeTab, setactiveTab] = useState("All");

    let filteredItems=activeTab==='All'? ProductList:ProductList.filter(item=>item.category===activeTab);
    const renderCards=filteredItems.slice(0,8).map(product=>{
        return(
            <Cards key={product.id} image={product.image} name={product.name} price={product.price}/>
        )
    })
  return (
    <section>
    <div ref={containerRef} className='max-w-[1400px] mx-auto px-10 py-20'>
        <Heading highlight="Our" heading="Products"/>
        {/*tabs*/}
        <div className='flex flex-wrap gap-3 justify-center mt-10'>
            {categories.map(category=>{
                return (
                    <button  key={category} className={`category-btn px-5 py-2 text-lg cursor-grab rounded-lg ${activeTab===category?"bg-gradient-to-b from-orange-400 to-orange-500 text-white":"bg-zinc-100"} `} onClick={()=>setactiveTab(category)}>
                        {category}
                    </button>
                )
            })}
        </div>
        {/* product listing */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-9 mt-20'>
            {renderCards}
        </div>
        <div className='mt-15 mx-auto w-fit'>
            <Link to="/allproducts" className='bg-gradient-to-b from-orange-400 to-orange-500 text-white px-8 py-3 rounded-lg text-lg hover:scale-105 hover:to-orange-600 transition-all duration-300 cursor-pointer'>View All</Link>
        </div>
        </div>
    </section>
  )
}

export default Products