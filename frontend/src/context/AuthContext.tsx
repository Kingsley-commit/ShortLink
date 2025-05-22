import { createContext, useContext, useReducer, } from 'react'
import type { ReactNode } from 'react'
import axios from 'axios'
import { useEffect } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api/auth'

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthAction = 
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE' }
  | { type: 'LOGOUT' }

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true }
    case 'AUTH_SUCCESS':
      return { 
        user: action.payload, 
        isAuthenticated: true, 
        loading: false 
      }
    case 'AUTH_FAILURE':
      return {
        user: null, 
        isAuthenticated: false, 
        loading: false 
      }
    case 'LOGOUT':
      return { 
        user: null, 
        isAuthenticated: false, 
        loading: false 
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: false
  })

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser && storedUser !== 'undefined') {
      try {
        const user = JSON.parse(storedUser)
        dispatch({ type: 'AUTH_SUCCESS', payload: user })
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('user')
      }
    }
  }, [])
  
 const login = async (email: string, password: string) => {
  dispatch({ type: 'AUTH_START' })
  try {
    const response = await axios.post(`${API_BASE_URL}/signin`, {
      email,
      password,
    })

    const { user, accessToken, refreshToken } = response.data
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    dispatch({ type: 'AUTH_SUCCESS', payload: user })
  } catch (error) {
    dispatch({ type: 'AUTH_FAILURE' })
    throw error
  }
}

  const signup = async (name: string, email: string, password: string) => {
  dispatch({ type: 'AUTH_START' })
  try {
    const response = await axios.post(`${API_BASE_URL}/signup`, {
      fullName: name,
      email,
      password,
      confirmPassword: password,
    })

    const { user, accessToken, refreshToken } = response.data
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    dispatch({ type: 'AUTH_SUCCESS', payload: user })
  } catch (error) {
    dispatch({ type: 'AUTH_FAILURE' })
    throw error
  }
}

 const logout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  dispatch({ type: 'LOGOUT' })
}

  // The key change is here - we spread the entire state object
  // which includes user, isAuthenticated, AND loading
  return (
    <AuthContext.Provider value={{
      ...state, // This includes all state properties
      login,
      signup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}



export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
