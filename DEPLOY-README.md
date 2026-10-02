# CryptOrion Upgraded

This package upgrades the existing CryptOrion project with the complete CryptOrion feature set and 3D presentation while preserving CryptOrion's original gold/black palette and brand.

## Included

- CryptOrion gold/black palette preserved
- Premium animated 3D logo, blockchain scene, coins, and logged-in backdrops
- Registration/login and persistent UID ledger
- User activation and account status
- Dashboard, live market charts, watchlist, and 36 markets
- Wallet, deposit submission, withdrawal submission, transaction review
- KYC and 2FA screens
- Trading terminal and receipts
- AI tools, bots, screener, portfolio, alerts, and risk monitor
- Support chat, operator replies, callback requests
- Mobile navigation and responsive layouts
- Admin registration, ledger, deposit-address, KYC/TxID, support, callback, and settlement views
- Existing CryptOrion user records are schema-migrated by the new ledger loader
- Transparent Market Dynamic settlement only; manual Force Win/Force Loss controls were intentionally removed

## Render deployment

1. Back up the existing Render service and `data/db.json` first.
2. Replace the repository contents with this package.
3. Keep the repository PRIVATE because application data and configuration can be sensitive.
4. Build command: `npm install && npm run build`
5. Start command: `npm start`
6. Push to the GitHub branch connected to Render. Render should redeploy automatically.

## Telegram recovery and direct support

The upgraded project includes:

- User → 2FA & Account Recovery → Connect Telegram Bot
- Secure one-time `/start` link (expires after 15 minutes)
- Telegram account connection status visible in the admin Registration and Account recovery tabs
- Six-digit CryptOrion password-recovery OTP sent only through the linked bot
- OTP expiry after 10 minutes, five-attempt lockout, one-time use, and hashed OTP storage
- Admin recovery event/status audit without revealing the OTP
- Admin can proactively select any UID in Support and send a direct message; linked users also receive the message through Telegram

Configure these Render environment variables before Telegram linking will work:

```text
TELEGRAM_BOT_TOKEN=<token issued by BotFather>
TELEGRAM_BOT_USERNAME=<bot username without @>
PUBLIC_URL=https://trworld.onrender.com
TELEGRAM_WEBHOOK_SECRET=<long random secret>
OTP_SECRET=<different long random secret>
```

When a user starts a connection, the server automatically asks Telegram to set the webhook to `PUBLIC_URL/api/telegram/webhook`.

Never request or store a user's Telegram login code. The six-digit code generated here is a CryptOrion recovery OTP only.

## Important production requirements

This package uses JSON files for its ledger. Render instances can have an ephemeral filesystem. For durable real-user data, attach a Render Persistent Disk or migrate the ledger to PostgreSQL before production use.

Before accepting real funds, add server-side admin authentication/authorization, hashed user passwords, rate limiting, CSRF protection, secure secret environment variables, encrypted KYC storage, proper custody controls, monitoring, backups, and an independent security/legal review. Do not publish a repository containing real user records, passwords, wallet data, or KYC files.

The current admin route is preserved as `/super-secret-CryptOrion-System`, but a hidden URL alone is not security. Replace the prototype admin login with server-side authentication before production.

---

## Account recovery (OTP password reset)

Users who forget their password reset it from the sign-in page → **Reset your password**.

**Step 1 — prove identity with registration data**
The user enters: registered **email** + **UID** + the **wallet address recorded at sign-up**.
If no wallet is on file, they can instead supply their **KYC full name + KYC ID number**.
All three are checked against `user.reg`, a snapshot frozen at registration that is never
modified by profile edits, logout, or later password resets.

**Step 2 — OTP**
- Telegram linked → the 6-digit code is delivered automatically (10-minute expiry).
- Not linked → the request appears in **Admin → Account recovery → Pending identity-verified
  requests**. The operator confirms the requester and clicks **Release OTP**; the user's page
  is polling and unlocks the code entry automatically.

**Step 3 — new password** (8+ characters), then the user is signed straight in.

### Security properties
- Generic error text on every mismatch, so accounts cannot be enumerated.
- 5 failed detail attempts within 15 minutes locks recovery for that UID.
- 5 wrong OTP entries burn the code.
- Codes are single-use, expire in 10 minutes, and issuing a new one voids the previous.
- `GET /api/store` never exposes `password`, `wallet`, `kycId`, `kycName`, `kycCountry`,
  `reg`, `codeHash` or the plaintext `code`. Only masked forms (`••••CDEF`) are published,
  so the recovery answers cannot be read back out of the public ledger.
