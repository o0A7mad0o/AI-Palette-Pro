import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useLang } from "@/lib/i18n";

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
  const { lang, t } = useLang();
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [swatches, setSwatches] = useState<Swatch[]>([]);
  const [fonts, setFonts] = useState<FontSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [k, setK] = useState(6);
  const pixelsRef = useRef<RGB[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const analyze = useCallback((pixels: RGB[], kk: number) => {
    const { centers, counts } = kmeans(pixels, kk);
    const total = counts.reduce((a, b) => a + b, 0) || 1;
    const sw: Swatch[] = centers.map((rgb, i) => ({
      rgb,
      hex: rgbToHex(rgb),
      share: counts[i] / total,
    }));
    setSwatches(sw);
    setFonts(suggestFonts(centers));
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error(t("invalidImage"));
        return;
      }
      setLoading(true);
      try {
        const { pixels, dataUrl } = await loadImagePixels(file, 220);
        pixelsRef.current = pixels;
        setImgUrl(dataUrl);
        analyze(pixels, k);
      } catch {
        toast.error(t("analyzeFailed"));
      } finally {
        setLoading(false);
      }
    },
    [k, analyze],
  );

  useEffect(() => {
    if (pixelsRef.current) {
      setLoading(true);
      // defer to next tick to allow UI update
      const id = setTimeout(() => {
        analyze(pixelsRef.current!, k);
        setLoading(false);
      }, 0);
      return () => clearTimeout(id);
    }
  }, [k, analyze]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    toast.success(`${t("copied")} ${hex}`);
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
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-background text-foreground">
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
          <p className="mb-3 text-sm tracking-widest uppercase opacity-80 text-gray-900">
            {t("brand")}
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl md:text-6xl font-bold leading-tight text-neutral-500">
            {t("heroTitle")}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg opacity-90 text-neutral-600">
            {t("heroSubtitle")}
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
            <p className="text-lg font-semibold">{t("dropTitle")}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("dropHint")}
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
              {t("colorsCount")}
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
              {t("exportPalette")}
            </Button>
          </div>
        </Card>

        {/* Result */}
        {loading && (
          <p className="mt-10 text-center text-muted-foreground animate-pulse">
            {t("analyzing")}
          </p>
        )}

        {imgUrl && swatches.length > 0 && (
          <section className="mt-12 grid gap-8 md:grid-cols-5">
            <Card
              className="md:col-span-2 overflow-hidden rounded-3xl border-0"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <img src={imgUrl} alt={t("analyzedImage")} className="w-full h-full object-cover" />
            </Card>

            <div className="md:col-span-3 space-y-6">
              <Card
                className="rounded-3xl border-0 p-6"
                style={{ boxShadow: "var(--shadow-soft)" }}
              >
                <h2 className="mb-4 text-xl font-bold">{t("paletteTitle")}</h2>
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
                          {t("copy")}
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
                <h2 className="mb-4 text-xl font-bold">{t("fontsTitle")}</h2>
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

        {/* Project Plan CTA */}
        <section className="mx-auto mt-16 max-w-3xl text-center">
          <Card
            className="rounded-3xl border-0 p-8"
            style={{ boxShadow: "var(--shadow-elegant)" }}
          >
            <h2 className="text-2xl font-bold">خطة المشروع الكاملة</h2>
            <p className="mt-3 text-muted-foreground">
              اطّلع على وثيقة المشروع الجامعي بصيغة منسقة: الأهداف، البنية
              التقنية، سير العمل، وكيفية التشغيل.
            </p>
            <Link to="/plan" className="inline-block mt-5">
              <Button size="lg">عرض خطة المشروع</Button>
            </Link>
          </Card>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground space-y-1">
        <p>اعداد الطالب : احمد نبهان - الرقم الجامعي : 0130012510048</p>
        <p>مشروع جامعي — AI Palette Pro © 2026</p>
      </footer>
    </div>
  );
}
