import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth()
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}


export default ProtectedRoute