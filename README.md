# Rise Together Initiative

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   node server.js
   ```

3. Open your browser to:
   ```
   http://localhost:3000
   ```

> **Important:** Do NOT use VS Code Live Server or any other static file server. The Node.js backend handles both the website files and the payment APIs. If you open the site via `file://` or a static server on a different port, the donation form will fail with a "Network error" because the payment API won't be available.

## Environment Variables (for payments to work)

Before starting the server, set these environment variables:

- `STRIPE_SECRET_KEY` — Your Stripe secret key (for card payments)
- `FLW_SECRET_KEY` — Your Flutterwave secret key (for MTN/Airtel Mobile Money)
- `BASE_URL` — Your live domain (e.g., `https://yourdomain.com`)

### Windows (Command Prompt)
```cmd
set STRIPE_SECRET_KEY=sk_test_...
set FLW_SECRET_KEY=FLWSECK_TEST-...
set BASE_URL=http://localhost:3000
node server.js
```

### Windows (PowerShell)
```powershell
$env:STRIPE_SECRET_KEY="sk_test_..."
$env:FLW_SECRET_KEY="FLWSECK_TEST-..."
$env:BASE_URL="http://localhost:3000"
node server.js
```

### macOS / Linux
```bash
export STRIPE_SECRET_KEY=sk_test_...
export FLW_SECRET_KEY=FLWSECK_TEST-...
export BASE_URL=http://localhost:3000
node server.js
```
