const $ = (id) => document.getElementById(id);
$("tk").innerHTML = "¡FELIZ CUMPLEAÑOS, SAM! ✦ ¡POW! ✦ ¡ZAP! ✦ ¡THWIP! ✦ ".repeat(8);
// confetti
const c = $("fx"),
  x = c.getContext("2d");
let P = [],
  run = false;
function size() {
  c.width = innerWidth;
  c.height = innerHeight;
}
size();
addEventListener("resize", size);
const cols = ["#e3122c", "#1b3a9e", "#ffd21f", "#ffffff"];
function burst(ox, oy, n = 120) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2,
      s = 4 + Math.random() * 9;
    P.push({
      x: ox,
      y: oy,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s - 4,
      l: 80 + Math.random() * 50,
      w: 6 + Math.random() * 8,
      c: cols[i % 4],
      web: i % 5 === 0,
    });
  }
  if (!run) {
    run = true;
    tick();
  }
}
function tick() {
  x.clearRect(0, 0, c.width, c.height);
  P = P.filter((p) => p.l-- > 0);
  for (const p of P) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.25;
    p.vx *= 0.99;
    x.globalAlpha = Math.min(1, p.l / 30);
    x.fillStyle = p.c;
    x.strokeStyle = "#fff";
    x.lineWidth = 2;
    if (p.web) {
      x.beginPath();
      for (let k = 0; k < 3; k++) {
        const a = (k * Math.PI) / 3;
        x.moveTo(p.x - Math.cos(a) * 9, p.y - Math.sin(a) * 9);
        x.lineTo(p.x + Math.cos(a) * 9, p.y + Math.sin(a) * 9);
      }
      x.stroke();
    } else x.fillRect(p.x, p.y, p.w, p.w * 0.6);
  }
  if (P.length) requestAnimationFrame(tick);
  else {
    run = false;
    x.clearRect(0, 0, c.width, c.height);
  }
}
$("go").onclick = () => {
  const r = $("go").getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2);
};
// velitas
const xs = [70, 110, 150, 190, 230],
  g = $("candles");
xs.forEach((cx, i) => {
  g.insertAdjacentHTML(
    "beforeend",
    `<g class="candle" tabindex="0" role="button" aria-label="Apagar velita ${i + 1}" data-i="${i}">
  <rect x="${cx - 7}" y="62" width="14" height="48" fill="${i % 2 ? "#1b3a9e" : "#ffd21f"}" stroke="#12122b" stroke-width="4"/>
  <path class="flame" d="M${cx} 22C${cx + 12} 38 ${cx + 10} 54 ${cx} 56C${cx - 10} 54 ${cx - 12} 38 ${cx} 22Z" fill="#ff9a1f" stroke="#12122b" stroke-width="3"/></g>`,
  );
});
const msgs = ["¡Queda una menos!", "¡Así se hace!", "¡Ya casi!", "¡Última velita!"];
function check() {
  const lit = g.querySelectorAll(".candle:not(.out)").length;
  if (!lit) {
    $("cmsg").textContent = "¡Deseo concedido, Sam!";
    const r = $("cake").getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + 40, 200);
  } else if (lit < 5) $("cmsg").textContent = msgs[4 - lit] || "¡Sigue!";
}
g.addEventListener("click", (e) => {
  const k = e.target.closest(".candle");
  if (k && !k.classList.contains("out")) {
    k.classList.add("out");
    check();
  }
});
g.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    e.target.closest(".candle")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  }
});
$("relight").onclick = () => {
  g.querySelectorAll(".candle").forEach((k) => k.classList.remove("out"));
  $("cmsg").textContent = "Toca cada velita para apagarla";
};
// muro (solo en este navegador)
const KEY = "sam-notes";
let notes = [
  { n: "Spiderman", m: "¡Feliz cumple, Sam! Tu vecino arácnido te manda un abrazo pegajoso." },
];
try {
  const s = JSON.parse(localStorage.getItem(KEY));
  if (Array.isArray(s) && s.length) notes = s;
} catch (e) {}
function draw() {
  const box = $("notes");
  box.innerHTML = "";
  notes.forEach((t) => {
    const d = document.createElement("div");
    d.className = "note";
    const a = document.createElement("strong");
    a.textContent = t.n;
    const p = document.createElement("span");
    p.textContent = t.m;
    d.append(a, p);
    box.append(d);
  });
}
$("post").onclick = () => {
  const n = $("who").value.trim() || "Un amigo",
    m = $("msg").value.trim();
  if (!m) {
    $("msg").focus();
    return;
  }
  notes.unshift({ n, m });
  notes = notes.slice(0, 30);
  try {
    localStorage.setItem(KEY, JSON.stringify(notes));
  } catch (e) {}
  $("msg").value = "";
  draw();
  const r = $("post").getBoundingClientRect();
  burst(r.left + 40, r.top, 50);
};
draw();
