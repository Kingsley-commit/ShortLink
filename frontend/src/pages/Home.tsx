"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardIcon, CheckIcon } from "lucide-react";
import { useShortener } from "../hooks/useShortner";
import { shortenUrl } from "../services/api"; 
import Image from "../assets/Layer_1.svg";
import BackGround from "../assets/Group7.png";
import Logo from "../assets/Link.svg";
import { Link } from "react-router-dom";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { successMessage, errorMessage } = useShortener(() => {});

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    if (!validateUrl(url)) {
      setError("Please enter a valid URL (include http:// or https://)");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await shortenUrl(url.trim(), "");

      if (result?.shortUrl) {
        setShortUrl(result.shortUrl);
        setShowResult(true);
      } else {
        setError("Failed to get shortened URL");
      }
    } catch (err) {
      console.error("Shortening error:", err);
      setError(err instanceof Error ? err.message : "Failed to shorten URL");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <div 
      className="min-h-screen" 
      style={{ 
        backgroundImage: `url(${BackGround})`, 
        backgroundRepeat: "no-repeat", 
        backgroundSize: 'cover', 
        fontFamily: "Montserrat"
      }}
    >
      <nav className="relative">
      <div className="flex px-4  sm:px-8 md:px-16 lg:px-[4rem] justify-between items-center border-black bg-white py-4">
        <Link to='/home'>
          <div className='flex items-center'>
            <img src={Logo} alt="ShortLink Logo" />
            <h1 className="text-2xl font-bold text-[#012945]">ShortLink</h1>
          </div>
        </Link>

        <div className="hidden lg:flex gap-9">
          <motion.button
            className="border-2 border-white px-6 p-2 rounded-2xl text-[#002395] text-base hover:bg-white/10 transition-colors font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to='/signup'>Sign Up</Link>
          </motion.button>
          <motion.button
            className="text-[#002395] px-6 p-2 rounded-2xl text-base hover:shadow-lg transition-shadow font-medium"
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
            <Link to='/signup' className="block w-full text-[#012945]">Sign Up</Link>
          </motion.button>
          <motion.button
            className="text-[#002395] px-6 py-2 rounded-2xl text-base hover:shadow-lg transition-shadow w-full text-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsMenuOpen(false)}
          >
            <Link to='/login' className="block w-full text-[#012945]">Sign In</Link>
          </motion.button>
        </div>
      </div>
    </nav>

      <motion.div 
        className="flex  items-center lg:justify-around flex-col-reverse lg:flex-row p-10 md:0 md:justify-center "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="lg:self-start w-[90%]">
          <motion.div 
            className="md:pt-[7rem] pt-[3rem] text-white flex flex-col items-center lg:block"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold lg:w-full text-[#C9F31D]">Smart Secure & Dynamic</h1>
            <p className="text-lg sm:text-xl md:text-2xl pt-4 w-full sm:w-[34rem]">Welcome to Shortlink, the smart, secure, and dynamic solution for shortening your links.</p>

            <motion.div 
              className="w-full max-w-md mx-auto sm:mx-4 mt-[3rem]"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div 
                className="bg-[#FEFEFE]/20 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl border border-white/20"
                whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6">
                  URL Shortener
                </h1>
                
                {successMessage && (
                  <motion.div 
                    className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {successMessage}
                  </motion.div>
                )}
                
                {errorMessage && (
                  <motion.div 
                    className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {errorMessage}
                  </motion.div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <motion.input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      disabled={isSubmitting}
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    />
                    {error && (
                      <motion.p 
                        className="mt-2 text-sm text-red-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {error}
                      </motion.p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                      isSubmitting
                        ? 'bg-[#012945] cursor-not-allowed'
                        : 'bg-[#012945] hover:bg-[#012945]'
                    }`}
                    whileHover={!isSubmitting ? { scale: 1.03 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.97 } : {}}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Shortening...
                      </div>
                    ) : 'Shorten URL'}
                  </motion.button>
                </form>

                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/30"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-sm text-white/80 mb-2">Your shortened URL:</p>
                      <div className="flex">
                        <input
                          type="text"
                          value={shortUrl}
                          readOnly
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-white text-[#002395] font-medium"
                        />
                        <motion.button
                          onClick={copyToClipboard}
                          className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {copied ? <CheckIcon size={18} /> : <ClipboardIcon size={18} />}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
          <motion.div 
            className="lg:mt-[14rem] mt-10 md:block w-[80%] md:w-[40%]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <motion.img 
              src={Image} 
              alt="" 
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 100 }}
            />
          </motion.div>
        
      </motion.div>

      <div className="h-[3rem] flex justify-center align-center text-white">Powered BY &nbsp;<Link to="https://skilvorax.com" className="font-bold">SkilvoraX</Link></div>
    </div>
  );
}