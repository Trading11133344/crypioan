# TradingWorld v13 — CryptOrion v12 စနစ်အားလုံး ပေါင်းထည့်မှု မှတ်တမ်း

**ရက်စွဲ:** 2026-10-01
**အခြေခံ (base):** `TradingWorld-Web3-2026-09-29.zip`
**ပေါင်းထည့်သော source:** `CryptOrion-v12-FINAL-2026-09-30.zip`

> CryptOrion v12 မှာ ပါဝင်တဲ့ **စနစ်အားလုံး** ကို TradingWorld ထဲ ပြန်ပေါင်းထည့်ထားပါတယ်။
> TradingWorld ရဲ့ **နာမည်၊ ရွှေရောင်/အမည်းရောင် palette (#f0b90b / #0b0e11)၊ လိုဂို၊ admin URL၊
> admin အကောင့်၊ database table** အားလုံး **မူရင်းအတိုင်း** ထားရှိထားပါတယ်။

---

## ၁။ မပြောင်းလဲသော အရာများ (ကတိ)

| အရာ | တန်ဖိုး |
|---|---|
| Brand name | **TradingWorld** |
| အဓိကအရောင် | `#f0b90b` ရွှေရောင် · နောက်ခံ `#0b0e11` |
| `src/index.css` | TradingWorld မူရင်းဖိုင်နဲ့ **byte-identical** (ဗိုက်တစ်လုံးမှ မကွာ) |
| Admin URL | `/super-secret-admin-700` |
| Admin အကောင့် | `mglwanwai19900@gmail.com` / `Aa369369@@` |
| Postgres table | `tw_store(doc)` — **ရှိပြီးသား data အကုန် ဆက်သုံးလို့ရ** |
| LocalStorage key | `tradingworld_user` / `tw_token` |

---

## ၂။ 🐞 Trade အလုပ်မလုပ်တဲ့ ပြဿနာ — စစ်ဆေးတွေ့ရှိချက်

Trade logic (`createOrder` / `closeOrder` / win-loss-draw / rate 40–100%) ကိုယ်တိုင်က
**မှားမနေပါ** — ကုဒ်ဟာ CryptOrion နဲ့ အတူတူပါပဲ။ စမ်းသပ်ချက်များ အကုန် အောင်ပါတယ်။

ပြဿနာက **session (login token) ပျောက်သွားခြင်း** ကြောင့်ပါ 👇

### 🔴 Bug #1 — Server restart တိုင်း login token အားလုံး ပျက်သွားခြင်း (အဓိက ပြဿနာ)

အရင် TradingWorld မှာ session တွေကို RAM ထဲ (`new Map()`) မှာပဲ သိမ်းထားပါတယ်။
Render free tier က idle ဖြစ်ရင် ပိတ်ပြီး ပြန်ဖွင့်တယ် (ဒါမှမဟုတ် deploy တိုင်း) —
အဲဒီအခါ token တွေ အကုန်ပျောက်ပါတယ်။

ဖြစ်လာတဲ့ အကျိုးဆက်:
- User က browser မှာ **login ဝင်ပြီးသားလို ပဲ မြင်ရတယ်** (localStorage မှာ user ရှိနေလို့)
- ဒါပေမယ့် Buy/Up ဒါမှမဟုတ် Sell/Down နှိပ်လိုက်ရင် server က `401 Sign in required` ပြန်တယ်
- ➜ **"Trade အလုပ်မလုပ်ဘူး"**

**စမ်းသပ်ချက် (restart simulation):**
```
OLD TradingWorld   → after restart, session valid?  false   ❌
NEW TradingWorld v13 → after restart, session valid?  true   ✅
```

**ပြင်ဆင်ပုံ:**
- Session တွေကို ledger ထဲမှာ **sha256 hash** အဖြစ် သိမ်းထား (`sessionSnapshot()`)
- Server ပြန်တက်တိုင်း `hydrateSessions()` နဲ့ ပြန်ဆွဲတင်
- Server က user ကို မသိတော့ရင် UI က အလိုအလျောက် login page ပြန်ပို့ပြီး
  *"Your session expired. Please sign in again."* လို့ ပြပေးတယ် (အရင်က ဘာမှ မပြဘဲ တိတ်တိတ် fail ဖြစ်နေတာ)

### 🔴 Bug #2 — Neon Postgres ချိတ်မရခြင်း ➜ ledger အကုန် ပျောက်

Neon ပေးတဲ့ connection URL မှာ `sslmode=require` ပါပါတယ်။ `pg` version အသစ်တွေက
အဲဒါကို `verify-full` လို့ ဖတ်ပြီး Neon ရဲ့ certificate ကို ငြင်းပယ်ပါတယ် ➜ DB ချိတ်မရ ➜
ledger က memory ထဲကို fallback ကျ ➜ **restart တိုင်း order/trade/balance အကုန် ပျောက်**။

**ပြင်ဆင်ပုံ:** `sslmode=` နဲ့ `channel_binding=` နှစ်ခုလုံးကို URL ထဲက ဖြုတ်ပြီး
`ssl` ကို ကုဒ်ထဲမှာ တိုက်ရိုက် သတ်မှတ်လိုက်ပါတယ်။

### 🟠 Bug #3 — Data ပျောက်နေမှန်း ဘယ်သူမှ မသိခြင်း

`DATA_DIR` ရော `DATABASE_URL` ရော မသတ်မှတ်ထားရင် အရင်က တိတ်တိတ်ပဲ
memory သုံးနေတာ။ ယခု boot တိုင်း သတိပေးစာ ထုတ်ပေးပါတယ်:

```
[ledger] WARNING: neither DATA_DIR nor DATABASE_URL is set
         - the ledger will be wiped on every deploy/restart.
```

### 🟢 ထပ်တိုး — နေ့စဉ် အလိုအလျောက် backup

၂၄ နာရီတစ်ကြိမ် ledger ကို snapshot ရိုက်ပြီး နောက်ဆုံး **၁၄ ခု** ကို သိမ်းထားပါတယ်
(`tw_backups` table ဒါမှမဟုတ် `data/backup-YYYY-MM-DD.json`)။

---

## ၃။ 🔐 Security စနစ်များ (CryptOrion v10–v12 မှ)

| အရာ | အရင် TradingWorld | ယခု v13 |
|---|---|---|
| Admin login | — | **Server-side** + token (`x-tw-admin`) |
| Brute force | — | **Throttle**: ၁၅ မိနစ် / ၅ ကြိမ် ➜ `429` |
| 2FA | — | **TOTP** (Google Authenticator) — `npm run admin:2fa` |
| Session token | plain text key | **sha256 hash** + ledger မှာ persist |
| `/api/store` | — | Token မရှိရင် user data လုံးဝ မပြ |
| User password | — | **scrypt hash** (`isLegacyPw()` နဲ့ အလိုအလျောက် အဆင့်မြှင့်) |
| Audit log | အခြေခံ | login fail, wallet fail, admin throttle အားလုံး မှတ်တမ်းတင် |
| `adminExport` | — | ledger အပြည့် export (session မပါ) |

---

## ၄။ 👛 Web3 Wallet စနစ် အပြည့်အစုံ

- **EIP-6963 multi-wallet discovery** — MetaMask ကို hard-code မလုပ်တော့ဘဲ
  device မှာရှိတဲ့ wallet အားလုံး (MetaMask, Rabby, OKX, Coinbase, Brave, Trust…) ကို အလိုအလျောက် ရှာပေး
- **Mobile deep-link** (`WALLET_APP_LINKS` / `walletAppLinks`) — ဖုန်းမှာ wallet app ရဲ့
  built-in browser ထဲ တိုက်ရိုက် ဖွင့်ပေး
- **In-app wallet browser detection** (`inAppWalletName`, `isMobileUA`)
- **Wallet-only sign-in** (`walletLoginChallenge` / `walletLogin`) — email မလိုဘဲ
  signature နဲ့ အကောင့်ဖွင့်/ဝင်နိုင်၊ nonce က တစ်ကြိမ်သာ သုံးလို့ရပြီး ၁၀ မိနစ်နဲ့ သက်တမ်းကုန်
- TRON + EVM နှစ်မျိုးလုံး support

---

## ၅။ 🧩 Admin Panel ထပ်တိုးချက်

- Tab **၈ ခု** (Account recovery အသစ် ပါဝင်)
- Registration tab မှာ **Device / IP / Telegram / Recovery / KYC** ကော်လံများ တိုးလာ
- **Per-order settlement override** (`setOrderTier`) — order တစ်ခုချင်းစီကို A/B/D သတ်မှတ်နိုင်
- **Callback requests** စီမံခန့်ခွဲမှု
- User detail မှာ duplicate wallet / IP / device / KYC flag များ

---

## ၆။ 🐳 Dockerfile (အသစ်)

`node:22-alpine` အခြေခံ container ဖိုင် ထည့်ပေးထားပါတယ် (Render Docker deploy အတွက်)။

---

## ၇။ ✅ စမ်းသပ်ပြီးသား (automated tests)

```
PASS  register
PASS  admin login (TradingWorld creds)
PASS  activated + funded
PASS  /api/store leak closed (anon sees no users)
PASS  createOrder
PASS  closeOrder settles WIN     (1000 → 900 → 1040 ✓)
PASS  closeOrder settles LOSS
PASS  closeOrder settles DRAW (stake returned)
PASS  per-order settlement override (tier A forces win)
PASS  cannot close another user's order
PASS  createOrder without session rejected (401)
PASS  walletLoginChallenge works + brands TradingWorld
PASS  adminExport
PASS  session survives server restart          ← Bug #1 fixed
PASS  vite build (1886 modules, 0 errors)
```

---

## ၈။ 🚀 Deploy မလုပ်ခင် **မဖြစ်မနေ** လုပ်ရမည့်အရာ

Render dashboard ➜ Environment မှာ အောက်ပါတို့ ထည့်ပါ:

| Key | တန်ဖိုး | ဘာကြောင့် |
|---|---|---|
| `DATABASE_URL` | Neon Postgres URL | **ledger မပျောက်အောင် (အရေးအကြီးဆုံး)** |
| `ADMIN_EMAIL` | သင့် email | built-in တန်ဖိုး မသုံးရန် |
| `ADMIN_PASSWORD` | ခိုင်ခံ့သော password | ကုဒ်ထဲက default ကို အစားထိုးရန် |
| `TELEGRAM_BOT_TOKEN` | bot token | recovery + support |

`DATABASE_URL` မထည့်နိုင်ရင် အနည်းဆုံး Render disk တစ်ခု mount လုပ်ပြီး
`DATA_DIR=/var/data` လို့ သတ်မှတ်ပါ။ ဒါမှမဟုတ်ရင် **deploy တိုင်း data အကုန် ပျောက်ပါမယ်**။

2FA ဖွင့်ချင်ရင်: `npm run admin:2fa` ➜ QR scan ➜ `ADMIN_TOTP_SECRET` ကို env ထဲထည့်။
