import React, { memo, useEffect, useRef } from 'react'
import { FaHeart, FaPlus } from 'react-icons/fa'
import Button from '../Button/Button'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { useGSAP } from '@gsap/react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

gsap.registerPlugin(ScrollTrigger)
const Cards = ({image,name,price}) => {
    const cardRef=useRef()
    useGSAP(()=>{
        // scroll animation 
        gsap.from(cardRef.current,{
                opacity:0,
                y:100,
                scale:0.2,
                duration:1,
                ease:'power3.out',
                scrollTrigger:{
                    trigger:cardRef.current,
                    start:"top 130% ",
                    end:"bottom 100%",
                    // markers:true,
                    scrub:1,
                }
    })
},[])


  return (
    <div ref={cardRef} className="flex flex-col justify-between hover:shadow-xl gpu-boost p-5 bg-zinc-100 rounded-xl">
        {/* card icons */}
        <div className='flex justify-between'>
            <span className='text-3xl text-zinc-300'>
                <FaHeart/>
                </span>
            <button className='bg-gradient-to-b from-orange-400 to-orange-500 text-white text-xl py-3 px-4 rounded-lg'>
                <FaPlus/>
            </button>
        </div>
        {/* card image  */}
        <div className='md:w-full flex justify-center md:h-50 md:py-0 py-5'>
           <LazyLoadImage
          src={image}
          alt={name}
          effect="blur" // 👈 gives a blur placeholder
          placeholderSrc="/fallback.jpg" // 👈 optional fallback image
          className="w-50 h-50 md:h-50 md:w-full mx-auto object-contain"
        />
        </div>
        {/* card content */}
        <div className='text-center'>
            <h3 className='text-2xl font-semibold'>{name}</h3>
            <p className='text-2xl font-bold mt-4 mb-3'>{price}</p>
            <button className=' bg-gradient-to-b from-orange-400 to-orange-500 text-white px-5 py-2 rounded-lg
             text-lg  hover:scale-105 hover:to-orange-600 transition-all duration-300 cursor-pointer'>Shop Now</button>
        </div>
    </div>
  )
}

export default memo(Cards)