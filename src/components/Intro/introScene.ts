/**
 * Moonlit garden painted on a 2D canvas: sky + moon (layer 0), Fuji + ridges + torii (layer 1),
 * sakura branch (layer 2), twinkling stars and falling petals, with pointer parallax per layer.
 * Framework-free; uses its own seeded RNG so the composition is identical on every load.
 */
export interface Moon {
  x: number;
  y: number;
  r: number;
}

interface Petal {
  x: number;
  y: number;
  s: number;
  r: number;
  vr: number;
  vx: number;
  vy: number;
  ph: number;
  d: number;
}

export function startIntroScene(cv: HTMLCanvasElement, onMoon: (m: Moon) => void, still = false): () => void {
  const g = cv.getContext("2d")!;
  let W = 0,
    H = 0,
    pr = 1,
    layers: HTMLCanvasElement[] = [],
    petals: Petal[] = [],
    stars: [number, number, number, number][] = [],
    moon: Moon = { x: 0, y: 0, r: 0 },
    run = true,
    mx = 0,
    my = 0,
    sx = 0,
    sy = 0;
  let seed = 11;
  const R = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const rnd = (a: number, b: number) => a + R() * (b - a);

  function layer(draw: (x: CanvasRenderingContext2D) => void) {
    const c = document.createElement("canvas");
    c.width = W * pr;
    c.height = H * pr;
    const x = c.getContext("2d")!;
    x.scale(pr, pr);
    draw(x);
    return c;
  }
  function petal(x: CanvasRenderingContext2D, px: number, py: number, s: number, rot: number, col: string, a: number) {
    x.save();
    x.translate(px, py);
    x.rotate(rot);
    x.globalAlpha = a;
    x.fillStyle = col;
    x.beginPath();
    x.moveTo(0, -s);
    x.bezierCurveTo(s * 0.9, -s * 0.6, s * 0.7, s * 0.7, 0, s);
    x.bezierCurveTo(-s * 0.7, s * 0.7, -s * 0.9, -s * 0.6, 0, -s);
    x.fill();
    x.restore();
  }
  function blossom(x: CanvasRenderingContext2D, px: number, py: number, s: number) {
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2;
      petal(
        x,
        px + Math.cos(a) * s * 0.55,
        py + Math.sin(a) * s * 0.55,
        s * 0.55,
        a + Math.PI / 2,
        k % 2 ? "#f7c6d3" : "#efa6bd",
        1,
      );
    }
    x.fillStyle = "#b9405f";
    x.beginPath();
    x.arc(px, py, s * 0.18, 0, 7);
    x.fill();
    x.fillStyle = "#ffe08a";
    for (let k = 0; k < 6; k++) {
      x.beginPath();
      x.arc(px + Math.cos(k) * s * 0.3, py + Math.sin(k) * s * 0.3, 1.1, 0, 7);
      x.fill();
    }
  }
  const np = (init: boolean): Petal => ({
    x: rnd(-50, W + 50),
    y: init ? rnd(-H, H) : rnd(-80, -10),
    s: rnd(4, 8),
    r: rnd(0, 6),
    vr: rnd(-1.5, 1.5),
    vx: rnd(10, 40),
    vy: rnd(25, 60),
    ph: rnd(0, 6),
    d: rnd(0.5, 1.4),
  });

  function build() {
    pr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    cv.width = W * pr;
    cv.height = H * pr;
    seed = 11;
    const mob = W < 760,
      U = Math.min(W, H);
    moon = { x: mob ? W * 0.68 : W * 0.69, y: mob ? H * 0.24 : H * 0.36, r: mob ? U * 0.2 : U * 0.18 };
    layers = [
      layer((x) => {
        const sk = x.createLinearGradient(0, 0, 0, H);
        sk.addColorStop(0, "#05071a");
        sk.addColorStop(0.5, "#171a48");
        sk.addColorStop(0.8, "#46356c");
        sk.addColorStop(1, "#7d4f6c");
        x.fillStyle = sk;
        x.fillRect(0, 0, W, H);
        const hl = x.createRadialGradient(moon.x, moon.y, moon.r * 0.8, moon.x, moon.y, moon.r * 3.6);
        hl.addColorStop(0, "rgba(255,232,196,.32)");
        hl.addColorStop(1, "rgba(255,232,196,0)");
        x.fillStyle = hl;
        x.fillRect(0, 0, W, H);
        const mg = x.createRadialGradient(moon.x - moon.r * 0.3, moon.y - moon.r * 0.3, 4, moon.x, moon.y, moon.r);
        mg.addColorStop(0, "#fffaf0");
        mg.addColorStop(1, "#efdcb6");
        x.fillStyle = mg;
        x.beginPath();
        x.arc(moon.x, moon.y, moon.r, 0, 7);
        x.fill();
        x.save();
        x.beginPath();
        x.arc(moon.x, moon.y, moon.r, 0, 7);
        x.clip();
        x.filter = "blur(" + moon.r * 0.09 + "px)";
        x.fillStyle = "rgba(170,148,120,.16)";
        (
          [
            [-0.33, -0.12, 0.32],
            [0.3, 0.2, 0.25],
            [-0.05, 0.46, 0.2],
            [0.46, -0.4, 0.16],
          ] as const
        ).forEach(([a, b, c]) => {
          x.beginPath();
          x.arc(moon.x + a * moon.r, moon.y + b * moon.r, c * moon.r, 0, 7);
          x.fill();
        });
        x.restore();
      }),
      layer((x) => {
        const fx = mob ? W * 0.42 : W * 0.6;
        const L: [number, string, number][] = [
          [0.66, "#29295a", 0],
          [0.73, "#212049", 1],
          [0.81, "#18173a", 2],
          [0.9, "#100f27", 3],
        ];
        L.forEach(([yy, c, k]) => {
          const y0 = H * yy;
          x.fillStyle = c;
          x.beginPath();
          x.moveTo(-40, H);
          for (let px = -40; px <= W + 40; px += 6) {
            let y = y0 + Math.sin(px * 0.003 + k * 1.7) * H * 0.04 + Math.sin(px * 0.011 + k) * H * 0.014;
            if (k === 0) y = Math.min(y, y0 + H * 0.1 - Math.max(0, H * 0.32 - Math.abs(px - fx) * 0.62));
            x.lineTo(px, y);
          }
          x.lineTo(W + 40, H);
          x.fill();
          if (k === 0) {
            const top = H * 0.66 + H * 0.1 - H * 0.32;
            const sc = x.createLinearGradient(0, top, 0, top + H * 0.12);
            sc.addColorStop(0, "rgba(232,229,248,.85)");
            sc.addColorStop(1, "rgba(232,229,248,0)");
            x.fillStyle = sc;
            x.beginPath();
            x.moveTo(fx, top);
            x.lineTo(fx + H * 0.16, top + H * 0.1);
            x.lineTo(fx + H * 0.1, top + H * 0.095);
            x.lineTo(fx + H * 0.05, top + H * 0.12);
            x.lineTo(fx, top + H * 0.095);
            x.lineTo(fx - H * 0.05, top + H * 0.12);
            x.lineTo(fx - H * 0.1, top + H * 0.095);
            x.lineTo(fx - H * 0.16, top + H * 0.1);
            x.fill();
          }
          const m = x.createLinearGradient(0, y0 - H * 0.03, 0, y0 + H * 0.1);
          m.addColorStop(0, "rgba(200,170,215,0)");
          m.addColorStop(0.6, "rgba(200,170,215,.13)");
          m.addColorStop(1, "rgba(200,170,215,0)");
          x.fillStyle = m;
          x.fillRect(0, y0 - H * 0.03, W, H * 0.13);
          if (k === 1 && !mob) {
            const tx = W * 0.82,
              ty = y0 + H * 0.02,
              s = H * 0.06;
            x.fillStyle = "#a8352b";
            x.fillRect(tx - s * 0.62, ty - s, s * 0.11, s);
            x.fillRect(tx + s * 0.51, ty - s, s * 0.11, s);
            x.fillRect(tx - s * 0.85, ty - s * 1.08, s * 1.7, s * 0.11);
            x.fillRect(tx - s * 0.7, ty - s * 0.82, s * 1.4, s * 0.07);
          }
        });
      }),
      layer((x) => {
        x.strokeStyle = "#0e0810";
        x.lineCap = "round";
        const s = mob ? 0.55 : 1,
          ox = W,
          oy = 0;
        function bz(pts: [number, number][], w: number) {
          for (let i = 0; i < pts.length - 1; i++) {
            const a = pts[i]!,
              b = pts[i + 1]!;
            x.lineWidth = (w * (1 - i / pts.length) + 1.5) * s;
            x.beginPath();
            x.moveTo(ox - a[0] * s, oy + a[1] * s);
            x.quadraticCurveTo(
              ox - ((a[0] + b[0]) / 2) * s + rnd(-8, 8),
              oy + ((a[1] + b[1]) / 2) * s + rnd(-8, 8),
              ox - b[0] * s,
              oy + b[1] * s,
            );
            x.stroke();
          }
        }
        bz(
          [
            [-20, 30],
            [140, 90],
            [250, 120],
            [360, 190],
            [450, 210],
          ],
          26,
        );
        bz(
          [
            [140, 90],
            [190, 40],
            [270, 10],
          ],
          12,
        );
        bz(
          [
            [250, 120],
            [290, 200],
            [320, 260],
          ],
          10,
        );
        bz(
          [
            [360, 190],
            [420, 150],
            [480, 130],
          ],
          8,
        );
        bz(
          [
            [0, 200],
            [90, 230],
            [160, 300],
          ],
          12,
        );
        (
          [
            [450, 210],
            [480, 130],
            [320, 260],
            [270, 10],
            [160, 300],
            [380, 170],
            [210, 60],
            [290, 140],
            [120, 250],
            [420, 230],
            [230, 110],
            [340, 215],
            [500, 140],
            [180, 30],
            [100, 120],
          ] as const
        ).forEach(([px, py]) => {
          for (let k = 0; k < 4; k++)
            blossom(x, ox - (px + rnd(-26, 26)) * s, oy + (py + rnd(-22, 22)) * s, rnd(9, 14) * s);
        });
      }),
    ];
    stars = [];
    for (let i = 0; i < 70; i++) stars.push([R() * W, R() * H * 0.55, R() * 1.4 + 0.3, R() * 6]);
    petals = [];
    for (let i = 0; i < (mob ? 28 : 55); i++) petals.push(np(true));
    onMoon({ ...moon });
  }

  let last = performance.now();
  function frame(now: number) {
    if (!run) return;
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = now / 1000;
    sx += (mx - sx) * (1 - Math.exp(-dt * 2.5));
    sy += (my - sy) * (1 - Math.exp(-dt * 2.5));
    g.setTransform(1, 0, 0, 1, 0, 0);
    const off: [number, number][] = [
      [4, 3],
      [12, 6],
      [26, 12],
    ];
    layers.forEach((L, i) => {
      const sc = 1.04;
      g.drawImage(
        L,
        (-sx * off[i]![0] - (W * (sc - 1)) / 2) * pr,
        (-sy * off[i]![1] - (H * (sc - 1)) / 2) * pr,
        W * sc * pr,
        H * sc * pr,
      );
      if (i === 0) {
        g.save();
        g.scale(pr, pr);
        stars.forEach((s) => {
          g.globalAlpha = 0.25 + 0.75 * Math.pow(0.5 + 0.5 * Math.sin(t * 1.3 + s[3]), 2);
          g.fillStyle = "#fff";
          g.fillRect(s[0] - sx * 4, s[1] - sy * 3, s[2], s[2]);
        });
        g.restore();
        g.globalAlpha = 1;
      }
    });
    g.save();
    g.scale(pr, pr);
    petals.forEach((p, i) => {
      if (!still) {
        p.x += (p.vx + Math.sin(t + p.ph) * 20) * dt * p.d;
        p.y += p.vy * dt * p.d;
        p.r += p.vr * dt;
      }
      if (p.y > H + 20 || p.x > W + 60) petals[i] = np(false);
      petal(g, p.x - sx * 20 * p.d, p.y - sy * 10 * p.d, p.s * p.d, p.r, "#f6c2cf", 0.55 + (0.4 * p.d) / 1.4);
    });
    g.restore();
  }
  const onMove = (e: PointerEvent) => {
    mx = (e.clientX / window.innerWidth) * 2 - 1;
    my = (e.clientY / window.innerHeight) * 2 - 1;
  };
  const onResize = () => {
    if (run) build();
  };
  window.addEventListener("pointermove", onMove);
  window.addEventListener("resize", onResize);
  build();
  requestAnimationFrame(frame);
  return () => {
    run = false;
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("resize", onResize);
  };
}
