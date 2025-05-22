import {  useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import UrlForm from './components/UrlForm'
import UrlList from './components/UrlList'
import Login from './components/auth/Login'
import Signup from './components/auth/SignUp'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Header from './components/Header'
import { AuthProvider, useAuth } from './context/AuthContext'
import { useUrls } from './hooks/useUrls'
import Home from './pages/Home'
import { useShortener } from './hooks/useShortner'
import { Navigate } from 'react-router-dom'
import BackGround from './assets/Group7.svg'
import NotFound from './pages/NotFound'




function Dashboard() {
  const { urls, loading, error, fetchUrls, search } = useUrls();
  const { handleShorten, successMessage, errorMessage } = useShortener(fetchUrls);
  const { user } = useAuth();
  console.log(user)

  
  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-50 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50"
      style={{fontFamily: "montserrat"}}
    >
      <Header />
      
      <div className="py-8 px-4" style={{ 
        backgroundImage: `url(${BackGround})`, 
        backgroundRepeat: "no-repeat", 
        backgroundSize: 'cover', 
        fontFamily: "Montserrat"
      }}>
        <div className="max-w-4xl mx-auto">
         
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-center"
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user.name.split(' ')[0]}!
            </h1>
            <p className="text-white">Manage your shortened URLs</p>
          </motion.div>

          
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg"
            >
              {successMessage}
            </motion.div>
          )}

          
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg"
            >
              {errorMessage}
            </motion.div>
          )}

          <div className="grid grid-cols-1 gap-8">
           
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="col-span-1"
            >
              <UrlForm onSubmit={handleShorten} />
            </motion.div>

            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="col-span-1"
            >
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Short URLs</h2>
                <div className="mb-4">
                  <input
                    type="text"
                    onChange={(e) => search(e.target.value)}
                    placeholder="Search URLs (min 3 chars)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <UrlList 
                  urls={urls} 
                  loading={loading} 
                  error={error}
                  onRetry={fetchUrls} 
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AuthWrapper() {
  const {  user } = useAuth()
  
  useEffect(() => {
    
    const storedUser = localStorage.getItem('user')
    console.log(storedUser)
    if (storedUser && !user) {
      console.log('User found in localStorage:', storedUser)
    }
  }, [user])

  return (
  <Routes>
      <Route path="/" element={<Navigate to="/Home" replace />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<NotFound />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>

  )
}


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AuthWrapper />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App