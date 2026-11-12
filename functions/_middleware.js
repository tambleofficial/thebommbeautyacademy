// 관리자에서 바꾼 내용(content/*.json)을 페이지에 넣어주는 클라우드플레어 미들웨어.
// window.__CMS = { text, media } 로 넣고, /assets/sj-cms.js 가 화면에 반영합니다.
// 바꾼 문구는 서버에서도 미리 바꿔서 보내 검색엔진이 새 문구를 읽을 수 있게 합니다(글자 하나로 된 단순 문구만).
const FILES = ['text', 'media'];
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function loadCms(ctx, url) {
  const data = {};
  await Promise.all(FILES.map(async (name) => {
    try {
      const r = await ctx.env.ASSETS.fetch(new URL('/content/' + name + '.json', url));
      if (r.ok) data[name] = await r.json();
    } catch (e) { /* 파일이 없으면 건너뜀 */ }
  }));
  return data;
}

export function inject(html, data, extraHead = '', serverText = true) {
  const T = serverText ? ((data.text && data.text.t) || {}) : {};
  for (const [from, to] of Object.entries(T)) {
    if (!from || from.includes('\n') || to.includes('\n') || from.length < 2) continue;
    html = html.split('>' + esc(from) + '<').join('>' + esc(to) + '<');
  }
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return html.replace(/<head>/i, (m) => m + extraHead + '<script>window.__CMS=' + json + ';</script>');
}

export async function onRequest(ctx) {
  const url = new URL(ctx.request.url);
  const p = url.pathname;
  if (p.startsWith('/edit') || p.startsWith('/api/') || p.startsWith('/assets/') || p.startsWith('/content/')) return ctx.next();
  const res = await ctx.next();
  const type = res.headers.get('content-type') || '';
  if (!type.includes('text/html') || p.endsWith('.dc.html') || res.status !== 200) return res;
  const data = await loadCms(ctx, url);
  const html = inject(await res.text(), data);
  const headers = new Headers(res.headers);
  headers.delete('content-length');
  headers.delete('etag');
  return new Response(html, { status: res.status, headers });
}
