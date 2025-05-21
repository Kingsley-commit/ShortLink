import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const UrlForm = ({ onSubmit, loading = false }: {
  onSubmit: (url: string, customCode?: string) => void;
  loading?: boolean;
})=> {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customCode, setCustomCode] = useState('');
  const [showCustomCode, setShowCustomCode] = useState(false);

  const validateUrl = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL with http:// or https://');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(url.trim(), customCode.trim());
      setUrl('');
      setCustomCode('');
    } catch (err) {
      console.error("❌ Failed to shorten URL:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!isSubmitting) {
        handleSubmit(e as any as React.FormEvent);
      }
    }
  };

  const toggleCustomCode = () => {
    setShowCustomCode(!showCustomCode);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white/20 opacity-20 backdrop-blur-md  p-8 md:p-10 rounded-3xl shadow-2xl backdrop-blur-md relative overflow-hidden"
    >
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-indigo-200 opacity-30 blur-2xl"></div>
      <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full bg-blue-300 opacity-20 blur-2xl"></div>
      
      <motion.h2 
        className="text-3xl md:text-4xl font-bold mb-6 text-center bg-clip-text  bg-gradient-to-r text-[#FFFFFF]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        Shorten Your URL
      </motion.h2>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div>
          <motion.label 
            htmlFor="url" 
            className="block text-sm font-medium text-white mb-2 ml-1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            Enter a long URL
          </motion.label>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
           
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/your/long/url"
              onKeyDown={handleKeyDown}
              className="w-full pl-12 pr-5 py-4 border-2 border-indigo-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-lg transition-all duration-300 hover:shadow-xl bg-white/90 backdrop-blur-sm"
              disabled={loading || isSubmitting}
            />


            <div className="mt-4 flex justify-center">
              <motion.button
                type="button"
                onClick={toggleCustomCode}
                className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md transition-all duration-300"
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.4)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 mr-2 transition-transform duration-300 ${showCustomCode ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d={showCustomCode ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} 
                  />
                </svg>
                
                <span className="relative font-medium">
                  {showCustomCode ? "Hide Custom Link" : "Create Custom Link"}
                </span>
              </motion.button>
            </div>

            <AnimatePresence>
              {showCustomCode && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6"
                >
                  <label className="block text-sm font-medium text-indigo-800 mb-2 ml-1">
                    Customize your short URL
                  </label>
                  <input
                    type="text"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    placeholder="Enter custom name e.g. mae-rocks"
                    className="w-full pl-4 pr-5 py-4 border-2 border-indigo-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-lg transition-all duration-300 hover:shadow-xl bg-white/90 backdrop-blur-sm"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          <AnimatePresence>
            {error && (
              <motion.div 
                className="mt-2 text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl border border-red-100 flex items-center space-x-2"
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative"
        >
          <motion.button
            type="submit"
            className={`w-full py-4 px-6 rounded-2xl text-white font-medium text-lg shadow-lg transition-all duration-300 ${
              loading || isSubmitting 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 hover:shadow-xl hover:shadow-indigo-200'
            }`}
            disabled={loading || isSubmitting}
            whileHover={!loading && !isSubmitting ? { scale: 1.02 } : {}}
            whileTap={!loading && !isSubmitting ? { scale: 0.98 } : {}}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <motion.div 
                  className="w-5 h-5 rounded-full border-2 border-white border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.span
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Shortening...
                </motion.span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span>Shorten URL</span>
              </div>
            )}
          </motion.button>
          
          <div className="absolute -bottom-2 inset-x-0 h-8 bg-indigo-500 opacity-20 blur-xl rounded-full"></div>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default UrlForm;