- Every step is written to the audit log: `recoveryDetailsFailed`, `recoveryCodeIssued`,
  `recoveryCodeReleased`, `recoveryCompleted`, `recoveryLocked`.

## Permanent user records

Every registered UID is retained for the life of the deployment. Nothing removes a user —
logout only clears `lastSeenAt`. **Admin → Account recovery → Permanent registration records**
lists every UID with its registration date, masked wallet, KYC state, Telegram state and last
password reset.

### Making that durable on Render (required)
The ledger is JSON on disk, and Render's default filesystem is ephemeral — a redeploy wipes it.
Attach a **Render Persistent Disk** and point the app at it:

1. Render dashboard → your service → **Disks** → *Add Disk*, mount path `/var/data`.
2. Add environment variable `DATA_DIR=/var/data`.
3. Redeploy. The ledger is then written to `/var/data/data/db.json` plus a `db.bak.json`
   mirror, and survives every deploy and restart.

Without `DATA_DIR` the app falls back to the working directory and user data WILL be lost on
redeploy.

## KYC / TxID review

**Admin → KYC / TxID → KYC review** is a full review queue, not a bare Approve/Reject button.

Filter by **Pending / Approved / Rejected / Not submitted / All**, search by UID or email, then
press **Review details** to open the dossier for that account:

- **Identity submitted by the user** — full legal name, country, ID/passport number, submission time
- **Registration record** — the frozen sign-up snapshot: registered email, wallet address, IP,
  device fingerprint and registration date. If the account email was changed after sign-up it is
  shown with a `(CHANGED)` marker next to the original.
- **Account state** — status, balance, completed trades, Telegram link, 2FA, last password reset,
  last seen
- **Deposits submitted** — every TxID with asset, amount, status and timestamp
- **Withdrawals requested** — destination address, amount, status
- **Review history** — every previous decision with its reviewer note

### Automatic cross-checks
The server compares the account against every other account and raises flags before you decide:

| Flag | Meaning |
|---|---|
| ✖ Identical KYC ID number | The same ID/passport number is already registered to another UID |
| ✖ Identical registration wallet | Two accounts signed up with the same wallet address |
| ✖ KYC submission incomplete | Name, country or ID number is missing |
| ⚠ Identical KYC full name | Same name on another account |
| ⚠ Registered from the same IP | Shared sign-up IP address |
| ⚠ Same device fingerprint | Shared browser/device string |
| ⚠ Single-word name / short ID number | Low-quality submission |
| ⚠ Withdrawal with no approved deposit | Payout requested before any funding cleared |
| ✖ Duplicate TxID | The same deposit TxID was submitted by another UID (shown on the deposit) |

### Controls
- **Approve** requires a second confirmation click.
- **Reject** requires a written reason; the reason is stored and shown in the review history.
- **Send back to pending** returns the case to the queue.

### Access control
KYC identity fields are never published on `GET /api/store`. They are returned only by the
`adminUserDetail` action, which requires the operator credentials, and every access is written
to the audit log as `kycDetailViewed`. Approving or rejecting KYC also requires those credentials.

Set them in the environment rather than relying on the built-in defaults:

```
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=<long random string>
```

## Authentication and access control

### Sessions
`register` and `login` return a **session token** (12-hour lifetime, held in memory on the
server). The browser sends it as the `x-tw-token` header on every call. The server resolves the
acting UID **from the token only** — a UID supplied in the request body is ignored and
overwritten, so one signed-in user can never act as another. `logout` destroys the session.

### The admin panel
The operator console no longer trusts the browser. Signing in calls `adminLogin`, which checks
`ADMIN_EMAIL` / `ADMIN_PASSWORD` **on the server** and returns a separate admin token sent as
`x-tw-admin`. Admin sign-in is rate limited to 5 attempts per IP per 15 minutes and every
attempt, success or failure, is written to the audit log.

These actions now require that admin token and return `403` without it:

```
approveTx  rejectTx  saveCfg  setPxTier  setOrderTier  recoverRelease
recoverCancel  supportReply  supportMarkRead  callbackUpdate  import
adminUserDetail  updateKyc(approved|rejected)
```

### Nobody can read the ledger any more
`GET /api/store` is scoped to the caller:

