const _fetch = (typeof globalThis.fetch === 'function') ? globalThis.fetch : (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function run(){
  console.log('Login test');
  const res = await _fetch('http://localhost:7000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@tourbnb.local', password: 'password123' }),
    credentials: 'include'
  });

  console.log('status', res.status);
  const resJson = await res.json().catch(()=>null);
  console.log('login json:' , resJson);
  if (!resJson || !resJson.accessToken || !resJson.expiresAt) { console.error('Login did not return accessToken/expiresAt'); process.exit(1); }
  const rawCookie = res.headers.get('set-cookie');
  console.log('set-cookie:', rawCookie);

  if (!rawCookie) { console.error('No cookie set'); process.exit(1);} 

  const cookie = rawCookie.split(';').map(p=>p.trim()).slice(0,1).join('; ');
  const me = await _fetch('http://localhost:7000/api/auth/me', { headers: { Cookie: cookie }});
  console.log('/me status', me.status);
  const json = await me.json().catch(()=>({}));
  console.log('me json', json);
}

run().catch(e=>{console.error(e); process.exit(1) });
