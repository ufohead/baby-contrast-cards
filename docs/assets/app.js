/* 黑白卡圖庫 — 純前端，無框架、無外部依賴 */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const state = {
    age: 'all',
    theme: 'all',
    q: '',
    selected: new Set(JSON.parse(localStorage.getItem('bcc.selected') || '[]')),
  };

  let DATA = null;
  let filtered = [];
  let viewerIndex = -1;

  /* ------------------------------------------------------------------ 資料 */
  async function load() {
    const res = await fetch('data/cards.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('cards.json 載入失敗：' + res.status);
    DATA = await res.json();
    buildChips();
    buildDownloads();
    bindEvents();
    applyFilters();
  }

  /* ------------------------------------------------------------------ 篩選 */
  function match(c) {
    if (state.age !== 'all' && c.age !== state.age) return false;
    if (state.theme !== 'all' && c.theme !== state.theme) return false;
    if (state.q) {
      const hay = `${c.title} ${c.motif} ${c.themeLabel} ${c.desc}`.toLowerCase();
      if (!hay.includes(state.q.toLowerCase())) return false;
    }
    return true;
  }

  function applyFilters() {
    filtered = DATA.cards.filter(match);
    $('#resultCount').textContent = filtered.length;
    $('#emptyState').hidden = filtered.length > 0;
    renderGrid(filtered);
  }

  /* ------------------------------------------------------------------ 篩選列 */
  function buildChips() {
    const ages = [['all', '全部'], ['0-2', '0-2 個月'], ['2-4', '2-4 個月'], ['3-6', '3-6 個月']];
    $('#ageChips').innerHTML = ages.map(([v, l]) => {
      const n = v === 'all' ? DATA.total : DATA.cards.filter((c) => c.age === v).length;
      return `<button class="chip" data-age="${v}" aria-pressed="${v === state.age}">${l}<span class="n">${n}</span></button>`;
    }).join('');

    $('#themeChips').innerHTML =
      `<button class="chip" data-theme="all" aria-pressed="${state.theme === 'all'}">全部主題<span class="n">${DATA.total}</span></button>` +
      DATA.themes.map((t) =>
        `<button class="chip" data-theme="${t.slug}" aria-pressed="${state.theme === t.slug}">${t.label}<span class="n">${t.count}</span></button>`
      ).join('');
  }

  /* ------------------------------------------------------------------ 卡片網格 */
  function cardHtml(c) {
    const sel = state.selected.has(c.id);
    return `<article class="card" data-id="${c.id}">
      <div class="card-img" data-act="view" role="button" tabindex="0" aria-label="放大檢視 ${c.title}">
        <img src="${c.thumb}" alt="${c.title}（${c.themeLabel}）" loading="lazy" width="320" height="320">
        <div class="card-badges">
          <span class="pill pill-age">${c.ageLabel}</span>
          ${sel ? '<span class="pill pill-sel">已選</span>' : ''}
        </div>
      </div>
      <div class="card-body">
        <p class="card-theme">${c.themeLabel}</p>
        <h3 class="card-title">${c.title}</h3>
        <div class="card-actions">
          <a class="icon-btn" href="${c.png}" download="${c.id}.png">⬇ PNG</a>
          <a class="icon-btn" href="${c.svg}" download="${c.id}.svg">⬇ SVG</a>
          <button class="icon-btn ${sel ? 'on' : ''}" data-act="select">${sel ? '✓ 已選' : '+ 列印'}</button>
        </div>
      </div>
    </article>`;
  }

  function renderGrid(list) {
    const grid = $('#grid');
    grid.innerHTML = list.map(cardHtml).join('');
  }

  /* ------------------------------------------------------------------ 下載中心 */
  function buildDownloads() {
    $('#dlGrid').innerHTML = DATA.themes.map((t) => `
      <div class="dl-item">
        <b>${t.label}</b>
        <span>${t.desc}</span>
        <div class="dl-links">
          <a href="downloads/${t.slug}.zip" download>⬇ PNG + SVG</a>
          <a href="downloads/${t.slug}-A4.pdf" download>⬇ A4 PDF</a>
        </div>
      </div>`).join('');
  }

  /* ------------------------------------------------------------------ 選取 */
  function toggleSelect(id) {
    if (state.selected.has(id)) state.selected.delete(id);
    else state.selected.add(id);
    localStorage.setItem('bcc.selected', JSON.stringify([...state.selected]));
    updateSelBar();
    const el = $(`.card[data-id="${id}"]`);
    if (el) {
      const btn = $('[data-act="select"]', el);
      const on = state.selected.has(id);
      btn.classList.toggle('on', on);
      btn.textContent = on ? '✓ 已選' : '+ 列印';
      const badge = $('.pill-sel', el);
      if (on && !badge) $('.card-badges', el).insertAdjacentHTML('beforeend', '<span class="pill pill-sel">已選</span>');
      if (!on && badge) badge.remove();
    }
    if (viewerIndex >= 0 && filtered[viewerIndex] && filtered[viewerIndex].id === id) syncViewerSel();
  }

  function updateSelBar() {
    const n = state.selected.size;
    $('#printBar').hidden = n === 0;
    $('#selCount').textContent = n;
  }

  /* ------------------------------------------------------------------ 放大檢視 */
  function openViewer(index) {
    viewerIndex = index;
    syncViewerSel();
    $('#viewer').hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeViewer() {
    $('#viewer').hidden = true;
    document.body.style.overflow = '';
    viewerIndex = -1;
  }
  function syncViewerSel() {
    const c = filtered[viewerIndex];
    if (!c) return;
    $('#viewerImg').src = c.png;
    $('#viewerImg').alt = c.title;
    $('#viewerTheme').textContent = `${c.themeLabel}・${c.id}`;
    $('#viewerTitle').textContent = c.title;
    $('#viewerDesc').textContent = c.desc;
    $('#viewerAge').textContent = `建議月齡 ${c.ageLabel}・${c.themeLabel}`;
    $('#viewerPng').href = c.png;
    $('#viewerPng').setAttribute('download', `${c.id}.png`);
    $('#viewerSvg').href = c.svg;
    $('#viewerSvg').setAttribute('download', `${c.id}.svg`);
    $('#viewerAdd').textContent = state.selected.has(c.id) ? '✓ 已加入列印清單' : '加入列印清單';
    $('#viewerAdd').classList.toggle('on', state.selected.has(c.id));
  }
  function stepViewer(delta) {
    if (!filtered.length) return;
    viewerIndex = (viewerIndex + delta + filtered.length) % filtered.length;
    syncViewerSel();
  }

  /* ------------------------------------------------------------------ 列印版面 */
  function scopeCards() {
    const scope = $('#printScope').value;
    if (scope === 'selected') return DATA.cards.filter((c) => state.selected.has(c.id));
    if (scope === 'filtered') return filtered;
    return DATA.cards;
  }

  function renderPrintPreview() {
    const n = parseInt($('#printLayout').value, 10);
    const cards = scopeCards();
    const pages = Math.ceil(cards.length / n);
    const shown = Math.min(pages, 3);
    const cols = n === 9 ? 3 : 2;
    const rows = n === 9 ? 3 : n === 6 ? 3 : 2;

    $('#printPreview').innerHTML = Array.from({ length: shown }, (_, p) => {
      const chunk = cards.slice(p * n, p * n + n);
      const cells = Array.from({ length: n }, (_, i) =>
        chunk[i]
          ? `<div class="pp-cell"><img src="${chunk[i].thumb}" alt=""></div>`
          : `<div class="pp-cell"></div>`
      ).join('');
      return `<div class="print-page-preview" style="grid-template-columns:repeat(${cols},1fr);grid-template-rows:repeat(${rows},1fr)">${cells}</div>`;
    }).join('');

    $('#printSummary').textContent =
      `共 ${cards.length} 張卡片，排成 ${pages} 頁（每頁 ${n} 張）。` +
      (pages > shown ? `預覽顯示前 ${shown} 頁。` : '') +
      ` 列印時縮放請選「實際大小 / 100%」。`;
    $('#doPrint').disabled = cards.length === 0;
  }

  function buildPrintDoc() {
    const n = parseInt($('#printLayout').value, 10);
    const paper = $('#printPaper').value;
    const cut = $('#printCut').checked;
    const cards = scopeCards();
    const root = $('#printRoot');
    document.documentElement.classList.toggle('paper-letter', paper === 'letter');

    root.innerHTML = '';
    for (let i = 0; i < cards.length; i += n) {
      const chunk = cards.slice(i, i + n);
      const page = document.createElement('div');
      page.className = `print-page l${n}`;
      chunk.forEach((c) => {
        const cell = document.createElement('div');
        cell.className = 'print-cell' + (cut ? ' cut' : '');
        const img = document.createElement('img');
        img.src = c.png;
        img.alt = c.title;
        cell.appendChild(img);
        page.appendChild(cell);
      });
      root.appendChild(page);
    }
  }

  function openPrintModal() {
    $('#printModal').hidden = false;
    document.body.style.overflow = 'hidden';
    renderPrintPreview();
  }
  function closePrintModal() {
    $('#printModal').hidden = true;
    document.body.style.overflow = '';
  }

  function doPrint() {
    buildPrintDoc();
    closePrintModal();
    setTimeout(() => window.print(), 120);
  }

  /* ------------------------------------------------------------------ 動態 ZIP */
  const CRC_TABLE = (() => {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[i] = c >>> 0;
    }
    return t;
  })();
  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  }
  function makeZip(files) {
    const enc = new TextEncoder();
    const parts = [];
    const central = [];
    let offset = 0;
    for (const f of files) {
      const name = enc.encode(f.name);
      const crc = crc32(f.data);
      const local = new Uint8Array(30 + name.length);
      const dv = new DataView(local.buffer);
      dv.setUint32(0, 0x04034b50, true);
      dv.setUint16(4, 20, true);
      dv.setUint16(6, 0x0800, true);
      dv.setUint16(8, 0, true);
      dv.setUint32(14, crc, true);
      dv.setUint32(18, f.data.length, true);
      dv.setUint32(22, f.data.length, true);
      dv.setUint16(26, name.length, true);
      local.set(name, 30);
      parts.push(local, f.data);

      const cd = new Uint8Array(46 + name.length);
      const cv = new DataView(cd.buffer);
      cv.setUint32(0, 0x02014b50, true);
      cv.setUint16(4, 20, true);
      cv.setUint16(6, 20, true);
      cv.setUint16(8, 0x0800, true);
      cv.setUint32(16, crc, true);
      cv.setUint32(20, f.data.length, true);
      cv.setUint32(24, f.data.length, true);
      cv.setUint16(28, name.length, true);
      cv.setUint32(42, offset, true);
      cd.set(name, 46);
      central.push(cd);
      offset += local.length + f.data.length;
    }
    let cdSize = 0;
    central.forEach((c) => (cdSize += c.length));
    const end = new Uint8Array(22);
    const ev = new DataView(end.buffer);
    ev.setUint32(0, 0x06054b50, true);
    ev.setUint16(8, files.length, true);
    ev.setUint16(10, files.length, true);
    ev.setUint32(12, cdSize, true);
    ev.setUint32(16, offset, true);
    return new Blob([...parts, ...central, end], { type: 'application/zip' });
  }

  async function zipFiltered() {
    if (!filtered.length) return;
    const btn = $('#zipFiltered');
    const label = btn.textContent;
    btn.textContent = '⏳ 打包中…';
    btn.disabled = true;
    try {
      const files = [];
      for (const c of filtered) {
        const res = await fetch(c.png);
        const buf = new Uint8Array(await res.arrayBuffer());
        files.push({ name: `${c.theme}/png/${c.id}.png`, data: buf });
      }
      const blob = makeZip(files);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'baby-cards-filtered.zip';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    } catch (err) {
      alert('打包下載需要透過網站伺服器開啟（本機直接開檔時請用單張下載或下載中心的壓縮包）。');
    } finally {
      btn.textContent = label;
      btn.disabled = false;
    }
  }

  /* ------------------------------------------------------------------ 事件 */
  function bindEvents() {
    $('#ageChips').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-age]');
      if (!btn) return;
      state.age = btn.dataset.age;
      $$('#ageChips .chip').forEach((c) => c.setAttribute('aria-pressed', String(c === btn)));
      applyFilters();
    });

    $('#themeChips').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-theme]');
      if (!btn) return;
      state.theme = btn.dataset.theme;
      $$('#themeChips .chip').forEach((c) => c.setAttribute('aria-pressed', String(c === btn)));
      applyFilters();
    });

    let timer;
    $('#search').addEventListener('input', (e) => {
      clearTimeout(timer);
      const v = e.target.value.trim();
      timer = setTimeout(() => {
        state.q = v;
        applyFilters();
      }, 160);
    });

    $('#grid').addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      if (!card) return;
      const id = card.dataset.id;
      const act = e.target.closest('[data-act]');
      if (act && act.dataset.act === 'select') {
        toggleSelect(id);
        return;
      }
      const index = filtered.findIndex((c) => c.id === id);
      if (index >= 0) openViewer(index);
    });

    $('#grid').addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const img = e.target.closest('[data-act="view"]');
      if (!img) return;
      e.preventDefault();
      const card = img.closest('.card');
      const index = filtered.findIndex((c) => c.id === card.dataset.id);
      if (index >= 0) openViewer(index);
    });

    $('#viewToggle').addEventListener('click', () => {
      if (!filtered.length) return;
      openViewer(0);
    });

    $('#zipFiltered').addEventListener('click', zipFiltered);
    $('#openPrint').addEventListener('click', openPrintModal);
    $('#printSelected').addEventListener('click', () => {
      $('#printScope').value = 'selected';
      openPrintModal();
    });
    $('#clearSel').addEventListener('click', () => {
      state.selected.clear();
      localStorage.removeItem('bcc.selected');
      updateSelBar();
      applyFilters();
    });

    ['printScope', 'printLayout', 'printPaper'].forEach((id) =>
      $('#' + id).addEventListener('change', renderPrintPreview)
    );
    $('#printCut').addEventListener('change', renderPrintPreview);
    $('#doPrint').addEventListener('click', doPrint);

    $('#viewerPrev').addEventListener('click', () => stepViewer(-1));
    $('#viewerNext').addEventListener('click', () => stepViewer(1));
    $('#viewerAdd').addEventListener('click', () => {
      const c = filtered[viewerIndex];
      if (c) toggleSelect(c.id);
    });

    $$('[data-close]').forEach((el) =>
      el.addEventListener('click', () => {
        closeViewer();
        closePrintModal();
      })
    );

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeViewer();
        closePrintModal();
      }
      if (!$('#viewer').hidden && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
        stepViewer(e.key === 'ArrowRight' ? 1 : -1);
      }
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        $('#search').focus();
      }
    });

    window.addEventListener('afterprint', () => {
      $('#printRoot').innerHTML = '';
    });
  }

  /* ------------------------------------------------------------------ 啟動 */
  load().catch((err) => {
    console.error(err);
    $('#grid').innerHTML =
      '<p class="empty">卡片資料載入失敗。請確認網站是透過 http(s) 伺服器開啟，而不是直接雙擊 index.html。</p>';
  });
})();
