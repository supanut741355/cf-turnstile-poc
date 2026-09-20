import crypto from "node:crypto";
import { config } from "../configs/env.js";


const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const ERROR_MESSAGES = {
  "missing-input-response": "Security verification result is missing",
  "invalid-input-response": "Security verification result is invalid",
  "timeout-or-duplicate": "Security verification result has expired or has already been used",
  "missing-input-secret": "Server configuration is invalid",
  "invalid-input-secret": "Server configuration is invalid",
  "bad-request": "Invalid request",
  "internal-error": "Security verification service is unavailable",
};

async function callSiteverify(body, signal) {
  const res = await fetch(SITEVERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    signal,
  });
  if (!res.ok) throw new Error(`siteverify HTTP ${res.status}`);
  return res.json();
}


export async function verifyTurnstile({ token }) {
  const { secretKey, allowedHostnames, maxAgeMs, timeoutMs, failOpen } = config.turnstile;

  if (!token || typeof token !== "string" || token.length > 2048) {
    return { ok: false, reason: "missing-input-response", message: ERROR_MESSAGES["missing-input-response"] };
  }

  const form = new URLSearchParams();
  form.set("secret", secretKey);
  form.set("response", token);
  form.set("idempotency_key", crypto.randomUUID());

  let data;
  try {
    data = await callSiteverify(form, AbortSignal.timeout(timeoutMs));
    if (!data.success && data["error-codes"]?.includes("internal-error")) {
      data = await callSiteverify(form, AbortSignal.timeout(timeoutMs));
    }
  } catch (err) {
    console.error("[turnstile] siteverify unreachable:", err.message);
    return failOpen
      ? { ok: true, reason: "fail-open", data: null }
      : { ok: false, reason: "unreachable", message: "The verification system is unavailable. Please try again." };
  }

  if (!data.success) {
    const code = data["error-codes"]?.[0] || "unknown";
    return { ok: false, reason: code, message: ERROR_MESSAGES[code] || "Failed secure check", data };
  }


  if (allowedHostnames.size > 0 && !allowedHostnames.has(data.hostname)) {
    return { ok: false, reason: "hostname-mismatch", message: "Failed secure check", data };
  }

  const issuedAt = Date.parse(data.challenge_ts);
  if (!Number.isFinite(issuedAt) || Date.now() - issuedAt > maxAgeMs) {
    return { ok: false, reason: "stale", message: "Expire ... try again", data };
  }

  return { ok: true, data };
}