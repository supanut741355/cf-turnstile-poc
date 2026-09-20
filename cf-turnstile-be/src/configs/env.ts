import "dotenv/config";

function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v;
}

export const config = {
  jwtSecret: required("JWT_SECRET"),
  turnstile: {
    secretKey: required("TURNSTILE_SECRET_KEY"),
    allowedHostnames: new Set(
      (process.env.TURNSTILE_ALLOWED_HOSTNAMES || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    ),
    // true = ถ้า Cloudflare ล่ม ให้ปล่อยผ่าน (เสี่ยง), false = บล็อก (ปลอดภัยกว่า)
    failOpen: process.env.TURNSTILE_FAIL_OPEN === "true",
    maxAgeMs: 3 * 60 * 1000,
    timeoutMs: 5000,
  },
}
