import { verifyTurnstile } from "../utils/turnstile.js";

export function requireTurnstile() {
  return async (req, res, next) => {
    const token = req.body.turnstileToken || req.get("cf-turnstile-response");
    console.log("🚀 ~ requireTurnstile ~ token:", token)

    const result = await verifyTurnstile({token});
    if (!result.ok) {
      console.warn("[turnstile] rejected", {
        reason: result.reason,
        path: req.path,
        ua: req.get("user-agent"),
      });
      return res.status(403).json({ error: "challenge_failed", message: result.message });
    }
    console.log('yo pass verfiy');
    req.turnstile = result.data;
    next();
  };
}