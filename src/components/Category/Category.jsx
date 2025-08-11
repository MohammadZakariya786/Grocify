import React, { useRef } from 'react'
import fruitsandveggies from "../../assets/fruits-and-veggies.webp"
import dairyandeggs from "../../assets/dairy-and-eggs.webp"
import meatandseafood from "../../assets/meat-and-seafood.webp"
import Heading from '../Heading/Heading'
import { Link } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/all'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)
const Category = () => {

    const container=useRef()
    const title=useRef()

    useGSAP(()=>{
        const cards=gsap.utils.toArray(".container-card")

        cards.forEach((card,i)=>{

            gsap.from(card,{
                opacity:0,
                y:100,
                scale:0.2,
                duration:1,
                ease:'back.inOut',
                scrollTrigger:{
                    trigger:card,
                    start:"top 140% ",
                    end:"bottom 90%",
                    // markers:true,
                    scrub:2,
                }
            })
        })
        },{scope:container})
        
    const categoryCard=category.map(card=>{
        return (
            //card
            <div className='flex-1 basis-[300px] hover:drop-shadow-2xl container-card gpu-boost' key={card.id}>
                {/*cardimage*/}
                <div className='w-full min-h-[30vh] relative -mb-10'>
                    <img src={card.image}  className='absolute bottom-0' />
                </div>
                {/*cardContent*/}
                <div className='bg-zinc-100 pt-17 p-8 rounded-xl'>
                    <h3 className='text-zinc-800 font-bold text-3xl'>{card.title}</h3>
                    <p className='mt-3 mb-9 text-zinc-600'>{card.description}</p>
                    <Link to={card.path}  className='bg-gradient-to-b from-orange-400 to-orange-500 text-white px-8 py-3 rounded-lg text-lg hover:scale-105 hover:to-orange-600 transition-all duration-300 cursor-pointer'>See All</Link>
                </div>
            </div>

        )
    })
  return (
    <section>
          <div ref={container} className='py-20 max-w-[1400px] mx-auto px-10'>
              <Heading ref={title} highlight="Shop" heading="by Category" />
              {/*category card rendering*/}
              <div className='flex flex-wrap gap-1 md:gap-10 md:mt-15 -mt-10'>
                  {categoryCard}
              </div>
          </div>

    </section>
  )
}

export default Category

const category=[
    {
        id:1,
        title:"Fruits and Veggies",
        description:"Fresh,Organic produce sourced daily from local farms. Explore a wide range  of seasonal fruits and crisp vegetables.",
        image:fruitsandveggies,
        path:"/fruits"
    },
    {
        id:3,
        title:"Dairy and Eggs",
        description:"Wholesome Dairy products and free-range eggs.from creamy milk and yoghurt to artisanal cheeses",
        image:dairyandeggs,
        path:"/dairy"
    },
    {
        id:2,
        title:"Meat and Seafood",
        description:"High Quality, responsibly sourced meat and seafood. Choose from fresh cuts,marinated options and more.",
        image:meatandseafood,
        path:"/seafood"
    }
    
]