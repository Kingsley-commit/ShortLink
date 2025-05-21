import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../assets/Layer_1.svg'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="relative">
      <div className="flex px-4 sm:px-8 md:px-16 lg:px-[4rem] justify-between items-center border-black bg-white py-4">
        <Link to='/home'>
          <div className='flex items-center'>
            <img src={Logo} alt="ShortLink Logo" />
            <h1 className="text-2xl font-bold text-[#002395]">ShortLink</h1>
          </div>
        </Link>

        <div className="hidden lg:flex gap-9">
          <motion.button
            className="border-2 border-white px-6 p-2 rounded-2xl text-[#002395] text-base hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to='/signup'>Sign Up</Link>
          </motion.button>
          <motion.button
            className="text-[#002395] px-6 p-2 rounded-2xl text-base hover:shadow-lg transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to='/login'>Sign In</Link>
          </motion.button>
        </div>

        <button 
          className="lg:hidden flex flex-col justify-center items-center gap-1.5" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-[#002395] transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-[#002395] transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-[#002395] transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      <div className={`absolute w-full bg-white shadow-md py-4 px-6 transition-all duration-300 z-50 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible h-0'}`}>
        <div className="flex flex-col gap-4">
          <motion.button
            className="border-2 border-white px-6 py-2 rounded-2xl text-[#002395] text-base hover:bg-white/10 transition-colors w-full text-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsMenuOpen(false)}
          >
            <Link to='/signup' className="block w-full">Sign Up</Link>
          </motion.button>
          <motion.button
            className="text-[#002395] px-6 py-2 rounded-2xl text-base hover:shadow-lg transition-shadow w-full text-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsMenuOpen(false)}
          >
            <Link to='/login' className="block w-full">Sign In</Link>
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;