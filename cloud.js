/* Sinkronisasi (GitHub secret gist + enkripsi AES-GCM) dan export CSV */
const GH='https://api.github.com',enc=new TextEncoder();
const gh=(p,o)=>fetch(GH+p,Object.assign({cache:'no-store'},o,{headers:{Authorization:'token '+localStorage.getItem('plos-gt'),Accept:'application/vnd.github+json','Content-Type':'application/json'}})).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json()});
const b64=b=>{let s='';new Uint8Array(b).forEach(x=>s+=String.fromCharCode(x));return btoa(s)},ub64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function ckey(salt){const k=await crypto.subtle.importKey('raw',enc.encode(localStorage.getItem('plos-pp')||''),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:150000,hash:'SHA-256'},k,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
async function seal(o){const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),c=await crypto.subtle.encrypt({name:'AES-GCM',iv},await ckey(salt),enc.encode(JSON.stringify(o)));return JSON.stringify({v:1,ts:o._ts||0,s:b64(salt),i:b64(iv),c:b64(c)})}
async function unseal(t){const j=JSON.parse(t),p=await crypto.subtle.decrypt({name:'AES-GCM',iv:ub64(j.i)},await ckey(ub64(j.s)),ub64(j.c));return JSON.parse(new TextDecoder().decode(p))}
async function findGist(){let id=localStorage.getItem('plos-gid');if(id)return id;const l=await gh('/gists?per_page=100'),g=l.find(x=>x.files&&x.files['life-os.json']);if(g){localStorage.setItem('plos-gid',g.id);return g.id}return null}
async function pullGist(id){const g=await gh('/gists/'+id),f=g.files['life-os.json'];return f.truncated?await(await fetch(f.raw_url)).text():f.content}
async function pushGist(id){return gh('/gists/'+id,{method:'PATCH',body:JSON.stringify({files:{'life-os.json':{content:await seal(S)}}})})}
async function syncNow(quiet){if(!localStorage.getItem('plos-gt'))return;try{const id=await findGist();
if(!id){const g=await gh('/gists',{method:'POST',body:JSON.stringify({description:'Personal Life OS',public:false,files:{'life-os.json':{content:await seal(S)}}})});localStorage.setItem('plos-gid',g.id)}
else{const t=await pullGist(id),r=JSON.parse(t).ts||0,l=S._ts||0;if(r>l){S=await unseal(t);localStorage.setItem('plos',JSON.stringify(S));const a=document.activeElement;if(!a||!/INPUT|TEXTAREA|SELECT/.test(a.tagName))render()}else if(r<l)await pushGist(id)}
localStorage.setItem('plos-last',Date.now());if(!quiet)toast('✓ Tersinkron')}catch(e){if(!quiet)toast(e.name=='OperationError'?'Passphrase salah':'Sinkron gagal, cek internet/token')}}
async function connectSync(){const t=val('gtk'),p=val('gpp');if(!t||p.length<6){toast('Isi token dan passphrase (min. 6 karakter)');return}
localStorage.setItem('plos-gt',t);localStorage.setItem('plos-pp',p);localStorage.removeItem('plos-gid');
try{const id=await findGist();if(id){let R;try{R=await unseal(await pullGist(id))}catch(e){throw Object.assign(new Error('pp'),{pp:1})}
if(confirm('Data cloud ditemukan. OK = pakai data cloud di perangkat ini. Batal = timpa cloud dengan data perangkat ini.')){S=R;localStorage.setItem('plos',JSON.stringify(S))}else{S._ts=Date.now()}}
await syncNow(true);toast('✓ Terhubung');render()}catch(e){['plos-gt','plos-pp','plos-gid'].forEach(k=>localStorage.removeItem(k));toast(e.pp?'Passphrase salah':'Token tidak valid atau tidak ada internet')}}
function syncSoon(){if(localStorage.getItem('plos-gt')){clearTimeout(window._st);window._st=setTimeout(()=>syncNow(true),2500)}}
const syncStatus=()=>localStorage.getItem('plos-gt')?'✓ Terhubung'+(localStorage.getItem('plos-last')?' · terakhir '+new Date(+localStorage.getItem('plos-last')).toLocaleString('id-ID'):''):'Belum terhubung';
/* CSV: pemisah titik koma + BOM agar terbuka rapi di Excel (locale Indonesia) dan Google Sheets */
const csv=rows=>'\ufeff'+rows.map(r=>r.map(c=>{c=String(c==null?'':c);return /[";\n\r]/.test(c)?'"'+c.replace(/"/g,'""')+'"':c}).join(';')).join('\r\n');
function dl(n,t){const b=new Blob([t],{type:'text/csv;charset=utf-8'}),u=URL.createObjectURL(b),l=document.createElement('a');l.href=u;l.download=n;l.click();setTimeout(()=>URL.revokeObjectURL(u),500)}
const isD=k=>/^\d{4}-\d\d-\d\d$/.test(k);
const CSVS={
ibadah:()=>{const r=[['Tanggal','Ibadah','Selesai']],ds=[...new Set([...Object.keys(S.w),...Object.keys(S.sal)])].filter(isD).sort();ds.forEach(d=>{const w=S.w[d]||{},s=S.sal[d]||{};SALAT.forEach(p=>r.push([d,'Shalat '+p,s[p]?'Ya':'Tidak']));WS.forEach(x=>r.push([d,x[1],w[x[0]]?'Ya':'Tidak']));OTH.forEach(o=>r.push([d,o,w['o'+o]?'Ya':'Tidak']));if(S.sd[d]&&S.sd[d].nt)r.push([d,'Catatan Sedekah Subuh',S.sd[d].nt])});return r},
tilawah:()=>[['Tanggal','Surah','Ayat dari','Ayat sampai']].concat(S.q.hist.map(h=>[h.iso||h.d,h.s,h.a,h.b])),
habit:()=>{const r=[['Habit','Frekuensi','Tanggal selesai']];S.habits.forEach(h=>Object.keys(h.h).sort().forEach(d=>r.push([h.n,h.f,d])));return r},
photobooth:()=>[['Client','Event','Tanggal','Mulai','Selesai','Lokasi','Paket','Kontak','Status','Catatan']].concat(S.jobs.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(j=>[j.client,j.ev,j.date,j.s,j.e,j.loc,j.pkg,j.ct,j.st,j.nt])),
goals:()=>[['Judul','Kategori','Deskripsi','Deadline','Progres','Target','Satuan']].concat(S.goals.map(g=>[g.t,g.cat,g.desc,g.dl,g.cur,g.tot,g.u])),
muhasabah:()=>[['Tanggal','Disyukuri','Dilakukan dengan baik','Perlu diperbaiki','Target besok','Mood']].concat(Object.keys(S.mu).filter(isD).sort().map(d=>[d,...[0,1,2,3].map(i=>S.mu[d][i]),S.mood[d]==null?'':MOODS[S.mood[d]]]))};
