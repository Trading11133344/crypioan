/* Generate operator credentials: TOTP secret + password hash.
   Usage:  node scripts/admin-2fa.mjs [newAdminPassword]            */
import{randomBytes,scryptSync,createHmac}from'node:crypto';

const A='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const raw=randomBytes(20);
let bits=0,val=0,secret='';
for(const byte of raw){val=(val<<8)|byte;bits+=8;while(bits>=5){secret+=A[(val>>>(bits-5))&31];bits-=5}}
if(bits>0)secret+=A[(val<<(5-bits))&31];

const issuer='TradingWorld';
const account=process.env.ADMIN_EMAIL||'operator';
const url=`otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&period=30&digits=6&algorithm=SHA1`;

function b32dec(str){let bits=0,val=0;const out=[];
  for(const c of String(str).toUpperCase().replace(/[^A-Z2-7]/g,'')){const i=A.indexOf(c);if(i<0)continue;
    val=(val<<5)|i;bits+=5;if(bits>=8){out.push((val>>>(bits-8))&255);bits-=8}}
  return Buffer.from(out)}
function totpAt(sec,step){const key=b32dec(sec);const buf=Buffer.alloc(8);
  buf.writeUInt32BE(Math.floor(step/4294967296),0);buf.writeUInt32BE(step>>>0,4);
  const h=createHmac('sha1',key).update(buf).digest();const o=h[h.length-1]&15;
  const n=((h[o]&127)<<24)|((h[o+1]&255)<<16)|((h[o+2]&255)<<8)|(h[o+3]&255);
  return String(n%1000000).padStart(6,'0')}

console.log('\n=== TradingWorld operator 2FA setup ===\n');
console.log('1. Add this to your Render environment:\n');
console.log('   ADMIN_TOTP_SECRET=' + secret + '\n');
console.log('2. Add the account to Google Authenticator / Authy with this URI');
console.log('   (or type the secret above in manually):\n');
console.log('   ' + url + '\n');
console.log('3. Your app should be showing this code right now:  ' + totpAt(secret,Math.floor(Date.now()/30000)));
console.log('   (it rotates every 30 seconds)\n');

const pw=process.argv[2];
if(pw){
  const salt=randomBytes(16);
  const hash='scrypt$'+salt.toString('hex')+'$'+scryptSync(pw,salt,64).toString('hex');
  console.log('4. Password hash for ADMIN_PASSWORD_HASH (then delete ADMIN_PASSWORD):\n');
  console.log('   ADMIN_PASSWORD_HASH=' + hash + '\n');
}else{
  console.log('Tip: pass a password to also print ADMIN_PASSWORD_HASH:');
  console.log('     node scripts/admin-2fa.mjs "your new admin password"\n');
}
