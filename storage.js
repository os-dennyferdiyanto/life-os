function seed(){return{w:{},sal:{},sd:{},mu:{},mood:{},set:{},jobs:[],habits:[{n:'Dzikir Pagi',f:'Daily',h:{}},{n:'Tilawah',f:'Daily',h:{}},{n:'Shalat Dhuha',f:'Daily',h:{}}],goals:[],q:{s:1,a:0,hist:[]}}}
let S;try{S=JSON.parse(localStorage.getItem('plos'))}catch(e){}S=S||seed();
const save=()=>{try{S._ts=Date.now();localStorage.setItem('plos',JSON.stringify(S))}catch(e){}if(typeof syncSoon=='function')syncSoon()};
const W=d=>S.w[d]||(S.w[d]={}),SL=d=>S.sal[d]||(S.sal[d]={});

