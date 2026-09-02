/* Portfolio interactivity — standalone rebuild of the design canvas component.
   Theme toggle, hero parallax, skills marquee, map gallery, lightbox, scroll reveal.
   Every block guards for missing nodes so the same file serves both pages. */

(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var el = function (tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  var SVGNS = 'http://www.w3.org/2000/svg';
  function svg(tag, attrs) {
    var n = document.createElementNS(SVGNS, tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    return n;
  }

  /* ------------------------------- theme toggle ------------------------------ */

  var dark = false;
  try { dark = localStorage.getItem('zqz-theme') === 'dark'; } catch (e) {}
  document.documentElement.classList.toggle('zq-dark', dark);

  function themeIcon(btn) {
    btn.textContent = '';
    var s = svg('svg', { width: 17, height: 17, viewBox: '0 0 24 24', fill: 'none',
                         stroke: 'currentColor', 'stroke-width': 1.7, 'aria-hidden': 'true' });
    if (dark) {
      s.appendChild(svg('path', { d: 'M20 14.5A8.2 8.2 0 0 1 9.5 4 8.3 8.3 0 1 0 20 14.5z' }));
    } else {
      s.appendChild(svg('circle', { cx: 12, cy: 12, r: 4.2 }));
      s.appendChild(svg('path', { d: 'M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6' }));
    }
    btn.appendChild(s);
    btn.setAttribute('data-on', dark ? 'dark' : 'light');
  }

  var themeBtn = $('[data-themebtn]');
  if (themeBtn) {
    themeIcon(themeBtn);
    themeBtn.addEventListener('click', function () {
      dark = !dark;
      document.documentElement.classList.toggle('zq-dark', dark);
      try { localStorage.setItem('zqz-theme', dark ? 'dark' : 'light'); } catch (e) {}
      themeIcon(themeBtn);
    });
    themeBtn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); themeBtn.click(); }
    });
  }

  /* ------------------------------ hero parallax ------------------------------ */

  (function () {
    var inner = $('[data-hero-inner]');
    var stage = $('[data-hero-stage]');
    if (!inner || !stage) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var raf = 0;
    function apply() {
      raf = 0;
      var h = stage.offsetHeight || 1;
      var t = Math.min(1, Math.max(0, window.scrollY / (h * 0.85)));
      var e = t * t;
      inner.style.transform = 'translate3d(0,' + (e * -64).toFixed(2) + 'px,0) scale(' + (1 - e * 0.05).toFixed(4) + ')';
      inner.style.opacity = String(Math.max(0, 1 - e * 1.25));
      inner.style.filter = e > 0.05 ? 'blur(' + (e * 5).toFixed(2) + 'px)' : 'none';
    }
    var onScroll = function () { if (!raf) raf = requestAnimationFrame(apply); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    apply();
  })();

  /* -------------------------------- skills reel ------------------------------ */

  var SKILLS = [
    { label: 'GIS & mapping', dir: 'l', items: [
      ['QGIS', 'icon:qgis', '#589632', 'Primary desktop GIS: thematic mapping, geoprocessing, and print layouts.'],
      ['ArcGIS Pro', 'icon:esri', '#0079C1', 'Multi-criteria overlays and land capability scoring.'],
      ['ArcMap', 'icon:esri', '#4a6f8a', 'Legacy studio project files and older workflows.'],
      ['GRASS GIS', 'mono:GR', '#3D8B37', 'Open-source raster and terrain processing.'],
      ['DSAS', 'mono:DS', '#1a6c8f', 'Digital Shoreline Analysis System for coastline change rates.'],
      ['Google Earth Engine', 'icon:googleearthengine', '#4285F4', 'Time-series land cover and change detection from satellite imagery.'],
      ['Google Earth', 'icon:googleearth', '#4285F4', 'Ground-truthing, imagery reference, and site reconnaissance.']
    ]},
    { label: 'Code & AI', dir: 'r', items: [
      ['Python', 'icon:python', '#3776AB', 'Scripting spatial data processing and analysis.'],
      ['Git', 'icon:git', '#F05032', 'Version control for project files and scripts.'],
      ['GitHub', 'icon:github', '#181717', 'Hosting and sharing code and map work.'],
      ['Visual Studio Code', 'icon:visualstudiocode', '#007ACC', 'Main editor for scripts and web work.'],
      ['Claude Code', 'icon:claude', '#D97757', 'Agentic coding assistant for building and iterating on projects.'],
      ['Antigravity', 'mono:AG', '#4285F4', 'Agent-based development environment.'],
      ['OpenAI API', 'icon:openai', '#412991', 'Calling models programmatically inside prototypes.']
    ]},
    { label: '3D, CAD, motion & office', dir: 'l', items: [
      ['AutoCAD', 'icon:autocad', '#E51050', 'Site plans and drawing cleanup before import into GIS.'],
      ['SketchUp', 'icon:sketchup', '#005F9E', '3D massing studies for district and neighbourhood proposals.'],
      ['Adobe Premiere Pro', 'icon:adobepremierepro', '#9999FF', 'Editing documentary and field footage.'],
      ['After Effects', 'icon:adobeaftereffects', '#9999FF', 'Motion graphics and animated map sequences.'],
      ['Figma', 'icon:figma', '#F24E1E', 'Interface layouts and visual design for web work.'],
      ['Canva', 'icon:canva', '#00C4CC', 'Quick posters, social graphics, and event material.'],
      ['Affinity Designer', 'icon:affinitydesigner', '#134881', 'Vector illustration and map graphics finishing.'],
      ['Microsoft Excel', 'mono:XL', '#217346', 'Projection models, tabular analysis, and data cleaning.'],
      ['Microsoft Word', 'mono:W', '#2B579A', 'Studio reports, district profiles, and workshop documentation.'],
      ['Microsoft PowerPoint', 'mono:P', '#B7472A', 'Presentation boards and studio review decks.']
    ]}
  ];

  var hintEl = $('[data-skill-hint]');
  var HINT_DEFAULT = 'Hover a tool to see what I use it for.';
  function setHint(t) { if (hintEl) hintEl.textContent = t || HINT_DEFAULT; }

  function chip(t, small) {
    var name = t[0], glyph = t[1], hex = t[2], desc = t[3];
    var isIcon = glyph.indexOf('icon:') === 0;
    var sym = glyph.slice(glyph.indexOf(':') + 1);

    var c = el('div', 'chip' + (small ? ' chip--sm' : ''));
    c.setAttribute('data-chip', '');

    var dot = el('span', 'chip__dot');
    dot.setAttribute('data-chipdot', '');
    dot.style.background = hex + '1a';
    dot.style.color = hex;
    if (isIcon) {
      var mask = el('span', 'chip__icon');
      var url = 'url(assets/icons/' + sym + '.svg) center / contain no-repeat';
      mask.style.background = hex;
      mask.style.webkitMask = url;
      mask.style.mask = url;
      dot.appendChild(mask);
    } else {
      dot.appendChild(document.createTextNode(sym));
    }

    c.appendChild(dot);
    c.appendChild(el('span', 'chip__name', name));
    c.addEventListener('mouseenter', function () { setHint(name + ' · ' + desc); });
    c.addEventListener('mouseleave', function () { setHint(''); });
    return c;
  }

  (function buildSkills() {
    var reel = $('[data-skill-reel]');
    var all = $('[data-skill-all]');
    var toggle = $('[data-skill-toggle]');
    if (!reel || !all || !toggle) return;

    SKILLS.forEach(function (g) {
      var row = el('div', 'mqrow');
      row.setAttribute('data-mqrow', '');
      var track = el('div', 'mqtrack');
      track.setAttribute('data-mqtrack', '');
      // duplicated so the -50% keyframe loops seamlessly
      var base = g.items.concat(g.items, g.items, g.items);
      base.concat(base).forEach(function (t) { track.appendChild(chip(t)); });
      track.style.animation = 'zq-mq-' + g.dir + ' ' + Math.round(g.items.length * 26.5) + 's linear infinite';
      row.appendChild(track);
      reel.appendChild(row);
    });

    SKILLS.forEach(function (g) {
      var col = el('div', 'skill-col');
      col.appendChild(el('div', 'skill-col__h', g.label));
      g.items.forEach(function (t) { col.appendChild(chip(t, true)); });
      all.appendChild(col);
    });

    var showingReel = true;
    var label = $('[data-skill-toggle-label]') || toggle;
    function sync() {
      reel.hidden = !showingReel;
      all.hidden = showingReel;
      label.textContent = showingReel ? 'View all' : 'Back to reel';
      setHint('');
    }
    toggle.addEventListener('click', function () { showingReel = !showingReel; sync(); });
    toggle.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle.click(); }
    });
    sync();
  })();

  /* -------------------------------- map gallery ------------------------------ */

  var TAG_ICON = {
    'QGIS': ['qgis', '#589632'], 'ArcGIS Pro': ['esri', '#0079C1'], 'ArcMap': ['esri', '#4a6f8a'],
    'AutoCAD': ['autocad', '#E51050'], 'SketchUp': ['sketchup', '#005F9E'],
    'Google Earth Engine': ['googleearthengine', '#4285F4'], 'Google Earth': ['googleearth', '#4285F4']
  };

  function tagEl(label) {
    var li = el('li', 'tag');
    li.setAttribute('data-tag', '');
    var m = TAG_ICON[label];
    if (m) {
      var ic = el('span', 'tag__icon');
      var url = 'url(assets/icons/' + m[0] + '.svg) center / contain no-repeat';
      ic.style.background = m[1];
      ic.style.webkitMask = url;
      ic.style.mask = url;
      li.appendChild(ic);
    }
    li.appendChild(el('span', null, label));
    return li;
  }

  var GROUPS = [
    { key: 'wb', label: 'West Bandung',
      title: 'Tourism-village thematic maps, West Bandung Regency',
      meta: 'PT. Dananjaya Design Indonesia · 2022–2024',
      note: 'GIS-based thematic maps for 16 sub-districts, produced for a government-commissioned programme to develop tourism villages. Three sub-districts shown here per theme.',
      tags: ['QGIS', 'ArcGIS Pro', 'Thematic mapping'] },
    { key: 'skl', label: 'Land capability',
      title: 'Land capability analysis (SKL), Kroya, Cilacap',
      meta: 'Studio Proses Perencanaan · map coordinator',
      note: 'Eight derived surfaces (morphology, workability, foundation stability, water availability, drainage, waste disposal, erosion and hazard exposure) combined into a single land-capability map.',
      tags: ['ArcGIS Pro', 'Overlay analysis', 'Land suitability'] },
    { key: 'infra', label: 'Facility coverage',
      title: 'Facility service coverage, Kroya, Cilacap',
      meta: 'Studio Proses Perencanaan · map coordinator',
      note: 'Catchment analysis for education, worship, market and retail facilities, plus the distribution of government service points.',
      tags: ['QGIS', 'Buffer & catchment', 'Service coverage'] },
    { key: 'ts', label: 'Time series',
      title: 'Population density and land cover over time, Kroya, Cilacap',
      meta: 'Studio Proses Perencanaan · map coordinator',
      note: 'Observed years mapped alongside projections to 2045, using linear and geometric projection methods on BPS data.',
      tags: ['ArcGIS Pro', 'Population projection', 'Land-cover change'] },
    { key: 'base', label: 'Base maps',
      title: 'Base and physical maps, Kroya, Cilacap',
      meta: 'Studio Proses Perencanaan · map coordinator',
      note: 'The underlying data layers for the studio analysis: geology, morphology, land cover, spatial pattern, power network and population density.',
      tags: ['QGIS', 'Cartography', 'Base data'] }
  ];

  var ALL_MAPS = (function () {
    var out = [];
    var themes = [['Accommodation & lodging', 'akomodasi'], ['Public facilities & services', 'fasum'],
                  ['Food & local produce', 'kuliner'], ['Local business distribution', 'usaha'],
                  ['Transport nodes', 'transportasi']];
    var kec = [['Lembang', 'lembang'], ['Padalarang', 'padalarang'], ['Cisarua', 'cisarua']];
    themes.forEach(function (t) {
      kec.forEach(function (k) {
        out.push({ group: 'wb', label: t[0], sub: 'Kec. ' + k[0], src: 'assets/maps/wb/' + t[1] + '-' + k[1] + '.jpg' });
      });
    });
    function push(group, dir, items) {
      items.forEach(function (i) { out.push({ group: group, label: i[0], sub: i[1], src: 'assets/maps/' + dir + '/' + i[2] }); });
    }
    push('skl', 'skl', [
      ['Land capability', 'Composite result', 'kemampuan-lahan.jpg'], ['Morphology', 'SKL', 'morfologi.jpg'],
      ['Workability', 'SKL', 'kemudahan-dikerjakan.jpg'], ['Foundation stability', 'SKL', 'kestabilan-pondasi.jpg'],
      ['Water availability', 'SKL', 'ketersediaan-air.jpg'], ['Drainage', 'SKL', 'drainase.jpg'],
      ['Waste disposal', 'SKL', 'pembuangan-limbah.jpg'], ['Erosion susceptibility', 'SKL', 'erosi.jpg'],
      ['Natural hazard exposure', 'SKL', 'bencana-alam.jpg']
    ]);
    push('infra', 'infra', [
      ['Primary school catchment', 'SD', 'pendidikan-sd.png'], ['Junior high catchment', 'SMP', 'pendidikan-smp.png'],
      ['Senior high catchment', 'SMA', 'pendidikan-sma.png'], ['Places of worship', 'Catchment', 'peribadatan.jpg'],
      ['Market catchment', 'Catchment', 'pasar.png'], ['Retail catchment', 'Catchment', 'pertokoan.png'],
      ['Government facilities', 'Point distribution', 'pemerintahan.png']
    ]);
    push('ts', 'ts', [
      ['Population density', '2014', 'kepadatan-2014.jpg'], ['Population density', '2019', 'kepadatan-2019.jpg'],
      ['Population density', '2024', 'kepadatan-2024.jpg'], ['Population density', '2035 · projected', 'kepadatan-2035.jpg'],
      ['Population density', '2045 · projected', 'kepadatan-2045.jpg'], ['Land cover', '2017', 'tutupan-2017.jpg'],
      ['Land cover', '2025', 'tutupan-2025.jpg'], ['Land cover', '2045 · projected', 'tutupan-2045.jpg']
    ]);
    push('base', 'base', [
      ['Land capability analysis', 'AKL', 'akl.jpg'], ['Geology', 'Base map', 'geologi.jpg'],
      ['Morphology', 'Base map', 'morfologi.jpg'], ['Land cover', '2024', 'tutupan-lahan.jpg'],
      ['Spatial pattern', 'Pola ruang', 'pola-ruang.jpg'], ['Power network', 'Base map', 'jaringan-listrik.jpg'],
      ['Population density', 'Base map', 'kepadatan.jpg']
    ]);
    return out;
  })();

  var state = { filter: 'wb', active: null };
  function visible() { return ALL_MAPS.filter(function (m) { return m.group === state.filter; }); }

  var tabsEl = $('[data-map-tabs]');
  var stripEl = $('[data-map-strip]');
  var titleEl = $('[data-group-title]');
  var countEl = $('[data-group-count]');
  var metaEl = $('[data-group-meta]');
  var noteEl = $('[data-group-note]');
  var tagsEl = $('[data-group-tags]');
  var hasGallery = tabsEl && stripEl;

  function render() {
    tabsEl.textContent = '';
    GROUPS.forEach(function (g) {
      var b = el('button', 'tab' + (g.key === state.filter ? ' tab--on' : ''), g.label);
      b.type = 'button';
      b.setAttribute('aria-pressed', String(g.key === state.filter));
      b.addEventListener('click', function () { state.filter = g.key; state.active = null; render(); });
      tabsEl.appendChild(b);
    });

    stripEl.textContent = '';
    visible().forEach(function (m, i) {
      var card = el('button', 'card');
      card.type = 'button';
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
      card.appendChild(frame); card.appendChild(foot); card.appendChild(badge);
      card.addEventListener('click', function () { openBox(i); });
      stripEl.appendChild(card);
    });

    var g = GROUPS.filter(function (x) { return x.key === state.filter; })[0] || GROUPS[0];
    titleEl.textContent = g.title;
    countEl.textContent = visible().length + ' maps';
    metaEl.textContent = g.meta;
    noteEl.textContent = g.note;
    tagsEl.textContent = '';
    g.tags.forEach(function (t) { tagsEl.appendChild(tagEl(t)); });
    if (stripEl.scrollTo) stripEl.scrollTo({ left: 0 });
  }

  /* --------------------------------- lightbox -------------------------------- */

  var box = $('[data-lightbox]');
  var boxImg = $('[data-lightbox-img]');
  var boxLabel = $('[data-lightbox-label]');
  var boxSub = $('[data-lightbox-sub]');
  var boxClose = $('[data-lightbox-close]');
  var lastFocus = null;

  function syncBox() {
    var m = visible()[state.active];
    if (!m) return;
    boxImg.src = m.src;
    boxImg.alt = m.label + ' — ' + m.sub;
    boxLabel.textContent = m.label;
    boxSub.textContent = m.sub;
  }
  function openBox(i) {
    state.active = i;
    lastFocus = document.activeElement;
    syncBox();
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    boxClose.focus();
  }
  function closeBox() {
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

  if (hasGallery && box) {
    box.addEventListener('click', closeBox);
    $('[data-lightbox-panel]').addEventListener('click', function (e) { e.stopPropagation(); });
    boxClose.addEventListener('click', closeBox);
    $('[data-lightbox-prev]').addEventListener('click', function (e) { e.stopPropagation(); step(-1); });
    $('[data-lightbox-next]').addEventListener('click', function (e) { e.stopPropagation(); step(1); });
    document.addEventListener('keydown', function (e) {
      if (state.active === null) return;
      if (e.key === 'Escape') closeBox();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    });
    render();
  }

  /* ------------------------------- scroll reveal ----------------------------- */

  (function () {
    var sel = '[data-reveal], [data-rule], [data-timeline], [data-dot]';
    if (!('IntersectionObserver' in window)) {
      $$(sel).forEach(function (n) { n.classList.add('zq-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('zq-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    var scan = function () {
      $$(sel).forEach(function (n) { if (!n.classList.contains('zq-in')) io.observe(n); });
    };
    scan();
    setTimeout(scan, 600);
  })();
})();
