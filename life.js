// Conway's Game of Life in the background, driven by the footer terminal.
// Cheap on purpose: one coarse grid (~14px cells), ~8 steps/s, nothing runs while the tab is hidden.
(() => {
  const CELL = 14, BASE_MS = 125;
  const DIM = 'rgba(150, 245, 170, 0.05)', NEW = 'rgba(190, 255, 205, 0.18)';

  const PATTERNS = {
    glider: ['.#.', '..#', '###'],
    lwss: ['.#..#', '#....', '#...#', '####.'],
    rpent: ['.##', '##.', '.#.'],
    acorn: ['.#.....', '...#...', '##..###'],
    diehard: ['......#.', '##......', '.#...###'],
    pulsar: ['..###...###..', '.............', '#....#.#....#', '#....#.#....#', '#....#.#....#',
      '..###...###..', '.............', '..###...###..', '#....#.#....#', '#....#.#....#',
      '#....#.#....#', '.............', '..###...###..'],
    gun: ['........................#...........', '......................#.#...........',
      '............##......##............##', '...........#...#....##............##',
      '##........#.....#...##..............', '##........#...#.##....#.#...........',
      '..........#.....#.......#...........', '...........#...#....................',
      '............##......................'],
  };

  // Each visitor gets their own board: seed = hash(browser traits + time of their first visit).
  // Hashed locally, never sent anywhere. Without localStorage it falls back to this load's time.
  let first = Date.now();
  // stored as "<ms>|<easter egg>"; parseInt stops at the "|", so only the timestamp feeds the seed
  try {
    first = parseInt(localStorage.getItem('life-first')) ||
      (localStorage.setItem('life-first', `${first}|You found an easter egg! https://www.youtube.com/watch?v=dQw4w9WgXcQ`), first);
  } catch {}
  const traits = [navigator.userAgent, navigator.language, navigator.hardwareConcurrency, screen.width, screen.height,
    screen.colorDepth, devicePixelRatio, Intl.DateTimeFormat().resolvedOptions().timeZone, first].join('|');
  let h = 0x811c9dc5;  // FNV-1a
  for (let i = 0; i < traits.length; i++) h = Math.imul(h ^ traits.charCodeAt(i), 0x01000193);
  let universe = h >>> 0, s = universe, speed = 1;
  const rand = () => {  // mulberry32
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const canvas = document.getElementById('life');
  const ctx = canvas.getContext('2d');
  let cols = 0, rows = 0, cur, next, age, gen = 0, timer = null, manual = false;
  let paused = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    const c = Math.ceil(innerWidth / CELL), r = Math.ceil(innerHeight / CELL);
    if (c === cols && r === rows) return;
    const old = cur, oc = cols, or = rows;
    cols = c; rows = r;
    cur = new Uint8Array(c * r); next = new Uint8Array(c * r); age = new Uint8Array(c * r).fill(9);
    canvas.width = c * CELL; canvas.height = r * CELL;
    if (old) for (let y = 0; y < Math.min(r, or); y++) for (let x = 0; x < Math.min(c, oc); x++) cur[y * c + x] = old[y * oc + x];
    else seed();
    draw();
  }

  // each cell hashes (universe, x, y), so a shared universe starts the same on any screen size
  function seed(density = 0.18) {
    for (let i = 0; i < cur.length; i++) {
      let t = universe ^ Math.imul(i % cols, 0x27d4eb2d) ^ Math.imul((i / cols) | 0, 0x165667b1);
      t = Math.imul(t ^ (t >>> 15), 0x2c1b3c6d);
      t = Math.imul(t ^ (t >>> 12), 0x297a2d39);
      cur[i] = ((t ^ (t >>> 15)) >>> 0) / 4294967296 < density ? 1 : 0;
      age[i] = 9;
    }
  }

  function step() {
    for (let y = 0; y < rows; y++) {
      const up = ((y + rows - 1) % rows) * cols, mid = y * cols, dn = ((y + 1) % rows) * cols;
      for (let x = 0; x < cols; x++) {
        const l = (x + cols - 1) % cols, r = (x + 1) % cols;
        const n = cur[up + l] + cur[up + x] + cur[up + r] + cur[mid + l] + cur[mid + r] + cur[dn + l] + cur[dn + x] + cur[dn + r];
        const i = mid + x, alive = n === 3 || (n === 2 && cur[i]);
        next[i] = alive ? 1 : 0;
        age[i] = alive ? (cur[i] ? Math.min(age[i] + 1, 9) : 0) : 9;
      }
    }
    [cur, next] = [next, cur];
    // keep an untouched board from settling into still lifes; leave it alone once someone has typed
    if (!manual && ++gen % 400 === 0) place(rand() < 0.5 ? 'rpent' : 'acorn');
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const [style, test] of [[DIM, () => true], [NEW, i => age[i] < 4]]) {
      ctx.fillStyle = style;
      for (let i = 0; i < cur.length; i++) {
        if (cur[i] && test(i)) ctx.fillRect((i % cols) * CELL + 1, ((i / cols) | 0) * CELL + 1, CELL - 2, CELL - 2);
      }
    }
  }

  function place(name, x = rand() * cols | 0, y = rand() * rows | 0) {
    PATTERNS[name].forEach((row, dy) => [...row].forEach((ch, dx) => {
      if (ch === '#') {
        const i = ((y + dy) % rows + rows) % rows * cols + ((x + dx) % cols + cols) % cols;
        cur[i] = 1; age[i] = 0;
      }
    }));
    draw();
    return [x, y];
  }

  function tick() {
    timer = null;
    if (paused || document.hidden) return;
    step(); draw();
    timer = setTimeout(tick, BASE_MS / speed);
  }
  const run = () => { if (!timer) timer = setTimeout(tick, BASE_MS / speed); };

  // ---- terminal ----
  const form = document.getElementById('term'), input = document.getElementById('cmd'), out = document.getElementById('term-out');
  const say = (...lines) => { out.textContent = [...out.textContent.split('\n').filter(Boolean), ...lines].slice(-10).join('\n'); };
  const names = Object.keys(PATTERNS).join(' ');

  function exec(line) {
    // cmd, cmd a b, cmd(a,b)
    const m = line.trim().toLowerCase().match(/^([a-z]+)\s*(?:\(([^)]*)\)|\s(.*))?$/);
    if (!m) return say(`> can't parse "${line}". try help`);
    const cmd = m[1], args = (m[2] ?? m[3] ?? '').split(/[\s,]+/).filter(Boolean);
    const hex = n => '#' + n.toString(16).padStart(8, '0');
    if (PATTERNS[cmd]) {
      const [x, y] = args.map(Number);
      if (args.length && (args.length !== 2 || !Number.isInteger(x) || !Number.isInteger(y))) return say(`> usage: ${cmd}(x,y)`);
      manual = true;
      const [px, py] = args.length ? place(cmd, x, y) : place(cmd);
      return say(`> spawned ${cmd} at (${px}, ${py})`);
    }
    switch (cmd) {
      case 'help': return say('> this background is Conway\'s Game of Life.',
        `> patterns: ${names}`, '> place one: glider(10,5) or glider 10 5, or just glider for anywhere',
        '> also: seed [hex], speed(x), clear, pause, play',
        `> grid is ${cols}x${rows}, (0,0) is top-left. universe ${hex(universe)}, share it with seed ${hex(universe)}`);
      case 'ls': return say(`> ${names}`);
      case 'seed': {
        if (args.length && !/^(#|0x)?[0-9a-f]{1,8}$/.test(args[0])) return say('> usage: seed or seed #d23d2fc8');
        universe = args.length ? parseInt(args[0].replace(/^(#|0x)/, ''), 16) : (rand() * 4294967296) >>> 0;
        manual = false; seed(); draw();
        return say(`> universe ${hex(universe)}`);
      }
      case 'speed': {
        const x = Number(args[0]);
        if (!args.length) return say(`> speed ${speed}`);
        if (!(x >= 0.1 && x <= 10)) return say('> usage: speed(x), 0.1 to 10, normal is 1');
        speed = x; clearTimeout(timer); timer = null; run();
        return say(`> speed ${speed}`);
      }
      case 'clear': manual = true; cur.fill(0); draw(); out.textContent = ''; return;
      case 'pause': paused = true; return say('> paused. play to resume');
      case 'play': paused = false; run(); return say('> running');
      default: return say(`> ${cmd}: command not found. try help`);
    }
  }

  form.addEventListener('submit', e => { e.preventDefault(); if (input.value.trim()) exec(input.value); input.value = ''; });
  document.addEventListener('visibilitychange', run);
  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 200); });

  resize();
  if (paused) { for (let i = 0; i < 30; i++) step(); draw(); }  // reduced motion: one settled still frame
  run();
})();
