"use client";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import BackGround from "../assets/Group7.svg";
import Logo from "../assets/Link.svg";

 function NotFound() {
  return (
    <div 
      className="min-h-screen flex flex-col" 
      style={{ 
        backgroundImage: `url(${BackGround})`, 
        backgroundRepeat: "no-repeat", 
        backgroundSize: 'cover', 
        fontFamily: "Montserrat"
      }}
    >
      
      <nav className="relative">
        <div className="flex px-4 sm:px-8 md:px-16 lg:px-[4rem] justify-between items-center border-black bg-white py-4">
          <Link to='/home'>
            <div className='flex items-center'>
              <img src={Logo} alt="ShortLink Logo" />
              <h1 className="text-2xl font-bold text-[#002395]">ShortLink</h1>
            </div>
          </Link>

          <div className="flex gap-4">
            <motion.button
              className="border-2 border-[#002395] px-6 py-2 rounded-2xl text-[#002395] text-base hover:bg-[#002395] hover:text-white transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to='/home'>Go Home</Link>
            </motion.button>
          </div>
        </div>
      </nav>

      
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 md:px-16">
        <motion.div 
          className="text-center text-white max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
         
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-bold text-white/90 leading-none">
              404
            </h1>
          </motion.div>

          
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Page Not Found
            </h2>
            <p className="text-lg sm:text-xl text-white/80 max-w-lg mx-auto">
              Oops! The page you're looking for doesn't exist.  you might have entered the wrong URL.
            </p>
          </motion.div>

         
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            
            <motion.button
              className="border-2 border-white text-white hover:bg-white hover:text-[#002395] px-8 py-3 rounded-2xl text-lg font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
            >
              Go Back
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      
      <div className="h-[3rem]"></div>
    </div>
  );
}

export default NotFound