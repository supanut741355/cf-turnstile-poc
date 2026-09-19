import { useAuth } from "../context/AuthContext";

const HomePage = () => {

  const handleLogout = () => {
    logout()
  }

  const {logout} = useAuth()

  return (
    <>
      <p>
        yo home page
      </p>
      
      <button onClick={handleLogout} className="bg-red-500 m-2 p-2 border">Logout</button>
    </>
  )
}

export default HomePage