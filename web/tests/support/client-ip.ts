// The inquiry API is rate-limited per client IP (NFR-06). Tests give each test (or run) its
// own documentation-range address (RFC 5737) so they never throttle each other.
let counter = 0;

export function uniqueClientIp(): string {
  counter += 1;
  return `198.51.${(process.pid + counter) % 250}.${Math.floor(Math.random() * 250) + 1}`;
}
