## Running Integration Tests Locally

1. Install dependencies (this will install dev dependencies):
```
cd backend
npm ci
```

2. Ensure the database is seeded (if tests depend on admin/manager users):
```
npm run seed
```

3. Run tests:
```
npm test
```

Notes:
- The Jest test imports the express `app` without starting it in test mode so it can be controlled by the test harness. Make sure your `NODE_ENV` is not `test` if you want to run the server.
- If you want to run the test file with node directly (script-based), use the existing `auth-rbac-test.js` script under `backend/tests`.
