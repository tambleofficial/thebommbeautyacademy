// ===== 검색 노출(SEO) 처리 — 탬블 2026-11 =====
// 1) www 주소는 대표 주소로 301  2) 네이버·구글 소유확인 파일은 .html 그대로 200
// 3) 검색로봇에게는 방문자 화면을 미리 그려 둔 seo/*.html 을 보냄(내용 동일)  4) 페이지별 canonical·제목·설명 정리
const SEO_APEX = 'thebommacademy.co.kr';
const SEO_BOT = /Yeti|NaverBot|Googlebot|Google-InspectionTool|AdsBot-Google|Storebot-Google|bingbot|BingPreview|msnbot|Daumoa|Daum|kakaotalk-scrap|Applebot|DuckDuckBot|YandexBot|Baiduspider|Slurp|facebookexternalhit|Twitterbot|LinkedInBot|Pinterest/i;
const SEO_PAGES = {"":{"file":"home","path":"/"},"academy":{"file":"academy","path":"/academy"},"curriculum":{"file":"curriculum","path":"/curriculum"},"caselab":{"file":"caselab","path":"/caselab"},"director":{"file":"director","path":"/director"},"apply":{"file":"apply","path":"/apply"}};
// 페이지별 제목·설명 (비어 있으면 원래 값 유지)
const SEO_META = {
 "": {
  "title": "수원 반영구학원, 더봄뷰티 아카데미 | 눈썹문신 배우기",
  "desc": "수원 팔달 더봄뷰티 아카데미는 눈썹 디자인, 헤어스트록, 입술, 아이라인, SMP, 기존 반영구 수정·복원까지 실제 케이스 중심으로 가르치는 반영구학원입니다."
 },
 "academy": {
  "title": "반영구학원 더봄뷰티 아카데미 소개 | 수원 팔달",
  "desc": "시술 브랜드에서 쌓은 현장 경험을 교육으로 정리한 반영구학원, 더봄뷰티 아카데미를 소개합니다. 수업 운영 원칙과 교육 공간을 확인하세요."
 },
 "curriculum": {
  "title": "눈썹문신 배우기부터 수정·복원까지 6개 과정 | 더봄 아카데미",
  "desc": "눈썹 디자인부터 헤어스트록, 입술, 아이라인, SMP, 수정·복원까지 더봄뷰티 아카데미의 6개 반영구 교육 과정과 수업 방식, 피드백 과정을 안내합니다."
 },
 "caselab": {
  "title": "반영구 실전 케이스 분석 수업 | 더봄뷰티 아카데미",
  "desc": "현장에서 만나는 다양한 얼굴과 기존 작업 상태를 사례로 분석하는 더봄뷰티 아카데미 CASE LAB 수업입니다. 한 케이스를 분석하는 과정을 소개합니다."
 },
 "director": {
  "title": "장형겸 대표원장 | 더봄뷰티 아카데미 반영구 교육",
  "desc": "더봄뷰티 아카데미 장형겸 대표원장의 교육 기준과 경력을 소개합니다. 현장에서 얻은 판단 기준을 이유와 함께 설명하는 반영구 교육을 진행합니다."
 },
 "apply": {
  "title": "반영구 수강 상담 신청 | 수원 더봄뷰티 아카데미",
  "desc": "더봄뷰티 아카데미 반영구 수강 상담 안내입니다. 지금 단계에 맞는 과정을 상담에서 함께 정합니다. 경기 수원시 팔달구 팔달로 69, 인스타그램 DM·전화 문의."
 }
};
const SEO_SCHEMA = "{\"@context\":\"https://schema.org\",\"@type\":\"EducationalOrganization\",\"name\":\"더봄뷰티 아카데미 THE BOMM BEAUTY ACADEMY\",\"url\":\"https://thebommacademy.co.kr/\",\"telephone\":\"+82-10-4131-2490\",\"image\":\"https://thebommacademy.co.kr/favicon-512.png\",\"address\":{\"@type\":\"PostalAddress\",\"streetAddress\":\"팔달로 69, 1동 403호 (고등동, 수원라임스퀘어)\",\"addressLocality\":\"수원시 팔달구\",\"addressRegion\":\"경기도\",\"postalCode\":\"16452\",\"addressCountry\":\"KR\"},\"sameAs\":[\"https://www.instagram.com/thebomm_beauty\",\"https://thebommbeauty.co.kr/\"]}";
const seoEsc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function seoKey(p) { return p.replace(/^\/+|\/+$/g, '').replace(/\.html$/, '').replace(/^index$/, ''); }
function seoSetMeta(html, attr, name, content) {
  const re = new RegExp('<meta[^>]+' + attr + '="' + name + '"[^>]*>', 'i');
  const tag = '<meta ' + attr + '="' + name + '" content="' + seoEsc(content) + '">';
  return re.test(html) ? html.replace(re, tag) : html.replace(/<\/head>/i, tag + '\n</head>');
}
function seoFix(html, key) {
  const pg = SEO_PAGES[key];
  if (!pg) return html;
  const canon = 'https://' + SEO_APEX + pg.path;
  html = /<link[^>]+rel="canonical"[^>]*>/i.test(html)
    ? html.replace(/<link[^>]+rel="canonical"[^>]*>/i, '<link rel="canonical" href="' + canon + '">')
    : html.replace(/<\/head>/i, '<link rel="canonical" href="' + canon + '">\n</head>');
  html = seoSetMeta(html, 'property', 'og:url', canon);
  const m = SEO_META[key];
  if (m && m.title) {
    html = /<title>[\s\S]*?<\/title>/i.test(html) ? html.replace(/<title>[\s\S]*?<\/title>/i, '<title>' + seoEsc(m.title) + '</title>') : html.replace(/<\/head>/i, '<title>' + seoEsc(m.title) + '</title>\n</head>');
    html = seoSetMeta(html, 'property', 'og:title', m.title);
  }
  if (m && m.desc) {
    html = seoSetMeta(html, 'name', 'description', m.desc);
    html = seoSetMeta(html, 'property', 'og:description', m.desc);
  }
  if (!/application\/ld\+json/i.test(html)) html = html.replace(/<\/head>/i, '<script type="application/ld+json">' + SEO_SCHEMA + '</script>\n</head>');
  return html;
}

