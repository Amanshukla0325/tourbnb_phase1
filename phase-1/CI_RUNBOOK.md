# CI Runbook (Phase 1)

This document explains what the CI does and how to act on failures.

## CI Steps
- Lint backend + frontend
- Build backend + frontend
- (future) run unit tests and e2e tests

## Failures
- Lint issues: fix ESLint problems reported by CI and push new commit.
- Build fails: check logs for failing files and stack traces; increase node memory or fix TypeScript errors.

## Update CI
- CI file location: `.github/workflows/ci.yml`
- Edit workflow to add steps for tests or deployment.

## Rollback
- If deploy fails, revert to a previous successful release tag and redeploy.
