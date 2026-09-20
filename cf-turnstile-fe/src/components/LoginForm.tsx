import { useAuth } from "../context/AuthContext"

const LoginForm = () => {

  const {setUser} = useAuth()



  const handleSubmit = async(e) => {
    e.preventDefault()
    // console.log(e.target.email.value);
    // console.log(e.target.password.value);
    const email = e.target.email.value
    const password = e.target.password.value

    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: 'POST',
        headers: {"content-Type": "application/json"},
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: "include" 
      })
      const data = await res.json()
      setUser(data.user ?? data)
    } catch (error) {
      console.log(error); 
    }
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg border bg-white p-6 shadow-md">
        <p className="mb-1 font-medium text-gray-75xl">Email</p>
        <input type="text" name="email"  className="mb-4 w-full rounded border p-2" />
        
        <p className="mb-1 font-medium text-gray-75xl">Password</p>
        <input type="password" name="password"  className="mb-6 w-full rounded border p-2" />
        
        <div>
          <button className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 transition-colors">
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
