// Simple K-Means clustering for extracting a dominant color palette from an image.

export type RGB = [number, number, number];

export function rgbToHex([r, g, b]: RGB): string {
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function luminance([r, g, b]: RGB): number {
  // Relative luminance (sRGB)
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

export function contrastText(rgb: RGB): string {
  return luminance(rgb) > 0.45 ? "#0F0F12" : "#FFFFFF";
}

function distanceSq(a: RGB, b: RGB): number {
  const dr = a[0] - b[0],
    dg = a[1] - b[1],
    db = a[2] - b[2];
  return dr * dr + dg * dg + db * db;
}

export async function loadImagePixels(
  file: File,
  maxSize = 200,
): Promise<{ pixels: RGB[]; dataUrl: string }> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataUrl;
  });

  const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;

  const pixels: RGB[] = [];
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 125) continue;
    pixels.push([data[i], data[i + 1], data[i + 2]]);
  }
  return { pixels, dataUrl };
}

export function kmeans(pixels: RGB[], k = 6, maxIter = 12): { centers: RGB[]; counts: number[] } {
  if (pixels.length === 0) return { centers: [], counts: [] };

  // Seed with k pixels spread out (k-means++ lite)
  const centers: RGB[] = [];
  centers.push(pixels[Math.floor(Math.random() * pixels.length)]);
  while (centers.length < k) {
    let bestPx: RGB = pixels[0];
    let bestD = -1;
    // Sample to keep it fast
    for (let s = 0; s < 200; s++) {
      const p = pixels[Math.floor(Math.random() * pixels.length)];
      let minD = Infinity;
      for (const c of centers) minD = Math.min(minD, distanceSq(p, c));
      if (minD > bestD) {
        bestD = minD;
        bestPx = p;
      }
    }
    centers.push(bestPx);
  }

  const assign = new Int32Array(pixels.length);

  for (let iter = 0; iter < maxIter; iter++) {
    let changed = false;
    for (let i = 0; i < pixels.length; i++) {
      let best = 0;
      let bestD = Infinity;
      for (let c = 0; c < centers.length; c++) {
        const d = distanceSq(pixels[i], centers[c]);
        if (d < bestD) {
          bestD = d;
          best = c;
        }
      }
      if (assign[i] !== best) {
        assign[i] = best;
        changed = true;
      }
    }

    const sums = Array.from({ length: k }, () => [0, 0, 0, 0]);
    for (let i = 0; i < pixels.length; i++) {
      const c = assign[i];
      sums[c][0] += pixels[i][0];
      sums[c][1] += pixels[i][1];
      sums[c][2] += pixels[i][2];
      sums[c][3] += 1;
    }
    for (let c = 0; c < k; c++) {
      if (sums[c][3] > 0) {
        centers[c] = [sums[c][0] / sums[c][3], sums[c][1] / sums[c][3], sums[c][2] / sums[c][3]];
      }
    }
    if (!changed) break;
  }

  const counts = new Array(k).fill(0);
  for (let i = 0; i < pixels.length; i++) counts[assign[i]]++;

  // Sort by frequency descending
  const order = counts
    .map((c, i) => ({ c, i }))
    .sort((a, b) => b.c - a.c)
    .map((x) => x.i);

  return {
    centers: order.map((i) => centers[i].map((v) => Math.round(v)) as RGB),
    counts: order.map((i) => counts[i]),
  };
}

// Suggest font pairings based on overall palette mood.
export type FontSuggestion = { name: string; role: string; cssFamily: string; sample: string };

export function suggestFonts(palette: RGB[]): FontSuggestion[] {
  if (palette.length === 0) return [];
  const avgL = palette.reduce((s, c) => s + luminance(c), 0) / palette.length;
  const avgSat = (() => {
    let total = 0;
    for (const [r, g, b] of palette) {
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      total += max === 0 ? 0 : (max - min) / max;
    }
    return total / palette.length;
  })();

  // Mood selection
  if (avgL < 0.25) {
    return [
      {
        name: "Playfair Display",
        role: "عناوين فاخرة وداكنة",
        cssFamily: "'Playfair Display', serif",
        sample: "Aa أبجد",
      },
      {
        name: "Inter",
        role: "نصوص نظيفة وعصرية",
        cssFamily: "'Inter', sans-serif",
        sample: "Aa أبجد",
      },
    ];
  }
  if (avgSat > 0.55) {
    return [
      {
        name: "Poppins",
        role: "عناوين جريئة ومرحة",
        cssFamily: "'Poppins', sans-serif",
        sample: "Aa أبجد",
      },
      {
        name: "Cairo",
        role: "نصوص عربية مقروءة",
        cssFamily: "'Cairo', sans-serif",
        sample: "Aa أبجد",
      },
    ];
  }
  if (avgL > 0.7) {
    return [
      {
        name: "Cormorant Garamond",
        role: "عناوين أنيقة وهادئة",
        cssFamily: "'Cormorant Garamond', serif",
        sample: "Aa أبجد",
      },
      {
        name: "Tajawal",
        role: "نصوص عربية ناعمة",
        cssFamily: "'Tajawal', sans-serif",
        sample: "Aa أبجد",
      },
    ];
  }
  return [
    {
      name: "Montserrat",
      role: "عناوين متوازنة وحديثة",
      cssFamily: "'Montserrat', sans-serif",
      sample: "Aa أبجد",
    },
    {
      name: "Cairo",
      role: "نصوص عربية واضحة",
      cssFamily: "'Cairo', sans-serif",
      sample: "Aa أبجد",
    },
  ];
}
