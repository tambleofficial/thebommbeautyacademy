/* 세이지뷰티 관리자 연결 (공개 화면용)
 * 서버(functions/_middleware.js)가 넣어준 window.__CMS 를 화면에 반영합니다.
 *  - text.t   : { 원래 문구: 바꾼 문구 }  → 화면에 그려지는 문구를 바꿔 보여줌
 *  - media.m  : { 'assets/media/원래파일': '/assets/uploads/새파일' } → 사진 교체
 *  - reviews  : 방문자 후기 목록 (assets/reviews.js 대신 사용)
 */
(function () {
  var C = window.__CMS || {};
  var media = (C.media && C.media.m) || {};
  var mkeys = Object.keys(media);
  function pathOf(u) { try { return new URL(u, location.href).pathname; } catch (e) { return u; } }
  function swapMedia(root) {
    if (!mkeys.length || !root || !root.querySelectorAll) return;
    var list = root.matches && root.matches('img[src],image-slot[src]') ? [root] : [];
    list = list.concat([].slice.call(root.querySelectorAll('img[src],image-slot[src]')));
    for (var i = 0; i < list.length; i++) { var el = list[i], p = pathOf(el.getAttribute('src')); if (Object.prototype.hasOwnProperty.call(media, p) && el.getAttribute('src') !== media[p]) { el.setAttribute('data-sj-key', p); el.setAttribute('src', media[p]); } }
  }
  window.__sjSwapMedia = swapMedia;
  if (mkeys.length) {
    new MutationObserver(function (ms) { for (var i = 0; i < ms.length; i++) { var m = ms[i]; if (m.type === 'attributes') swapMedia(m.target); else for (var j = 0; j < m.addedNodes.length; j++) if (m.addedNodes[j].nodeType === 1) swapMedia(m.addedNodes[j]); } })
      .observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
    document.addEventListener('DOMContentLoaded', function () { swapMedia(document.body); });
  }

  var T = (C.text && C.text.t) || {};
  var keys = Object.keys(T);
  window.__sjNorm = function (s) { return String(s || '').replace(/\u00a0/g, ' ').replace(/[ \t\r\f\v]+/g, ' ').replace(/ *\n */g, '\n').trim(); };
  if (!keys.length) return;
  var norm = window.__sjNorm;
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var SKIP = { SCRIPT: 1, STYLE: 1, TEMPLATE: 1, TEXTAREA: 1, INPUT: 1, SVG: 1, HELMET: 1 };
  // 글자만(줄바꿈 포함) 들어 있는 요소인지
  function leafText(el) {
    if (!el || SKIP[el.tagName] || el.isContentEditable) return null;
    var txt = '', has = false;
    for (var n = el.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3) { txt += n.nodeValue; if (/\S/.test(n.nodeValue)) has = true; }
      else if (n.nodeType === 1 && n.tagName === 'BR') txt += '\n';
      else return null;
    }
    return has ? norm(txt) : null;
  }
  function applyEl(el) {
    var t = leafText(el);
    if (t === null || !Object.prototype.hasOwnProperty.call(T, t)) return;
    var v = T[t];
    if (norm(v) === t) return;
    el.setAttribute('data-sj-orig', t);
    el.innerHTML = esc(v).replace(/\n/g, '<br>');
  }
  function scan(root) {
    if (!root || root.nodeType !== 1) return;
    applyEl(root);
    var all = root.getElementsByTagName('*');
    for (var i = 0; i < all.length; i++) applyEl(all[i]);
  }
  window.__sjApplyText = scan;
  var pending = [], sched = false;
  function flush() { sched = false; var list = pending; pending = []; for (var i = 0; i < list.length; i++) scan(list[i]); }
  new MutationObserver(function (ms) {
    for (var i = 0; i < ms.length; i++) {
      var m = ms[i];
      if (m.type === 'characterData') { if (m.target.parentNode) pending.push(m.target.parentNode); }
      else { for (var j = 0; j < m.addedNodes.length; j++) { var a = m.addedNodes[j]; pending.push(a.nodeType === 1 ? a : a.parentNode); } }
    }
    if (!sched && pending.length) { sched = true; Promise.resolve().then(flush); }
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  document.addEventListener('DOMContentLoaded', function () { scan(document.body); });
})();
