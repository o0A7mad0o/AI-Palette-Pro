import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import {
  contrastText,
  kmeans,
  loadImagePixels,
  rgbToHex,
  suggestFonts,
  type RGB,
  type FontSuggestion,
} from "@/lib/palette";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast, Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "AI Palette Pro — مُستخرج الهوية البصرية الذكي" },
      {
        name: "description",
        content:
          "ارفع صورة لاستخراج لوحة ألوان متناسقة بأكواد Hex ومقترحات خطوط، بالاعتماد على خوارزمية K-Means.",
      },
    ],
  }),
});

type Swatch = { rgb: RGB; hex: string; share: number };

function Index() {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [swatches, setSwatches] = useState<Swatch[]>([]);
  const [fonts, setFonts] = useState<FontSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [k, setK] = useState(6);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("الرجاء اختيار ملف صورة صالح");
        return;
      }
      setLoading(true);
      try {
        const { pixels, dataUrl } = await loadImagePixels(file, 220);
        const { centers, counts } = kmeans(pixels, k);
        const total = counts.reduce((a, b) => a + b, 0) || 1;
        const sw: Swatch[] = centers.map((rgb, i) => ({
          rgb,
          hex: rgbToHex(rgb),
          share: counts[i] / total,
        }));
        setImgUrl(dataUrl);
        setSwatches(sw);
        setFonts(suggestFonts(centers));
      } catch {
        toast.error("تعذّر تحليل الصورة");
      } finally {
        setLoading(false);
      }
    },
    [k],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    toast.success(`تم نسخ ${hex}`);
  };

  const exportPalette = () => {
    if (!swatches.length) return;
    const txt = swatches.map((s) => s.hex).join("\n");
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "palette.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <Toaster richColors position="top-center" />

      {/* Hero */}
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-90"
          style={{ background: "var(--gradient-hero)" }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-black/10" aria-hidden />
        <div className="container mx-auto px-6 pt-16 pb-24 text-center text-white">
          <p className="mb-3 text-sm tracking-widest uppercase opacity-80">
            AI Palette Pro
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl md:text-6xl font-bold leading-tight">
            مُستخرج الهوية البصرية الذكي
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg opacity-90">
            ارفع صورة، ودع خوارزمية K-Means تستخرج لك لوحة ألوان متناسقة مع
            مقترحات خطوط تليق بروح التصميم.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-6 -mt-16 pb-24">
        {/* Uploader */}
        <Card
          className="mx-auto max-w-3xl rounded-3xl border-0 p-8 md:p-10"
          style={{ boxShadow: "var(--shadow-elegant)" }}
        >
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className="cursor-pointer rounded-2xl border-2 border-dashed border-primary/40 bg-secondary/40 p-10 text-center transition hover:border-primary hover:bg-secondary"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl">
              ⬆
            </div>
            <p className="text-lg font-semibold">اسحب صورتك هنا أو اضغط للاختيار</p>
            <p className="mt-1 text-sm text-muted-foreground">
              JPG / PNG / WEBP — تتم المعالجة محلياً في متصفحك دون رفعها لأي خادم
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <label className="flex items-center gap-3 text-sm">
              عدد الألوان:
              <select
                value={k}
                onChange={(e) => setK(Number(e.target.value))}
                className="rounded-md border border-input bg-background px-3 py-1.5"
              >
                {[4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <Button
              variant="outline"
              disabled={!swatches.length}
              onClick={exportPalette}
            >
              تنزيل اللوحة (.txt)
            </Button>
          </div>
        </Card>

        {/* Result */}
        {loading && (
          <p className="mt-10 text-center text-muted-foreground animate-pulse">
            جاري تحليل الصورة…
          </p>
        )}

        {imgUrl && swatches.length > 0 && (
          <section className="mt-12 grid gap-8 md:grid-cols-5">
            <Card
              className="md:col-span-2 overflow-hidden rounded-3xl border-0"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <img src={imgUrl} alt="الصورة المحللة" className="w-full h-full object-cover" />
            </Card>

            <div className="md:col-span-3 space-y-6">
              <Card
                className="rounded-3xl border-0 p-6"
                style={{ boxShadow: "var(--shadow-soft)" }}
              >
                <h2 className="mb-4 text-xl font-bold">لوحة الألوان المستخرجة</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {swatches.map((s) => {
                    const fg = contrastText(s.rgb);
                    return (
                      <button
                        key={s.hex}
                        onClick={() => copyHex(s.hex)}
                        className="group relative h-28 rounded-xl text-left transition hover:scale-[1.03]"
                        style={{ backgroundColor: s.hex, color: fg }}
                      >
                        <div className="absolute bottom-2 right-3 left-3 flex items-center justify-between text-xs font-semibold">
                          <span className="font-mono">{s.hex}</span>
                          <span className="opacity-80">
                            {(s.share * 100).toFixed(0)}%
                          </span>
                        </div>
                        <span className="absolute top-2 right-3 text-[10px] opacity-0 group-hover:opacity-80 transition">
                          نسخ
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Card>

              <Card
                className="rounded-3xl border-0 p-6"
                style={{ boxShadow: "var(--shadow-soft)" }}
              >
                <h2 className="mb-4 text-xl font-bold">خطوط مقترحة</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {fonts.map((f) => (
                    <div
                      key={f.name}
                      className="rounded-xl border bg-secondary/40 p-4"
                    >
                      <p className="text-xs text-muted-foreground">{f.role}</p>
                      <p
                        className="mt-1 text-2xl font-semibold"
                        style={{ fontFamily: f.cssFamily }}
                      >
                        {f.name}
                      </p>
                      <p
                        className="mt-1 text-sm text-muted-foreground"
                        style={{ fontFamily: f.cssFamily }}
                      >
                        {f.sample}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* About */}
        <section className="mx-auto mt-20 max-w-3xl text-center">
          <h2 className="text-2xl font-bold">كيف يعمل؟</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            يقوم النظام بتصغير الصورة، استخراج بكسلاتها، ثم تطبيق خوارزمية
            التصنيف <span className="font-mono">K-Means</span> لإيجاد المراكز
            اللونية الأكثر هيمنة وتمثيلاً للهوية البصرية للصورة. النتيجة: لوحة
            ألوان جاهزة للنسخ والاستخدام.
          </p>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        مشروع جامعي — AI Palette Pro © 2026
      </footer>
    </div>
  );
}