| Caller | Sees |
|---|---|
| Not signed in | Deposit addresses only — no users, balances, orders, audit log |
| Signed-in user | Their own profile, orders, trades, deposits, withdrawals, support thread |
| Admin token | The full ledger, as before |

The audit log, other members' balances, KYC data and the recovery queue are never sent to a
normal client.

### What a signed-in user may change about themselves
`saveUser` accepts only `displayName`, `timezone`, `emailAlerts`, `settingsSavedAt`,
`kycName`, `kycCountry`, `kycId`, plus setting `kyc` to `pending`. Everything else —
`balance`, `assets`, `status`, `pxTier`, `id`, `email`, `password`, `reg` — is stripped from the
request. Only an admin token can write those.

### Swaps are priced by the server
Converting between assets used to be a client-side balance rewrite. It is now the `swap`
action, which values both legs from a Binance price cache refreshed every 15 seconds on the
server. A price sent by the client is ignored, and the swap is rejected outright if no fresh
market data is available.

### Configure the operator credentials
The built-in defaults are public in this repository. Always override them:

```
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=<long random string>
OTP_SECRET=<long random string>
```

## Password storage

Passwords are hashed with **scrypt** (random 16-byte salt per user, 64-byte derived key) and
stored as `scrypt$<salt>$<hash>`. Nothing reversible is written to the ledger and comparisons use
`timingSafeEqual`, so two accounts sharing a password still produce different hashes.

Ledgers written by older builds hold plaintext. No migration step is needed: the first time such
a user signs in successfully their password is re-hashed in place and the plaintext is gone from
disk. This is recorded in the audit log as `passwordRehashed`. Passwords set through account
recovery are hashed the same way.

## Operator two-factor authentication

Admin sign-in supports TOTP (Google Authenticator, Authy, 1Password — any RFC 6238 app).

### Enabling it

```
npm run admin:2fa -- "your new admin password"
```

The script prints:

- an `ADMIN_TOTP_SECRET` to add to the environment,
- an `otpauth://` URI to scan or paste into the authenticator app,
- the code your app should be showing right now, so you can confirm it works before locking
  yourself out,
- an `ADMIN_PASSWORD_HASH` if you passed a password.

Add the secret to Render and redeploy. The console then asks for a 6-digit code on every
sign-in; without `ADMIN_TOTP_SECRET` set, behaviour is unchanged and the field stays hidden.

Codes accept a plus or minus one 30-second window for clock drift, and the existing limit of five
sign-in attempts per IP per 15 minutes applies to code guesses as well. Failures are recorded as
`adminLogin2faFailed`.

### Removing the shared plaintext admin password

```
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD_HASH=scrypt$...      # from the script; delete ADMIN_PASSWORD once set
ADMIN_TOTP_SECRET=...
OTP_SECRET=...
DATA_DIR=/var/data
```

When `ADMIN_PASSWORD_HASH` is present it takes precedence and `ADMIN_PASSWORD` can be removed
entirely, so no readable operator password exists anywhere in the deployment.

## Telegram customer service

Support is a single conversation that the customer can reach from the app **or** from Telegram.
Whatever they write in Telegram appears in **Admin → Support**, and the operator's replies are
pushed straight back into their Telegram chat.

```
customer -> Telegram bot -> /api/telegram/webhook -> support thread -> Admin → Support
Admin → Support -> supportReply -> sendMessage -> customer's Telegram
```

### Setup

