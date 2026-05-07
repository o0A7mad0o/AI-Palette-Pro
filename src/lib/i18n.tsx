import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "ar" | "en";

type Dict = Record<string, { ar: string; en: string }>;

export const translations: Dict = {
  // Header / hero - index
  brand: { ar: "AI Palette Pro", en: "AI Palette Pro" },
  heroTitle: {
    ar: "مُستخرج الهوية البصرية الذكي",
    en: "Smart Visual Identity Extractor",
  },
  heroSubtitle: {
    ar: "ارفع صورة، ودع خوارزمية K-Means تستخرج لك لوحة ألوان متناسقة مع مقترحات خطوط تليق بروح التصميم.",
    en: "Upload an image and let the K-Means algorithm extract a harmonious color palette with font suggestions that match the design spirit.",
  },
  // Uploader
  dropTitle: { ar: "اسحب صورتك هنا أو اضغط للاختيار", en: "Drag your image here or click to select" },
  dropHint: {
    ar: "JPG / PNG / WEBP — تتم المعالجة محلياً في متصفحك دون رفعها لأي خادم",
    en: "JPG / PNG / WEBP — processed locally in your browser, never uploaded to any server",
  },
  colorsCount: { ar: "عدد الألوان:", en: "Number of colors:" },
  exportPalette: { ar: "تنزيل اللوحة (.txt)", en: "Export palette (.txt)" },
  analyzing: { ar: "جاري تحليل الصورة…", en: "Analyzing image…" },
  analyzedImage: { ar: "الصورة المحللة", en: "Analyzed image" },
  paletteTitle: { ar: "لوحة الألوان المستخرجة", en: "Extracted color palette" },
  fontsTitle: { ar: "خطوط مقترحة", en: "Suggested fonts" },
  copy: { ar: "نسخ", en: "Copy" },
  copied: { ar: "تم نسخ", en: "Copied" },
  invalidImage: { ar: "الرجاء اختيار ملف صورة صالح", en: "Please choose a valid image file" },
  analyzeFailed: { ar: "تعذّر تحليل الصورة", en: "Failed to analyze the image" },
  howTitle: { ar: "كيف يعمل؟", en: "How does it work?" },
  howBody: {
    ar: "يقوم النظام بتصغير الصورة، استخراج بكسلاتها، ثم تطبيق خوارزمية التصنيف K-Means لإيجاد المراكز اللونية الأكثر هيمنة وتمثيلاً للهوية البصرية للصورة. النتيجة: لوحة ألوان جاهزة للنسخ والاستخدام.",
    en: "The system downsizes the image, extracts its pixels, then applies the K-Means clustering algorithm to find the most dominant color centers representing the image's visual identity. The result: a palette ready to copy and use.",
  },
  planCtaTitle: { ar: "خطة المشروع الكاملة", en: "Full Project Plan" },
  planCtaBody: {
    ar: "اطّلع على وثيقة المشروع الجامعي بصيغة منسقة: الأهداف، البنية التقنية، سير العمل، وكيفية التشغيل.",
    en: "View the university project document: objectives, technical architecture, workflow, and how to run it.",
  },
  viewPlan: { ar: "عرض خطة المشروع", en: "View project plan" },
  footerStudent: {
    ar: "اعداد الطالب : احمد نبهان - الرقم الجامعي : 0130012510048",
    en: "Student: Ahmad Nabhan - University ID: 0130012510048",
  },
  footerCopy: {
    ar: "مشروع جامعي — AI Palette Pro © 2026",
    en: "University project — AI Palette Pro © 2026",
  },
  langToggle: { ar: "EN", en: "ع" },
  // Plan page
  planTitle: { ar: "خطة المشروع الجامعي", en: "University Project Plan" },
  planSubtitle: {
    ar: "نظام استخراج وتحليل الهوية البصرية المدعوم بالذكاء الاصطناعي",
    en: "An AI-powered visual identity extraction and analysis system",
  },
  back: { ar: "← العودة للموقع", en: "← Back to site" },
  s1: { ar: "نظرة عامة على المشروع", en: "1. Project Overview" },
  s1p1: {
    ar: "AI Palette Pro هو تطبيق تفاعلي يجمع بين الفن والذكاء الاصطناعي ليُساعد المصممين والهواة على بناء هوياتهم البصرية بطريقة سريعة وذكية. يقوم النظام بتحليل أي صورة يرفعها المستخدم باستخدام خوارزميات تعلّم آلي (تحديداً K-Means Clustering)، فيستخرج منها لوحة الألوان الأكثر هيمنة وتناسقاً، ثم يقترح أزواجاً من الخطوط التي تتناسب مع روح الصورة ومزاجها العام.",
    en: "AI Palette Pro is an interactive application that combines art with AI to help designers and hobbyists build visual identities quickly and intelligently. The system analyzes any uploaded image using machine learning (specifically K-Means Clustering) to extract the most dominant and harmonious color palette, then suggests font pairings that match the image's mood.",
  },
  s1p2: {
    ar: "الهدف هو تقليص الفجوة بين الإلهام البصري والتنفيذ العملي: بدلاً من قضاء ساعات في اختيار الألوان والخطوط يدوياً، يحصل المصمم على نقطة انطلاق احترافية خلال ثوانٍ.",
    en: "The goal is to bridge inspiration and execution: instead of spending hours picking colors and fonts manually, designers get a professional starting point in seconds.",
  },
  s2: { ar: "المشكلة والحاجة", en: "2. Problem & Need" },
  s3: { ar: "أهداف المشروع", en: "3. Project Goals" },
  s4: { ar: "الفئة المستهدفة", en: "4. Target Audience" },
  s5: { ar: "المميزات الرئيسية", en: "5. Key Features" },
  s6: { ar: "البنية التقنية", en: "6. Technical Architecture" },
  s7: { ar: "سير العمل (Workflow)", en: "7. Workflow" },
  s8: { ar: "الجدول الزمني المقترح", en: "8. Proposed Timeline" },
  s9: { ar: "معايير التقييم", en: "9. Evaluation Criteria" },
  s10: { ar: "مخرجات المشروع", en: "10. Project Deliverables" },
  s11: { ar: "كيفية تشغيل ملف المشروع", en: "11. How to Run the Project" },
  s12: { ar: "ملاحظات مهمة", en: "12. Important Notes" },
  s13: { ar: "الخاتمة", en: "13. Conclusion" },
};

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string }>({
  lang: "ar",
  setLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem("lang") as Lang)) || "ar";
    setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  const t = (key: string) => translations[key]?.[lang] ?? key;

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

export function LanguageToggle() {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(lang === "ar" ? "en" : "ar")}
      className="fixed top-4 right-4 z-50 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-gray-800 shadow-md backdrop-blur hover:bg-white transition"
      aria-label="Toggle language"
    >
      {lang === "ar" ? "EN" : "ع"}
    </button>
  );
}
