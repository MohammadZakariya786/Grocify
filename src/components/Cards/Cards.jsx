import React, { useRef } from 'react'
import { FaHeart, FaPlus } from 'react-icons/fa'
import Button from '../Button/Button'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)
const Cards = ({image,name,price}) => {
    const cardRef=useRef()
    useGSAP(()=>{
        gsap.from(cardRef.current,{
                opacity:0,
                y:100,
                scale:0.2,
                duration:1,
                ease:'power3.out',
                scrollTrigger:{
                    trigger:cardRef.current,
                    start:"top 120% ",
                    end:"bottom 90%",
                    // markers:true,
                    scrub:1,
                }
    })
},[])


  return (
    <div ref={cardRef} className="hover:shadow-xl gpu-boost p-5 bg-zinc-100 rounded-xl">
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
        <div className='w-full h-50'>
            <img src={image} className='w-full h-full mx-auto object-contain'/>
        </div>
        {/* card content */}
        <div className='text-center'>
            <h3 className='text-2xl font-semibold'>{name}</h3>
            <p className='text-2xl font-bold mt-4 mb-3'>{price}</p>
            <Button content="Shop Now"/>
        </div>
    </div>
  )
}

export default Cards