1. Create the bot with [@BotFather](https://t.me/BotFather) and copy the token.
2. Set the environment variables:

```
TELEGRAM_BOT_TOKEN=123456:AA...
TELEGRAM_BOT_USERNAME=YourBotName
PUBLIC_URL=https://trworld.onrender.com
TELEGRAM_WEBHOOK_SECRET=<long random string>
```

3. Redeploy. The webhook registers itself the first time someone taps **Connect Telegram**, so
   there is nothing to configure by hand.

### What the customer sees

**Support → Chat on Telegram** shows a *Connect Telegram* button, which opens
`t.me/<bot>?start=tw_<token>`; pressing Start in Telegram links the chat to their UID. The card
then turns into an *Open Telegram chat* button. Linking also enables Telegram delivery of
account-recovery codes.

Bot commands: `/status` for an account summary, `/help` for the list. Any other text becomes a
support ticket, answered instantly by the assistant and then by an operator.

### What the operator sees

Messages are tagged with the channel they arrived on, so a thread shows `Telegram` or `App` next
to each bubble, and the UID picker marks accounts that have Telegram linked. Replies are
delivered to Telegram automatically whenever the customer has linked their chat.

### Limits worth knowing

- Telegram's Bot API **cannot message someone who has not pressed Start on the bot**. The link
  step is mandatory; knowing a phone number is not enough. This is a platform rule, not a gap in
  this build.
- Only text is bridged today. Photos and documents sent to the bot are answered with a note
  asking for a text description.
- Reaching users who never link the bot would require a Telegram *user* account over MTProto
  (`api_id`/`api_hash`), which breaks Telegram's terms for automated messaging and risks the
  account being banned. It is deliberately not implemented here.

`TELEGRAM_API_BASE` exists so the bridge can be pointed at a stub during testing; leave it unset
in production.

## Keeping data when the host has no persistent disk

Render's free plan gives every deploy — and every wake-up after the instance
sleeps — a blank filesystem, so a file-backed ledger loses every user. Set
`DATABASE_URL` and the ledger moves into Postgres instead, which survives all of it.

Free Postgres that needs no credit card: **Neon** (neon.tech) — 0.5 GB, permanent free
plan, a Singapore region. This ledger is a few kilobytes, so the free tier is far more
than enough.

### Setup

1. Sign up at neon.tech, create a project, pick the **Singapore (ap-southeast-1)** region.
2. Copy the connection string. It looks like:

```
postgresql://user:password@ep-xxx.ap-southeast-1.aws.neon.tech/dbname?sslmode=require
```

3. In Render add the environment variable:

```
DATABASE_URL=postgresql://...
```

4. Save. The service redeploys and the log shows either
   `[ledger] database initialised from local files: N users` on the very first boot, or
   `[ledger] loaded from database: N users` on every boot after that.

Remove `DATABASE_URL` and the server silently goes back to JSON files, so nothing else
has to change and local development keeps working with no database at all.

### How it works

The table is created automatically:

```sql
CREATE TABLE tw_store(id int PRIMARY KEY, doc jsonb NOT NULL, updated_at timestamptz);
```

The whole ledger is a single JSONB document. It is mirrored in memory and written back
asynchronously after every change, with a final flush on `SIGTERM`/`SIGINT` so a shutdown
mid-request is not lost. Reads never touch the network, so response times are unchanged.

With `DATABASE_URL` set, a persistent disk is no longer needed and the free plan is safe
for the data. The instance still sleeps after inactivity, so the first request after a
quiet period can take roughly 50 seconds.

## Web3 wallet linking

A member can attach their own wallet to their CryptOrion account from
**Settings → Web3 wallet**. The link is permanent until they press *Disconnect*:
it is stored on the user record, so signing out, switching device or a redeploy
does not break it.

### Chains

| Button | Wallets | Use |
|---|---|---|
| Connect EVM wallet | MetaMask, Trust, OKX, Binance Wallet, any EIP-1193 provider | ETH and ERC20/BEP20 |
| Connect TronLink | TronLink extension or in-app browser | USDT-TRC20 |

### How ownership is proved

Claiming an address is not enough — the wallet has to sign for it:

1. The browser asks for the account (`eth_requestAccounts` / `tron_requestAccounts`).
2. `walletChallenge` returns a one-time message containing the UID and a 128-bit nonce.
3. The wallet signs it (`personal_sign` on EVM, `signMessageV2` on TRON). No gas,
   no transaction, no spending approval.
4. `walletConnect` recovers the signing key from the signature server-side and
   compares it with the claimed address. A mismatch is rejected and audited.

The challenge is **single use**: it is consumed on the first verification attempt,
so a captured signature can never be replayed. Challenges also expire after 10 minutes.

TRON addresses are derived from the recovered key the same way TronLink does it —
`base58check(0x41 ‖ keccak(pubkey)[12:])` — so no TRON SDK is needed on the server.

### Fraud controls

- One wallet can be linked to **one account only**; a second attempt returns 409.
- The operator dossier shows the linked address and chain, and raises an error-level
  flag if the same wallet ever appears on two accounts.
- `walletChallenge`, `walletConnected`, `walletDisconnected` and `walletConnectFailed`
  (with the reason) are all written to the audit log.
- A user cannot set `web3` through `saveUser` — the field is stripped from the payload,
  so the only way to get a link is to sign for it.

### What this does not do

Linking proves ownership. It does **not** move money: deposits are still submitted with
a TxID and approved by an operator. Wiring up on-chain deposit detection would be a
separate piece of work.
