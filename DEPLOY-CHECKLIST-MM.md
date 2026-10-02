# TradingWorld — တင်မယ့်အခါ စစ်ရမယ့် စာရင်း (URL မပြောင်းဘဲ)

## ၀။ ဒေတာ အခြေအနေ — **စစ်ဆေးပြီး၊ ပျောက်စရာ မရှိပါ** ✅

Neon Console ကနေ အတည်ပြုပြီး —

| အချက် | တွေ့ရှိချက် |
|---|---|
| Neon project | သင့် Neon project / branch `production` / `neondb` |
| Table | **`tw_store`** (`id integer`, `data jsonb`, `updated_at timestamptz`) |
| ဒေတာ ရှိရာနေရာ | Render ဖိုင်စနစ် **မဟုတ်** — Postgres ထဲ |

ဒါကြောင့် ကုဒ်အသစ်ကို —
- Table/column အမည် **`tw_store` · `data`** အတိုင်း ကိုက်အောင် ပြင်ပြီးပြီ
- Neon URL ရဲ့ `sslmode=require` / `channel_binding=require` ကြောင့် ချိတ်မရတတ်တာကိုလည်း ပြင်ပြီးပြီ
- ဆိုလိုတာက **deploy တင်တာနဲ့ ရှိပြီးသား user/balance အားလုံးကို တိုက်ရိုက် ဆက်သုံးမယ်** — import / migration **မလိုပါ**

**Postgres အစစ်နဲ့ စမ်းသပ်ပြီးသား** (ဤ workspace မှာ Postgres 17 တင်၊ ခင်ဗျား schema အတိအကျ တူအောင်ဆောက်ပြီး run) —

| စမ်းသပ်ချက် | ရလဒ် |
|---|---|
| ရှိပြီးသား user ၃ ယောက်၊ balance၊ KYC၊ deposit ဖတ်နိုင်မှု | ✅ `loaded from database: 3 users` |
| Password အဟောင်း (plain text) နဲ့ login | ✅ ဝင်နိုင်၊ scrypt hash အလိုအလျောက်ပြောင်း |
| Admin က balance ပြင် ➜ Postgres ထဲ သိမ်း | ✅ `1000 → 1234.56` |
| Wallet login ➜ UID အသစ် 700104 ➜ Postgres ထဲ သိမ်း | ✅ |
| ဒေတာအဟောင်း ပျက်စီးမှု | ✅ မရှိ |

> **Backup** ယူထားချင်ရင် (မလိုအပ်ပေမယ့် စိတ်ချရအောင်) — Neon Console ➜ SQL Editor:
> ```sql
> select data from tw_store where id=1;
> ```
> ရလာတဲ့ JSON ကို ဖိုင်အဖြစ် သိမ်းထားပါ။ Neon မှာ **branch/restore** လုပ်စရာလည်း ရှိပါတယ်။

---

## ၀.၅။ Live code နဲ့ ကိုက်ညီမှု — စစ်ဆေးပြီး ✅

Live bundle (`App-CSB5sQ3g.js`) ကို ဒေါင်းပြီး ကျွန်တော့် build နဲ့ **စာသားအားလုံး အလိုအလျောက် နှိုင်းယှဉ်** ထားပါတယ် —

| | အရေအတွက် |
|---|---|
| Live မှာ ရှိတဲ့ စာသား | 763 |
| ကုဒ်အသစ်မှာ ရှိတဲ့ စာသား | **965** |
| Live မှာပါပြီး အသစ်မှာ မပါတာ | wallet card စာသား + CSS class အနည်းငယ်သာ (feature မကျန်) |

➜ **ကုဒ်အသစ်က live ရဲ့ superset** ဖြစ်ပါတယ်။ ဆုံးရှုံးမယ့် feature မရှိပါ။

Live နဲ့ ကိုက်အောင် ထပ်ပြင်ထားတာ —

| အရာ | Live | ကုဒ်အသစ် |
|---|---|---|
| User token key | `co_token` | ✅ `co_token` |
| Admin token key | `co_admin_token` | ✅ `co_admin_token` |
| User cache key | `tradingworld_user` | ✅ `tradingworld_user` |
| HTTP header | `x-tw-token` / `x-tw-admin` | ✅ အတူတူ |
| Postgres | `tw_store(data)` | ✅ အတူတူ |