export async function onRequest(ctx) {
  const url = new URL(ctx.request.url);
  const p = url.pathname;
  if (url.hostname === 'www.' + SEO_APEX) return Response.redirect('https://' + SEO_APEX + p + url.search, 301);
  if (/^\/(naver|google)[0-9a-f]+\.html$/.test(p)) {
    const r = await ctx.env.ASSETS.fetch(new URL(p.replace(/\.html$/, ''), url));
    if (r.ok) return new Response(await r.text(), { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' } });
  }
  if (p === '/seo' || p.startsWith('/seo/')) return new Response('Not found', { status: 404 });
  const key = seoKey(p);
  const pg = SEO_PAGES[key];
  const isRead = ctx.request.method === 'GET' || ctx.request.method === 'HEAD';
  if (pg && isRead && SEO_BOT.test(ctx.request.headers.get('user-agent') || '')) {
    const r = await ctx.env.ASSETS.fetch(new URL('/seo/' + pg.file, url));
    if (r.ok) return new Response(seoFix(await r.text(), key), { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'vary': 'User-Agent', 'cache-control': 'public, max-age=0, must-revalidate', 'x-sj-render': 'prerender' } });
  }
  const res = await siteOnRequest(ctx);
  if (!pg) return res;
  const type = res.headers.get('content-type') || '';
  if (!type.includes('text/html') || res.status !== 200) return res;
  const html = seoFix(await res.text(), key);
  const headers = new Headers(res.headers);
  headers.delete('content-length');
  headers.delete('etag');
  headers.set('vary', 'User-Agent');
  return new Response(html, { status: 200, headers });
}
// ===== 아래는 원래 미들웨어 (편집 모드 내용 반영) =====
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

async function siteOnRequest(ctx) {
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
