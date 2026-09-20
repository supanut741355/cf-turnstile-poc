import bcrypt from "bcrypt"

const USERS = [
  {
    id: "001",
    email: "a@a.com",
    passwordHash: bcrypt.hashSync("aaa", 12),
    username: "mr. a"
  },
  {
    id: "002",
    email: "b@b.com",
    passwordHash: bcrypt.hashSync("bbb", 12),
    username: "mr. b"
  },

]


export const  findUserByEmail = async (email: string) => {
  const key = email.trim().toLowerCase();
  // console.log("🚀 ~ findUserByEmail ~ key:", key)
  
  return USERS.find((u) => u.email.toLowerCase() === key) ?? null;
}