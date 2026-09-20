import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const PublicRoute = () => {
  const {user, loading} = useAuth()
  // console.log('yoyo PublicRoute');
  if(loading) return <div className="p-6">Loading...</div>
  if(user) return <Navigate to="/" replace />

  return <Outlet/>
}

export default PublicRoute