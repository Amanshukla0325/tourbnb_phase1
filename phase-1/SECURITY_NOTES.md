# Security Notes (Phase 1)

- Do not commit secrets to repo. Use `.env.example` for placeholder values.
- Store sensitive keys (DB, stripe, cloudinary) in GitHub secrets for CI.
- Use httpOnly cookies for JWT to avoid client-side XSS leaks.
- Use TLS in production and ensure `secure` flag on cookies.
- Follow Stripe's best practices for PCI compliance (keep card info in Stripe, not in our DB).
- Add rate-limiting and validation to prevent abusive requests.
