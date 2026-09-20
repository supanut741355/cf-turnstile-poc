import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type User = { 
  id: string;
  email: string;
  username: string;
}

type AuthContextValue = {
  user: User | null
  loading: boolean
  setUser: (u: User | null) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/me", {
          credentials: "include",
        })
        // console.log("🚀 ~ check ~ res:", res)
        setUser(res.ok ? await res.json() : null)
        // console.log('111', user);
      } catch (error){
        console.log('check error:', error);
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    check()
  }, [])

  const logout = async () => {
    // console.log('call logout');
    
    await fetch("http://localhost:4000/api/logout", {
      method: "POST",
      credentials: "include",
    })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}