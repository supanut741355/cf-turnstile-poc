import { useEffect, useRef, useState } from "react"
import { useAuth } from "../context/AuthContext"


const VITE_TURNSTILE_SITEKEY = "0x4AAAAAAE6fsgMT3113Yume"

const LoginForm = () => {
  const {setUser} = useAuth()
  const boxRef = useRef(null)
  const widgetId = useRef(null);
  const [token, setToken] = useState("")
  useEffect(() => {
    const render = () => {
      if (!boxRef.current || widgetId.current !== null) return;
      widgetId.current = window.turnstile.render(boxRef.current, {
        sitekey: VITE_TURNSTILE_SITEKEY,
        callback: (t) => {
          console.log('yo token',t);          
          setToken(t)
        },
        "expired-callback": () => setToken(""),
        "error-callback": () => setToken(""),
      });
    };

    if (window.turnstile) render();
    else window.onloadTurnstileCallback = render;
    return () => {
      if (widgetId.current !== null) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, []);

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
          turnstileToken: token
        }),
        credentials: "include" 
      })
  

      if(!res.ok) {
        window.turnstile.reset(widgetId.current)
        setToken("")
        return
      }

      const data = await res.json()
      console.log("🚀 ~ handleSubmit ~ data:", data)
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
        <div ref={boxRef} />
        <div>
        <button 
          disabled={!token} 
          className="w-full rounded bg-blue-500 p-2 text-white transition-colors
                    hover:bg-blue-600 
                    disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
        >
          Submit
        </button>
      </div>
      </form>
    </div>
  )
}

export default LoginForm
