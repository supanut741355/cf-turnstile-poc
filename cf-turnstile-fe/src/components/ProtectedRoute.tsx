import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = () => {
  const {user, loading} = useAuth()
  const location = useLocation()
  // console.log('yoyo ProtectedRoute');
  // console.log('user:', user);
  
  if(loading) return <div className="p-6">Loading...</div>
  if(!user) return <Navigate to="/login" state={{form: location}} replace />
  return <Outlet />
}

export default ProtectedRoute