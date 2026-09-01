/* Portfolio interactivity.
   Vanilla reimplementation of the interactive component in design/.
   The original ran on the canvas runtime (React); this is the standalone equivalent:
   scroll reveal, the map filter strip, and the lightbox. */

(function () {
  'use strict';

  /* ---------------- data model (mirrors the design's groups / allMaps) --------------- */

  var GROUPS = [
    {
      key: 'wb', label: 'West Bandung',
      title: 'Tourism-village thematic maps, West Bandung Regency',
      meta: 'PT. Dananjaya Design Indonesia · 2022–2024',
      note: 'GIS-based thematic maps for 16 sub-districts, produced for a government-commissioned programme to develop tourism villages. Three sub-districts shown here per theme.',
      tags: ['QGIS', 'ArcGIS Pro', 'Thematic mapping']
    },
    {
      key: 'skl', label: 'Land capability',
      title: 'Land capability analysis (SKL), Kroya, Cilacap',
      meta: 'Studio Proses Perencanaan · map coordinator',
      note: 'Eight derived surfaces (morphology, workability, foundation stability, water availability, drainage, waste disposal, erosion and hazard exposure) combined into a single land-capability map.',
      tags: ['ArcGIS Pro', 'Overlay analysis', 'Land suitability']
    },
    {
      key: 'infra', label: 'Facility coverage',
      title: 'Facility service coverage, Kroya, Cilacap',
      meta: 'Studio Proses Perencanaan · map coordinator',
      note: 'Catchment analysis for education, worship, market and retail facilities, plus the distribution of government service points.',
      tags: ['QGIS', 'Buffer & catchment', 'Service coverage']
    },
    {
      key: 'ts', label: 'Time series',
      title: 'Population density and land cover over time, Kroya, Cilacap',
      meta: 'Studio Proses Perencanaan · map coordinator',
      note: 'Observed years mapped alongside projections to 2045, using linear and geometric projection methods on BPS data.',
      tags: ['ArcGIS Pro', 'Population projection', 'Land-cover change']
    },
    {
      key: 'base', label: 'Base maps',
      title: 'Base and physical maps, Kroya, Cilacap',
      meta: 'Studio Proses Perencanaan · map coordinator',
      note: 'The underlying data layers for the studio analysis: geology, morphology, land cover, spatial pattern, power network and population density.',
      tags: ['QGIS', 'Cartography', 'Base data']
    }
  ];

  var ALL_MAPS = (function () {
    var out = [];

    var wbThemes = [
      ['Accommodation & lodging', 'akomodasi'],
      ['Public facilities & services', 'fasum'],
      ['Food & local produce', 'kuliner'],
      ['Local business distribution', 'usaha'],
      ['Transport nodes', 'transportasi']
    ];
    var kec = [['Lembang', 'lembang'], ['Padalarang', 'padalarang'], ['Cisarua', 'cisarua']];
    wbThemes.forEach(function (t) {
      kec.forEach(function (k) {
        out.push({
          group: 'wb', label: t[0], sub: 'Kec. ' + k[0],
          src: 'assets/maps/wb/' + t[1] + '-' + k[1] + '.jpg'
        });
      });
    });

    function push(group, dir, items) {
      items.forEach(function (it) {
        out.push({ group: group, label: it[0], sub: it[1], src: 'assets/maps/' + dir + '/' + it[2] });
      });
    }

    push('skl', 'skl', [
      ['Land capability', 'Composite result', 'kemampuan-lahan.jpg'],
      ['Morphology', 'SKL', 'morfologi.jpg'],
      ['Workability', 'SKL', 'kemudahan-dikerjakan.jpg'],
      ['Foundation stability', 'SKL', 'kestabilan-pondasi.jpg'],
      ['Water availability', 'SKL', 'ketersediaan-air.jpg'],
      ['Drainage', 'SKL', 'drainase.jpg'],
      ['Waste disposal', 'SKL', 'pembuangan-limbah.jpg'],
      ['Erosion susceptibility', 'SKL', 'erosi.jpg'],
      ['Natural hazard exposure', 'SKL', 'bencana-alam.jpg']
    ]);
    push('infra', 'infra', [
      ['Primary school catchment', 'SD', 'pendidikan-sd.png'],
      ['Junior high catchment', 'SMP', 'pendidikan-smp.png'],
      ['Senior high catchment', 'SMA', 'pendidikan-sma.png'],
      ['Places of worship', 'Catchment', 'peribadatan.jpg'],
      ['Market catchment', 'Catchment', 'pasar.png'],
      ['Retail catchment', 'Catchment', 'pertokoan.png'],
      ['Government facilities', 'Point distribution', 'pemerintahan.png']
    ]);
    push('ts', 'ts', [
      ['Population density', '2014', 'kepadatan-2014.jpg'],
      ['Population density', '2019', 'kepadatan-2019.jpg'],
      ['Population density', '2024', 'kepadatan-2024.jpg'],
      ['Population density', '2035 · projected', 'kepadatan-2035.jpg'],
      ['Population density', '2045 · projected', 'kepadatan-2045.jpg'],
      ['Land cover', '2017', 'tutupan-2017.jpg'],
      ['Land cover', '2025', 'tutupan-2025.jpg'],
      ['Land cover', '2045 · projected', 'tutupan-2045.jpg']
    ]);
    push('base', 'base', [
      ['Land capability analysis', 'AKL', 'akl.jpg'],
      ['Geology', 'Base map', 'geologi.jpg'],
      ['Morphology', 'Base map', 'morfologi.jpg'],
      ['Land cover', '2024', 'tutupan-lahan.jpg'],
      ['Spatial pattern', 'Pola ruang', 'pola-ruang.jpg'],
      ['Power network', 'Base map', 'jaringan-listrik.jpg'],
      ['Population density', 'Base map', 'kepadatan.jpg']
    ]);

    return out;
  })();

  /* ---------------------------------- state ---------------------------------- */

  var state = { filter: 'wb', active: null };
  var visible = function () {
    return ALL_MAPS.filter(function (m) { return m.group === state.filter; });
  };

  /* ---------------------------------- helpers -------------------------------- */

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var el = function (tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  /* --------------------------------- map strip -------------------------------- */

  var tabsEl = $('[data-map-tabs]');
  var stripEl = $('[data-map-strip]');
  var titleEl = $('[data-group-title]');
  var countEl = $('[data-group-count]');
  var metaEl = $('[data-group-meta]');
  var noteEl = $('[data-group-note]');
  var tagsEl = $('[data-group-tags]');

  function renderTabs() {
    tabsEl.textContent = '';
    GROUPS.forEach(function (g) {
      var b = el('button', 'tab', g.label);
      b.type = 'button';
      if (g.key === state.filter) b.classList.add('tab--on');
      b.setAttribute('aria-pressed', String(g.key === state.filter));
      b.addEventListener('click', function () {
        state.filter = g.key;
        state.active = null;
        render();
      });
      tabsEl.appendChild(b);
    });
  }

  function renderStrip() {
    var list = visible();
    stripEl.textContent = '';

    list.forEach(function (m, i) {
      var card = el('button', 'card');
      card.type = 'button';
      card.dataset.index = String(i);
      card.setAttribute('data-card', '');

      var frame = el('div', 'card__frame');
      var img = el('img');
      img.src = m.src;
      img.alt = m.label + ' — ' + m.sub;
      img.loading = 'lazy';
      frame.appendChild(img);

      var foot = el('div', 'card__foot');
      foot.appendChild(el('span', 'card__label', m.label));
      foot.appendChild(el('span', 'card__sub', m.sub));

      var badge = el('span', 'card__open', 'Open');
      badge.setAttribute('data-expand', '');

      card.appendChild(frame);
      card.appendChild(foot);
      card.appendChild(badge);
      card.addEventListener('click', function () { open(i); });

      stripEl.appendChild(card);
    });
  }

  function renderGroupMeta() {
    var g = GROUPS.filter(function (x) { return x.key === state.filter; })[0] || GROUPS[0];
    titleEl.textContent = g.title;
    countEl.textContent = visible().length + ' maps';
    metaEl.textContent = g.meta;
    noteEl.textContent = g.note;
    tagsEl.textContent = '';
    g.tags.forEach(function (t) {
      var s = el('li', 'tag', t);
      s.setAttribute('data-tag', '');
      tagsEl.appendChild(s);
    });
  }

  function render() {
    renderTabs();
    renderStrip();
    renderGroupMeta();
    if (stripEl.scrollTo) stripEl.scrollTo({ left: 0 });
  }

  /* --------------------------------- lightbox --------------------------------- */

  var box = $('[data-lightbox]');
  var boxPanel = $('[data-lightbox-panel]');
  var boxImg = $('[data-lightbox-img]');
  var boxLabel = $('[data-lightbox-label]');
  var boxSub = $('[data-lightbox-sub]');
  var boxClose = $('[data-lightbox-close]');
  var lastFocus = null;

  function open(i) {
    state.active = i;
    lastFocus = document.activeElement;
    syncBox();
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    boxClose.focus();
  }

  function close() {
    state.active = null;
    box.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function step(d) {
    if (state.active === null) return;
    var n = visible().length;
    state.active = (state.active + d + n) % n;
    syncBox();
  }

  function syncBox() {
    var m = visible()[state.active];
    if (!m) return;
    boxImg.src = m.src;
    boxImg.alt = m.label + ' — ' + m.sub;
    boxLabel.textContent = m.label;
    boxSub.textContent = m.sub;
  }

  box.addEventListener('click', close);
  boxPanel.addEventListener('click', function (e) { e.stopPropagation(); });
  boxClose.addEventListener('click', close);
  $('[data-lightbox-prev]').addEventListener('click', function (e) { e.stopPropagation(); step(-1); });
  $('[data-lightbox-next]').addEventListener('click', function (e) { e.stopPropagation(); step(1); });

  document.addEventListener('keydown', function (e) {
    if (state.active === null) return;
    if (e.key === 'Escape') { close(); }
    else if (e.key === 'ArrowLeft') { step(-1); }
    else if (e.key === 'ArrowRight') { step(1); }
  });

  /* ------------------------------- scroll reveal ------------------------------ */

  function reveal() {
    var sel = '[data-reveal], [data-rule], [data-timeline], [data-dot]';
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll(sel).forEach(function (n) { n.classList.add('zq-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('zq-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    var scan = function () {
      document.querySelectorAll(sel).forEach(function (n) {
        if (!n.classList.contains('zq-in')) io.observe(n);
      });
    };
    scan();
    setTimeout(scan, 600);
  }

  /* ----------------------------------- init ---------------------------------- */

  render();
  reveal();
})();