➜ ဒါကြောင့် **လက်ရှိ login ဝင်ထားသူတွေ session မပြုတ်ပါ**။

---

## ၁။ URL မပြောင်းအောင် — အရေးအကြီးဆုံး ၃ ချက်

| အချက် | အခြေအနေ |
|---|---|
| Render **service အသစ် မဖွင့်ရ** — ရှိပြီးသား service ကိုပဲ redeploy လုပ်ပါ | ✅ URL မပြောင်း |
| `render.yaml` ထဲက service name ကို **`tradingworld`** လို့ ပြင်ပြီးပြီ (အရင် `tradingworld` — Blueprint သုံးရင် service အသစ်ဖြစ်ပြီး URL ပြောင်းသွားနိုင်) | ✅ ပြင်ပြီး |
| Admin route `/super-secret-admin-700` ကို မထိပါ (`vite.config.js`, `server-prod.mjs`, `netlify.toml`, `vercel.json` အားလုံး တူညီ) | ✅ တူညီ |

> Render service ကို dashboard ကနေ လက်နဲ့ဖွင့်ထားတာဆိုရင် `render.yaml` ကို လုံးဝ အသုံးမပြုပါဘူး —
> အဲဒီအခါ ဖျက်ပစ်လည်း ရပါတယ်။ Blueprint သုံးထားရင်တော့ အထက်က နာမည်က အရေးကြီးပါတယ်။

---

## ၂။ တင်နည်း (GitHub ➜ Render auto-deploy)

1. **`TradingWorld-deploy-ROOT.zip`** ကို သုံးပါ — ဖိုင်တွေက zip ရဲ့ **အပြင်ဆုံးအလွှာ**မှာ ရှိပါတယ်
   (folder တစ်ထပ် ပိုမပါလို့ repo root ထဲ တိုက်ရိုက် ထည့်လို့ရ)။
2. ရှိပြီးသား repo ထဲက **အောက်ပါဖိုင်များကို အသစ်နဲ့ အစားထိုး** ပါ —
   `src/App.jsx` · `src/index.css` · `src/main.jsx` · `src/admin-main.jsx` ·
   `server/ledger.mjs` · `server-prod.mjs` · `vite.config.js` · `index.html` ·
   `super-secret-admin-700.html` · `package.json` · `package-lock.json` ·
   `Dockerfile` · `render.yaml` · `netlify.toml` · `vercel.json` · `scripts/admin-2fa.mjs` (အသစ်)
3. `git add -A && git commit -m "admin panel + web3 wallet login" && git push`
4. Render က အလိုအလျောက် build လုပ်ပါလိမ့်မယ် (`npm ci && npm run build` ➜ `npm start`)။

> `data/` folder ကို repo ထဲ **မတင်ပါနှင့်** (`.gitignore` မှာ ထည့်ပြီးသား) — live ဒေတာကို ဖျက်မိနိုင်ပါတယ်။

---

## ၃။ Render Dashboard မှာ ထည့်ရမယ့် Environment Variables

```
ADMIN_EMAIL     = mglwanwai19900@gmail.com
ADMIN_PASSWORD  = (အသစ်တစ်ခု ★ ကုဒ်ထဲက default ကို မသုံးပါနှင့်)
DATABASE_URL    = postgresql://…neon.tech/…   ← Neon သုံးရင် ဒါတစ်ခုတည်းနဲ့ ရပြီ
#DATA_DIR       = /var/data        ← Neon မသုံးဘဲ disk သုံးမှသာ
OTP_SECRET      = (ကြိုက်ရာ ရှည်ရှည် string တစ်ခု)
```

Optional:
```
ADMIN_PASSWORD_HASH   # npm run admin:2fa မှ ရတဲ့ scrypt hash (password ကို ကုဒ်ထဲမထားချင်ရင်)
ADMIN_TOTP_SECRET     # Google Authenticator 6 လုံးကုဒ် တောင်းချင်ရင်
DATABASE_URL          # Neon Postgres — disk မရှိရင် ဒါက အကောင်းဆုံး
TELEGRAM_BOT_TOKEN / TELEGRAM_BOT_USERNAME / PUBLIC_URL
```

