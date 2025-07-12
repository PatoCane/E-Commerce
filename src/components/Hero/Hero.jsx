import React from 'react'
import Personaje from "../assets/Personaje.png"
import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png"
import {motion} from "framer-motion"
import { slipeUp,slipeInFromSide } from '../../utiliti/animation'

const Hero = () => {
  return (
    <section className='mt-36'>

      <div className='grid grid-cols-1 md:grid-cols-2'>

       <div className='p-10 sm:p-10 md:p-15 lg:p-30 xl:p-36'>
          <motion.img
          src={Logo} alt=' Logo del La Tiendita'
          variants={slipeUp(0.2)}
          initial="initial"
          animate="animate"
          /> 
          <motion.p
          className='py-8 text-white text-3xl'
          variants={slipeUp(0.3)}
          initial="initial"
          animate="animate"
          >
             <b> " Encontra en nuestra tienda las mejores bebidas para disfrutar 
                 con Amigos!"</b>
          </motion.p>
          <motion.div 
          className='flex justify-center gap-4'
          variants={slipeUp(1)}
          initial="initial"
          animate="animate"
          >
            <Link to="/login"  className='bg-red-600 py-2 px-12 rounded-2xl text-white hover:bg-black-700 
                          transition-all duration-300 items-center cursor-pointer'>
              Ingresar 
              <i className="bi bi-shop text-xl ml-2"></i>
            </Link>
            
            <Link to="/store" className='text-white flex items-center cursor-pointer'>
              Ver productos
              <i className="bi bi-youtube text-xl ml-2"></i>
            </Link>
          </motion.div>
        </div>
        {/* imagen */}
        <motion.div 
        className='p-10 sm:p-10 md:p-15 lg:p-30 xl:p-36'
        variants={slipeInFromSide("right",0.5)}
        initial="initial"
        animate="animate"
          >
          <img src={Personaje} alt='Productos de ventas' />
        </motion.div>

      </div>
    </section>
  )
}

export default Hero
