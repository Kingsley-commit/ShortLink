import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeGenerator } from './QrCodeGenerator';
import type { UrlEntry } from "../services/api";

export const UrlList = ({ urls, loading, error }: { urls: UrlEntry[]; loading: boolean; error: string | null }) => {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);


  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  // Sorted URLs to have the most recent first
  const sortedUrls = [...urls].reverse();
  
  // Get URLs to display based on showAll state
  const displayedUrls = showAll ? sortedUrls : sortedUrls.slice(0, 1);

  if (loading) {
    return (
      <motion.div 
        className="flex justify-center items-center py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div className="flex flex-col items-center">
          <motion.div
            className="rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 border-b-indigo-600"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className="mt-4 text-indigo-600 font-medium"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading your URLs...
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="text-red-600 py-8 bg-red-50 rounded-2xl shadow-inner px-6 border border-red-100 my-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
          <p className="text-center text-lg">{error}</p>
          <p className="text-center text-sm mt-2 text-red-500">Please try again later</p>
        </div>
      </motion.div>
    );
  }

  if (urls.length === 0) {
    return (
      <motion.div
        className="text-gray-600 text-center py-12 bg-gray-50 rounded-2xl shadow-inner px-6 border border-gray-100 my-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="inline-block mb-6 bg-indigo-100 p-6 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            y: [0, -10, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </motion.div>
        <p className="text-xl font-medium">No URLs found</p>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">Shorten your first URL using the form above and it will appear here!</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-6 mt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex justify-between items-center px-1"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-xl font-semibold text-indigo-800">
          {showAll ? 'All Shortened URLs' : 'Latest Shortened URL'}
        </h3>
        
        {urls.length > 1 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAll(!showAll)}
            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
          >
            {showAll ? (
              <>
                <span>Show Less</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </>
            ) : (
              <>
                <span>View All ({urls.length})</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </motion.button>
        )}
      </motion.div>
      
      <AnimatePresence>
        {displayedUrls.map((url, index) => (
          <div key={url.shortUrl} className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 10
              }}
              whileHover={{ y: -3 }}
              className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-xl"
            >
              {/*theCard content with glass morphism effect */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/*the Original URL */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">Original URL</p>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <a 
                      href={url.longUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-indigo-800 hover:underline break-all line-clamp-1 text-sm md:text-base"
                    >
                      {url.longUrl}
                    </a>
                  </div>
                </div>

                {/*the Short URL */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">Short URL</p>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <a 
                      href={url.shortUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline break-all line-clamp-1 text-sm md:text-base"
                    >
                      {url.shortUrl}
                    </a>
                  </div>
                </div>

                {/*amountof  Visits to the Url */}
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className="flex items-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="bg-indigo-50 p-2 md:p-3 rounded-xl shadow-sm">
                      <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Visits</p>
                      <motion.p 
                        className="font-bold text-indigo-600 text-center text-lg"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        {url.visits}
                      </motion.p>
                    </div>
                  </motion.div>
                  
                  <div className="flex space-x-2">
                    {/*theCopy Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 md:p-3 rounded-xl transition-colors ${
                        copiedUrl === url.shortUrl 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 hover:bg-indigo-100 text-gray-600 hover:text-indigo-600'
                      }`}
                      onClick={() => handleCopy(url.shortUrl)}
                    >
                      {copiedUrl === url.shortUrl ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      )}
                    </motion.button>

                    {/*the QR Code Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 md:p-3 rounded-xl transition-colors ${
                        selectedUrl === url.shortUrl 
                          ? 'bg-indigo-500 text-white' 
                          : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-600'
                      }`}
                      onClick={() => setSelectedUrl(selectedUrl === url.shortUrl ? null : url.shortUrl)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h1m-6 0h-1m4-4v1m-8-1v1m4-9v1m6 3h1m-6 0H9m6-6h1M8 8h1m-2 0h1m4 0h1m-8 4v1m8-5v1m4 4v1m-8-4v1m-4 0v1" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/*the QR Code Panel */}
            <AnimatePresence>
              {selectedUrl === url.shortUrl && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-inner"
                >
                  <QRCodeGenerator url={url.shortUrl} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </AnimatePresence>

      {/* Show more/less URLs animation */}
      {showAll && urls.length > 1 && (
        <motion.div
          className="flex justify-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAll(false)}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-6 py-3 rounded-xl font-medium flex items-center"
          >
            <span>Show Less</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UrlList;