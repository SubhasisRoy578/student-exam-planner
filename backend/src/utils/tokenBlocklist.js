// In-memory JWT blocklist to support logout.
//
// JWTs are stateless by design — issuing one means the server can't
// natively "revoke" it before expiry. To support a real logout
// endpoint, we track logged-out tokens here until they would have
// expired anyway, then they're swept out.
//
// IMPORTANT (production): this in-memory Map is per-process and is
// wiped on restart/redeploy, and won't be shared across multiple
// server instances behind a load balancer. For production, replace
// this with a shared store such as Redis (e.g. SET key=token EX=ttl),
// keyed by token (or token jti) with TTL equal to remaining JWT life.

const blocklist = new Map(); // token -> expiry timestamp (ms)

/**
 * Adds a token to the blocklist until the given expiry.
 * @param {string} token
 * @param {number} expiresAtMs - epoch ms when the token naturally expires
 */
export function blocklistToken(token, expiresAtMs) {
  blocklist.set(token, expiresAtMs);
}

/**
 * Checks whether a token has been blocklisted (logged out).
 * @param {string} token
 */
export function isTokenBlocklisted(token) {
  const expiry = blocklist.get(token);
  if (!expiry) return false;

  if (Date.now() > expiry) {
    blocklist.delete(token); // expired anyway, clean up
    return false;
  }
  return true;
}

// Periodic sweep to avoid unbounded memory growth.
setInterval(() => {
  const now = Date.now();
  for (const [token, expiry] of blocklist.entries()) {
    if (now > expiry) blocklist.delete(token);
  }
}, 60 * 60 * 1000).unref?.();