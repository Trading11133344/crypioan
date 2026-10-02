# CryptOrion — Admin Panel + Web3 Wallet Connect ထည့်သွင်းမှု မှတ်တမ်း

**ရက်စွဲ:** 2026-09-30 · **အခြေခံ:** `TradingWorld-Web3-2026-09-29.zip` ရဲ့ admin + wallet စနစ်ကို
`CryptOrion-render-deploy.zip` (cryptonion.onrender.com) အပေါ်ကို အပြည့်အဝ ပေါင်းစပ်ထားပါတယ်။

CryptOrion ရဲ့ **အရောင်/ဒီဇိုင်း/နာမည်/လိုဂို (emerald #00d897)** အားလုံး မူရင်းအတိုင်း ရှိနေပါတယ် —
`src/index.css` က CryptOrion မူရင်းဖိုင်နဲ့ **ဗိုက်တူညီ (byte-identical)** ဖြစ်ကြောင်း စစ်ဆေးပြီးပါပြီ။

---

## ၁။ အသစ်ရလာတဲ့ Admin Panel (`/super-secret-CryptOrion-System`)

URL မပြောင်းပါ။ Login email/password လည်း အတူတူပါပဲ —
`CryptOrionSystem700@gmail.com` / `Aa123123##` (env နဲ့ ပြောင်းလို့ရပါတယ်၊ အောက်တွင်ကြည့်ပါ)။

| အရာ | အရင် CryptOrion | ယခု (TradingWorld မှ ပေါင်းထည့်) |
|---|---|---|
| Login စစ်ဆေးမှု | Browser ထဲမှာပဲ စစ် (`if(email===...)`) — ကုဒ်ထဲက password ကို ဘယ်သူမဆို ဖတ်နိုင် | **Server-side** `adminLogin` + token (`x-tw-admin`) |
| Brute force | မရှိ | **Throttle** — ၁၅ မိနစ်အတွင်း ၅ ကြိမ်ထက်ပို ➜ 429 |
| 2FA | မရှိ | **TOTP (Google Authenticator) optional** — `npm run admin:2fa` |
| `/api/store` | **အများပြည်သူ ဖတ်လို့ရ** (users, email, balance အားလုံး ပေါက်ကြား) | Token ရှိမှသာ user data ပြ၊ anonymous ➜ cfg သာ |
| Tabs | ၇ ခု | **၈ ခု** — `Account recovery` တိုးလာ |
| Registration tab | UID/Email/Status/Online | + **Device/IP · Telegram · Recovery · KYC** ကော်လံများ |
| Settlement | account default | + **per-order override** (`setOrderTier` / `setPxTier`) |
| Support | conversation | + **callback requests** စီမံခန့်ခွဲမှု |
| Audit | အခြေခံ | login fail, wallet connect fail, admin throttle အားလုံး မှတ်တမ်းတင် |

**User password များ:** အရင်က plain text သိမ်းထားတာကို ယခု **scrypt hash** ပြောင်းထားပါတယ်။
စိုးရိမ်စရာမရှိပါ — `isLegacyPw()` ပါဝင်လို့ ရှိပြီးသား user တွေ နောက်တစ်ကြိမ် login ဝင်တာနဲ့
သူတို့ password ကို အလိုအလျောက် hash အဖြစ် အဆင့်မြှင့်ပေးပါတယ်။ **Data ပျက်စီးမှု မရှိပါ။**

---

## ၂။ Web3 Wallet Connect (အသစ်)

Wallet စာမျက်နှာအောက်ခြေမှာ **"Web3 wallet"** ကတ် အသစ် ပါလာပါပြီ။

### ၂.၁ Wallet မည်သည့်အမျိုးအစားမဆို ချိတ်နိုင် (EIP-6963)

MetaMask ကို hard-code မလုပ်တော့ပါ။ **EIP-6963 standard** သုံးထားလို့ user ရဲ့ device မှာ
တကယ်ရှိနေတဲ့ wallet အားလုံးက ကိုယ့်ဘာသာ ကြေညာလာပြီး **list အဖြစ် အိုင်ကွန်နဲ့တကွ** ပေါ်ပါတယ် —
တစ်ချက်နှိပ်ရုံနဲ့ ချိတ်ဆက်ပြီး။

- MetaMask · Trust · OKX · Coinbase · Binance · Rabby · Brave · Bitget · SafePal · TokenPocket · Zerion · Phantom(EVM) · Exodus … **အကုန်လုံး**
- Wallet အသစ်တစ်ခု ထွက်လာလည်း **ကုဒ်ပြင်စရာမလို** — standard အတိုင်း ကြေညာရင် အလိုအလျောက် ပေါ်လာမယ်
- Extension နှစ်ခုသုံးခု တစ်ပြိုင်နက်ရှိရင် **ဘယ်ဟာသုံးမလဲ ရွေးခိုင်း** (အရင်က conflict ဖြစ်တတ်)
- Wallet app ရဲ့ in-app browser (Trust/OKX/Binance/imToken) ကနေဖွင့်ရင်လည်း အလုပ်လုပ် — `window.ethereum` fallback + `providers[]` array ကိုပါ ဖတ်
- **Scan again** ခလုတ် — wallet ကို နောက်မှ unlock လုပ်တာမျိုးအတွက်
- **Connect TronLink (TRC20)** — TronLink ရှိမှသာ ပေါ်မယ်

### ၂.၂ Wallet app ရဲ့ ကိုယ်ပိုင် browser ကနေ ဝင်လာခြင်း (ဖုန်းအတွက် အကောင်းဆုံးလမ်း)

ဖုန်းမှာ extension မရှိလို့ wallet မတွေ့ရင် **"Open CryptOrion in a wallet app browser"** အပိုင်း ပေါ်လာပါတယ် —
wallet နာမည်တစ်ခု နှိပ်လိုက်တာနဲ့ **deep link** နဲ့ အဲဒီ wallet app ရဲ့ in-app browser ထဲမှာ
CryptOrion ပြန်ပွင့်ပြီး wallet က အလိုအလျောက် list ထဲ ရောက်လာပါတယ်။

| Wallet | Deep link |
|---|---|
| MetaMask | `metamask.app.link/dapp/…` |
| Trust Wallet | `link.trustwallet.com/open_url?…` |
| Coinbase Wallet | `go.cb-w.com/dapp?cb_url=…` |
| OKX Wallet | `okx://wallet/dapp/url?…` |
| Bitget Wallet | `bkcode.vip?action=dapp&url=…` |
| TokenPocket | `tpdapp://open?params=…` |
| imToken | `imtokenv2://navigate/DappView?url=…` |
| Phantom | `phantom.app/ul/browse/…` |
| TronLink | `tronlinkoutside://pull.activity?…` |

- **Copy this page link** ခလုတ်လည်း ပါတယ် — စာရင်းထဲမပါတဲ့ wallet ဖြစ်ရင် link ကို copy ယူပြီး
  ကိုယ့် wallet app ရဲ့ browser မှာ paste လုပ်ရုံပါပဲ (**wallet browser မှန်သမျှ အလုပ်လုပ်**)။
- Wallet app ထဲကနေ ဝင်လာပြီဆိုရင် အပေါ်မှာ **"Trust Wallet browser detected"** လို banner ပြပြီး
  ချိတ်ဖို့ တစ်ချက်နှိပ်ရုံပဲ ကျန်တော့တယ်။
- UA detection စမ်းပြီး: Trust · MetaMask · OKX · TokenPocket · imToken · Bitget · SafePal ·
  Coinbase · Phantom · Binance · TronLink ✅ (desktop/ဖုန်း သာမန် browser မှာ မပေါ်)

> **WalletConnect QR** (ဖုန်းထဲက wallet 500+) ကို နောက်မှ ထည့်လို့ရပါတယ် —
> reown.com မှာ Project ID တစ်ခု ယူပြီး ပြောပါ၊ ချက်ချင်း ပေါင်းထည့်ပေးပါမယ်။

### ၂.၃ လုံခြုံရေး လုပ်ငန်းစဉ်

လုံခြုံရေး လုပ်ငန်းစဉ် (signature challenge):

1. `walletChallenge` ➜ server က တစ်ကြိမ်သာသုံးလို့ရတဲ့ **nonce message** ထုတ်ပေး (၁၀ မိနစ် သက်တမ်း)
2. User က wallet ထဲမှာ `personal_sign` / `signMessageV2` နဲ့ **လက်မှတ်ထိုး** (gas မကုန်၊ ငွေမလွှဲ၊ ခွင့်ပြုချက်မပေး)
3. `walletConnect` ➜ server က `ethers` နဲ့ **address ကို ပြန်တွက်ထုတ်** ပြီး ကိုက်မှသာ လက်ခံ

စမ်းသပ်ပြီးသား (ဤ workspace တွင် အမှန်တကယ် run ထားသည်):

| စမ်းသပ်ချက် | ရလဒ် |
|---|---|
| signature မှန် ➜ wallet ချိတ် | ✅ ချိတ်ဆက်အောင်မြင် |
| တူညီတဲ့ signature ပြန်သုံး (replay) | ✅ ပိတ်ဆို့ — "Verification expired" |
| တခြား wallet ရဲ့ signature | ✅ ပိတ်ဆို့ — "signature does not match" |
| တခြား UID မှာ ချိတ်ပြီးသား wallet | ✅ ပိတ်ဆို့ — "already linked to another account" |
| Disconnect | ✅ အလုပ်လုပ် |
| EIP-6963 wallet ၃ ခု ကြေညာ | ✅ ၃ ခုလုံး တွေ့၊ ထပ်နေတာ ဖယ် |
| ပုံစံမမှန်တဲ့ ကြေညာချက် | ✅ လျစ်လျူရှု (crash မဖြစ်) |
| `window.ethereum.providers[]` (in-app browser) | ✅ Trust / Coinbase / Bitget အမည်များ မှန်ကန်စွာ ဖော်ပြ |
| Wallet လုံးဝမရှိ | ✅ လမ်းညွှန်စာသား ပြ (error မဖြစ်) |

Admin panel ရဲ့ Registration tab မှာ ဘယ် UID က ဘယ် wallet ချိတ်ထားလဲ မြင်ရပါတယ်။

---

## ၃။ Wallet Login စနစ် (အသစ် — Sign-In With Wallet)

Login / Register စာမျက်နှာမှာ **"or continue with your wallet"** အပိုင်း ထပ်ပါလာပါပြီ။
Email/password မလိုဘဲ **wallet တစ်ခုတည်းနဲ့ အကောင့်ဖွင့် + ဝင်** လို့ရပါပြီ။

**လုပ်ငန်းစဉ်**
1. Device မှာရှိတဲ့ wallet အားလုံး (EIP-6963) list ပေါ် ➜ "Continue with MetaMask" စသဖြင့် တစ်ချက်နှိပ်
2. Server က `walletLoginChallenge` ➜ တစ်ကြိမ်သာသုံးလို့ရတဲ့ nonce message (၁၀ မိနစ်)
3. Wallet မှာ လက်မှတ်ထိုး ➜ `walletLogin` ➜ server က address ပြန်တွက်ပြီး စစ်
4. အဲဒီ wallet နဲ့ **အကောင့်ရှိပြီးသားဆို ➜ ဝင်**၊ **မရှိသေးရင် ➜ UID အသစ် အလိုအလျောက်ဖွင့်** (`walletOnly:true`)

**အရေးကြီးသော အချက်များ**
- Email နဲ့ဖွင့်ထားတဲ့ user က Wallet page မှာ wallet ချိတ်ပြီးရင် **နောက်ပိုင်း အဲဒီ wallet နဲ့ပဲ ဝင်လို့ရ** (UID တူတူ၊ အကောင့်အသစ် မဖြစ်)
- Wallet အသစ်ဖွင့်တဲ့ user တွေက **status = pending** ဖြစ်လို့ admin က approve လုပ်မှ trade/deposit/withdraw ရ (email user တွေနဲ့ အတူတူ)
- Admin panel မှာ email မရှိတဲ့ account တွေကို **`wallet · 0x1234…abcd`** အဖြစ် ပြပေးတယ်
- Nonce က **တစ်ကြိမ်သာ** သုံးလို့ရ၊ signature လိမ်လို့မရ၊ IP အလိုက် throttle (၁၅ မိနစ်/၂၀ ကြိမ်)
- TronLink ရှိရင် **"Continue with TronLink"** ခလုတ်ပါ ပေါ်တယ်
- Wallet မတွေ့ရင် wallet app browser deep link တွေ + "Scan again" ပေါ်တယ်

**စမ်းသပ်ပြီးသား (server အမှန်တကယ် run ပြီး ethers နဲ့ လက်မှတ်ထိုးစမ်း)**

| စမ်းသပ်ချက် | ရလဒ် |
|---|---|
| Wallet အသစ် ➜ UID အသစ် (700102) ဖွင့်၊ token ရ | ✅ |
| တူညီတဲ့ wallet ပြန်ဝင် ➜ UID တူတူ (အသစ်မဖွင့်) | ✅ |
| နောက် wallet တစ်ခု ➜ UID တခြားတစ်ခု | ✅ |
| သူများ signature အတု | ✅ ပိတ်ဆို့ |
| Nonce replay | ✅ ပိတ်ဆို့ |
| Token နဲ့ ကိုယ့်ဒေတာသာ ဖတ်ရ | ✅ (သူများ user မမြင်ရ) |
| Email account + wallet ချိတ်ပြီး wallet login | ✅ UID တူတူ ပြန်ရ |
| Admin panel မှာ wallet account မြင်ရ | ✅ |

## ၄။ နောက်ထပ် ပါလာတဲ့ အရာများ

- **Account recovery** — Telegram OTP နဲ့ account ပြန်ရယူခြင်း (`recoverStart` / `verifyRecovery` / `recoverRelease`)
- **Telegram support bridge** — bot နဲ့ support chat ချိတ်ဆက်
- **Session token** — user login မှာလည်း `x-tw-token` သုံးပြီး API ကို ကာကွယ်
- **Neon Postgres** support — `DATABASE_URL` ထည့်ရင် file အစား database မှာ သိမ်း (Render restart လုပ်လည်း data မပျောက်)
- **`render.yaml`** — persistent disk (`/var/data`) + env var အားလုံး ပါပြီးသား
- `scripts/admin-2fa.mjs` — password hash နဲ့ TOTP secret ထုတ်ပေးတဲ့ tool

---

## ၅။ Render မှာ Deploy လုပ်နည်း

လက်ရှိ service က Docker သုံးနေရင် `Dockerfile` အတိုင်းပဲ ဆက်သွားလို့ရပါတယ်။
Environment variables တွေကိုတော့ Render dashboard မှာ ထည့်ပေးပါ —

```
ADMIN_EMAIL     = CryptOrionSystem700@gmail.com      # မထည့်လည်း default အတူတူ
ADMIN_PASSWORD  = Aa123123##                          # ★ ပြောင်းဖို့ အထူးအကြံပြုပါတယ်
DATA_DIR        = /var/data                           # persistent disk လမ်းကြောင်း
OTP_SECRET      = (generate)                          # recovery OTP လက်မှတ်ထိုးရန်
```

Optional —
```
ADMIN_PASSWORD_HASH   # npm run admin:2fa မှ ရသော scrypt hash (ADMIN_PASSWORD အစား)
ADMIN_TOTP_SECRET     # 6-digit authenticator code တောင်းချင်ရင်
DATABASE_URL          # Neon Postgres (disk မရှိရင် ဒါကို သုံးပါ)
TELEGRAM_BOT_TOKEN / TELEGRAM_BOT_USERNAME / PUBLIC_URL
```

> **သတိ:** disk (သို့) `DATABASE_URL` မထားရင် Render ရဲ့ file system က ephemeral ဖြစ်လို့
> deploy တိုင်း user/balance data ပျောက်ပါလိမ့်မယ်။

Build / Start:
```
npm ci && npm run build
npm start          # server-prod.mjs, PORT env ကို နာခံသည်
```

---

## ၆။ စမ်းသပ်ပြီးသား (production build ဖြင့်)

```
vite build            ✅ 1886 modules, error မရှိ
/                     ✅ 200
/super-secret-CryptOrion-System   ✅ 200
adminLogin (မှားသော)   ✅ 401 Access denied
adminLogin (မှန်သော)   ✅ token ရရှိ
register → UID         ✅ 700101
/api/store anonymous   ✅ user data မပြ
/api/store + token     ✅ အပြည့်အစုံ ပြ
wallet connect flow    ✅ အထက်ပါ ဇယားအတိုင်း
```
