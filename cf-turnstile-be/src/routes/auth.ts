import { Router } from "express";
import bcrypt from "bcrypt";
import { findUserByEmail } from "../utils/finduserbyemail.js";
import jwt from "jsonwebtoken";

const router = Router();


router.get('/me', (req, res) => {
  const token = req.cookies.token
  if(!token) return res.status(401).json({ message: "unauthorized" })
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET)
      res.json({
        id: payload.id,
        email: payload.email
      })
    } catch (error) {
      res.status(401).json({
        message: "invalid token"
      })
    }
})

router.post("/login", 
  async(req, res) => { // query db
    const {email, password} = req.body

    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
      return res.status(400).json({ error: "invalid_input", message: "กรุณากรอกข้อมูลให้ครบ" });
    }
    try {
      const user = await findUserByEmail(email);
      const hash = user?.passwordHash ?? ""
      const match = await bcrypt.compare(password, hash)

      if (!user || !match) {
        return res.status(401).json({ error: "invalid_credentials", message: "Wrong email or password" });
      }

      const token = jwt.sign({ sub: user.id }, 'aaa', { expiresIn: "1h" });

      res.cookie("yo-session", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
        path: "/",
      });


      return res.json({ user: { id: user.id, username: user.username } });
    }
    catch(err) {
      console.log("error", err);
      
    }
  }
)



export default router