**မထည့်ရင် ဘာဖြစ်လဲ** — server စတက်ချိန်မှာ log ထဲ သတိပေးစာ ထွက်ပါလိမ့်မယ်:
- `ADMIN_PASSWORD is not set …` ➜ ကုဒ်ထဲက default password အလုပ်လုပ်နေတယ် (repo public ဆို အန္တရာယ်)
- `neither DATA_DIR nor DATABASE_URL is set …` ➜ **deploy တိုင်း user/balance ဒေတာ ပျောက်မယ်**

---

## ၃.၅။ Neon Postgres (ခင်ဗျား လက်ရှိ အခြေအနေ — အတည်ပြုပြီး)

- `DATABASE_URL` က Render မှာ **ထည့်ပြီးသား** (live site က Neon ကို တကယ်သုံးနေတယ်)
- ကုဒ်အသစ်က **တူညီတဲ့ table `tw_store`** ကိုပဲ ဖတ်/ရေးမယ် ➜ ဒေတာ ဆက်တိုက် သွားမယ်
- Neon ချို့ယွင်းရင် site မကျဘဲ ဖိုင်ပေါ်မှာ ဆက်ပြေး၊ ၃၀ စက္ကန့်ခြား retry
- Deploy ပြီးရင် Render **Logs** မှာ ဒါကို ရှာပါ:
  ```
  [ledger] loaded from database: N users      ← N က ခင်ဗျား user အရေအတွက်
  ```
  `did not connect` ပြရင်သာ ပြဿနာ (အဲဒီအခါ ပြောပါ)။
- **DATA_DIR / disk မလိုပါ**

---

## ၄။ ဒေတာ (အရေးကြီး)

- ဖိုင်အမည်တွေ အရင်အတိုင်းပဲ — `data/db.json`, `data/db.bak.json`, `tw-ledger.json`။
  ဒါကြောင့် **disk မှာ ရှိပြီးသား ဒေတာကို ဆက်ဖတ်** ပါတယ်၊ migration မလိုပါ။
- User password တွေ plain text ဖြစ်နေရင် **ပထမဆုံး login ဝင်တာနဲ့ scrypt hash အလိုအလျောက် ပြောင်း** ပေးတယ် —
  ဘယ်သူမှ login ဝင်လို့မရ ဖြစ်စရာ မရှိပါ။
- လက်ရှိ service မှာ disk မရှိသေးရင် — Render ➜ Settings ➜ **Disks** ➜ Add Disk
  (mount path `/var/data`, 1 GB) ➜ `DATA_DIR=/var/data`။ Free plan မှာ disk မရပါ၊
  အဲဒီအခါ **Neon Postgres** အခမဲ့ ယူပြီး `DATABASE_URL` ထည့်တာ အကောင်းဆုံးပါ။

---

## ၅။ တင်ပြီးရင် စစ်ရမယ့် ၆ ချက်

1. `https://tradingworld.onrender.com` ➜ ပွင့်ရမယ် (emerald ဒီဇိုင်း အတိုင်း)
2. `…/super-secret-admin-700` ➜ **Operator console** login ပေါ်ရမယ်
3. Admin login ➜ tab ၈ ခု (Registration … Account recovery, Audit log)
4. `https://tradingworld.onrender.com/api/store` ကို browser မှာ ဖွင့်ကြည့် ➜
   **users စာရင်း မပေါ်ရ** (`"users":[]` သာ) = လုံခြုံရေး အလုပ်လုပ်နေပြီ
5. အကောင့်အသစ် register ➜ admin panel မှာ UID ချက်ချင်း မြင်ရမယ်
6. Wallet page ➜ **Web3 wallet** ကတ် · Login page ➜ **or continue with your wallet** ပေါ်ရမယ်

---

## ၆။ ကျန်နေသေးတာ (ချက်ချင်း မလိုအပ်)

- **WalletConnect QR** (ဖုန်း wallet 500+) — reown.com Project ID လိုတယ်
- Smart-contract wallet (Safe စသည်) ရဲ့ EIP-1271 signature — RPC provider လိုတယ်
- Solana / TON native login — signature စစ်နည်း သီးခြားလိုတယ်

လိုချင်ရင် ပြောပါ၊ ထပ်ထည့်ပေးပါမယ်။
