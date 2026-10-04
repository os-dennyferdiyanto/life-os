/* Cadangan lokal: Kota Depok, Okt 2026 (Subuh Terbit Zuhur Asar Maghrib Isya). Sumber utama: Kemenag via MyQuran, diambil saat online. */
const BUNDLED_RAW={'2026-10-01': '0423 0535 1146 1452 1751 1859', '2026-10-02': '0423 0534 1146 1451 1750 1859', '2026-10-03': '0422 0534 1146 1450 1750 1859', '2026-10-04': '0422 0533 1145 1449 1750 1859', '2026-10-05': '0421 0533 1145 1448 1750 1859', '2026-10-06': '0420 0532 1145 1447 1750 1859', '2026-10-07': '0420 0532 1144 1446 1750 1859', '2026-10-08': '0419 0531 1144 1445 1750 1859', '2026-10-09': '0419 0531 1144 1444 1750 1859', '2026-10-10': '0418 0531 1143 1444 1750 1859', '2026-10-11': '0418 0530 1143 1445 1749 1859', '2026-10-12': '0417 0530 1143 1445 1749 1859', '2026-10-13': '0417 0529 1143 1446 1749 1859', '2026-10-14': '0416 0529 1142 1446 1749 1859', '2026-10-15': '0416 0528 1142 1447 1749 1859', '2026-10-16': '0415 0528 1142 1447 1749 1859', '2026-10-17': '0415 0528 1142 1448 1749 1859', '2026-10-18': '0414 0527 1142 1448 1749 1859'};
const BUNDLED={};Object.keys(BUNDLED_RAW).forEach(k=>BUNDLED[k]=BUNDLED_RAW[k].split(" ").map(x=>x.slice(0,2)+":"+x.slice(2)));
const nz=s=>{const a=String(s).split(':');return pad(+a[0])+':'+a[1]};
function refreshPR(){const n=new Date(),d=dk(n);let r=null;PSRC='';
try{const o=JSON.parse(localStorage.getItem('pt-'+n.getFullYear()+'-'+pad(n.getMonth()+1)));if(o&&o[d]){r=o[d];PSRC='live'}}catch(e){}
if(!r&&BUNDLED[d]){r=BUNDLED[d];PSRC='local'}
if(!r){r=BUNDLED[Object.keys(BUNDLED).pop()];PSRC='est'}
PR=[['Fajr',r[0]],['Sunrise',r[1]],['Dhuhr',r[2]],['Asr',r[3]],['Maghrib',r[4]],['Isha',r[5]]]}
const PLBL=()=>PSRC=='live'?'Kemenag via MyQuran':PSRC=='local'?'Data Kemenag (lokal)':'Perkiraan, sambungkan internet untuk jadwal terbaru';
function wtime(id,def){if(S.set&&S.set[id])return S.set[id];const f=k=>mn(PR.find(p=>p[0]==k)[1]),h=m=>pad(Math.floor(m/60))+':'+pad(m%60);
return id=='sd'?PR[0][1]:id=='dp'?h(f('Fajr')+30):id=='dh'?h(f('Sunrise')+20):id=='dpt'?h(f('Asr')+30):def}
async function loadMonth(y,m){const k='pt-'+y+'-'+pad(m);try{if(localStorage.getItem(k))return;let id=localStorage.getItem('pt-id');
if(!id){const r=await(await fetch('https://api.myquran.com/v2/sholat/kota/cari/depok')).json(),c=r.data.find(x=>/depok/i.test(x.lokasi));id=c.id;localStorage.setItem('pt-id',id)}
const r=await(await fetch('https://api.myquran.com/v2/sholat/jadwal/'+id+'/'+y+'/'+pad(m))).json(),o={};
r.data.jadwal.forEach(j=>{const t=String(j.tanggal).match(/(\d+)\/(\d+)\/(\d+)/),key=t?t[3]+'-'+t[2]+'-'+t[1]:j.date;o[key]=[j.subuh,j.terbit,j.dzuhur,j.ashar,j.maghrib,j.isya].map(nz)});
localStorage.setItem(k,JSON.stringify(o));render()}catch(e){}}
function initPrayer(){const n=new Date(),y=n.getFullYear(),m=n.getMonth()+1;loadMonth(y,m);loadMonth(m==12?y+1:y,m==12?1:m+1)}
