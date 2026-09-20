import "dotenv/config";

function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v;
}

export const config = {
  jwtSecret: required("JWT_SECRET"),
}
