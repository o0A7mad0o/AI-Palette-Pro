import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/plan")({
  component: PlanPage,
  head: () => ({
    meta: [
      { title: "خطة المشروع — AI Palette Pro" },
      {
        name: "description",
        content:
          "خطة مشروع AI Palette Pro الجامعية: نظرة عامة، الأهداف، البنية التقنية، وكيفية التشغيل.",
      },
    ],
  }),
});

function Section({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card
      className="rounded-2xl border-0 p-6 md:p-8"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
          {num}
        </span>
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
      </div>
      <div className="space-y-3 leading-relaxed text-foreground/90">
        {children}
      </div>
    </Card>
  );
}

function Table({
  headers,
  rows,
  align,
}: {
  headers: [string, string];
  rows: [string, string][];
  align: "right" | "left";
}) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-secondary">
          <tr>
            <th className={`px-4 py-2 text-${align} font-semibold`}>{headers[0]}</th>
            <th className={`px-4 py-2 text-${align} font-semibold`}>{headers[1]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([a, b], i) => (
            <tr key={i} className="border-t">
              <td className="px-4 py-2 font-medium">{a}</td>
              <td className="px-4 py-2 text-foreground/80">{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PlanPage() {
  const { lang, t } = useLang();
  const isAr = lang === "ar";
  const align = isAr ? "right" : "left";
  const listPad = isAr ? "pr-6" : "pl-6";

  const tr = (ar: string, en: string) => (isAr ? ar : en);

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-background text-foreground">
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-90"
          style={{ background: "var(--gradient-hero)" }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-black/10" aria-hidden />
        <div className="container mx-auto px-6 pt-14 pb-20 text-center text-white">
          <p className="mb-3 text-sm tracking-widest uppercase opacity-90 text-gray-800">
            AI Palette Pro
          </p>
          <h1 className="mx-auto mt-4 max-w-2xl text-base md:text-lg opacity-100 text-gray-600">
            {t("planTitle")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base opacity-100 text-gray-600 md:text-lg">
            {t("planSubtitle")}
          </p>
          <div className="mt-6">
            <Link to="/">
              <Button variant="secondary">{t("back")}</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 -mt-12 pb-20 space-y-6 max-w-4xl">
        <Section num="1" title={tr("نظرة عامة على المشروع", "Project Overview")}>
          <p>{t("s1p1")}</p>
          <p>{t("s1p2")}</p>
        </Section>

        <Section num="2" title={tr("المشكلة والحاجة", "Problem & Need")}>
          <ul className={`list-disc ${listPad} space-y-2`}>
            <li>{tr("صعوبة استخراج لوحة ألوان متناسقة من صورة مرجعية بسرعة ودقة.", "Difficulty extracting a coherent palette from a reference image quickly and accurately.")}</li>
            <li>{tr("غياب أداة عربية تربط بين تحليل الصور واقتراح الخطوط في مكان واحد.", "Lack of an Arabic tool combining image analysis and font suggestion in one place.")}</li>
            <li>{tr("هدر وقت المصممين المبتدئين في تجربة الألوان والخطوط بشكل عشوائي.", "Beginner designers waste time experimenting with colors and fonts randomly.")}</li>
            <li>{tr("الحاجة إلى أداة تعليمية تُظهر كيف يمكن للذكاء الاصطناعي أن يخدم قطاع التصميم.", "Need for an educational tool showing how AI can serve the design industry.")}</li>
          </ul>
        </Section>

        <Section num="3" title={tr("أهداف المشروع", "Project Goals")}>
          <ol className={`list-decimal ${listPad} space-y-2`}>
            <li>{tr("بناء واجهة تفاعلية بسيطة لرفع الصور وعرض النتائج فوراً.", "Build a simple interactive UI to upload images and view results instantly.")}</li>
            <li>{tr("تطبيق خوارزمية K-Means لاستخراج (5–8) ألوان مهيمنة من الصورة.", "Apply K-Means to extract 5–8 dominant colors from the image.")}</li>
            <li>{tr("عرض الألوان بصيغة HEX و RGB مع نسبة كل لون في الصورة.", "Display colors in HEX and RGB with each color's share in the image.")}</li>
            <li>{tr("اقتراح أزواج خطوط (عربية/إنجليزية) بناءً على مزاج اللوحة.", "Suggest font pairs (Arabic/English) based on the palette mood.")}</li>
            <li>{tr("توفير إمكانية نسخ الألوان وتصدير اللوحة للاستخدام في مشاريع أخرى.", "Allow copying colors and exporting the palette for other projects.")}</li>
          </ol>
        </Section>

        <Section num="4" title={tr("الفئة المستهدفة", "Target Audience")}>
          <ul className={`list-disc ${listPad} space-y-2`}>
            <li>{tr("المصممون الجرافيكيون ومصممو واجهات المستخدم (UI/UX).", "Graphic and UI/UX designers.")}</li>
            <li>{tr("الهواة وصُنّاع المحتوى الباحثون عن هوية بصرية متناسقة.", "Hobbyists and content creators seeking a coherent visual identity.")}</li>
            <li>{tr("طلاب التصميم ونظم المعلومات.", "Design and information systems students.")}</li>
            <li>{tr("المسوّقون ومُديرو وسائل التواصل الاجتماعي.", "Marketers and social media managers.")}</li>
          </ul>
        </Section>

        <Section num="5" title={tr("المميزات الرئيسية", "Key Features")}>
          <Table
            align={align}
            headers={[tr("الميزة", "Feature"), tr("الوصف", "Description")]}
            rows={[
              [tr("رفع الصور بسهولة", "Easy image upload"), tr("دعم السحب والإفلات وجميع الصيغ الشائعة (JPG, PNG, WebP).", "Drag-and-drop and all common formats (JPG, PNG, WebP).")],
              [tr("استخراج الألوان", "Color extraction"), tr("خوارزمية K-Means لاستخراج لوحة متناسقة في ثوانٍ.", "K-Means algorithm to extract a coherent palette in seconds.")],
              [tr("تحليل المزاج", "Mood analysis"), tr("تحديد مستوى الإضاءة والتشبّع لاقتراح خطوط مناسبة.", "Detect brightness and saturation to suggest matching fonts.")],
              [tr("اقتراح الخطوط", "Font suggestions"), tr("أزواج خطوط احترافية تجمع بين العربي والإنجليزي.", "Professional font pairs combining Arabic and English.")],
              [tr("معالجة محلية", "Local processing"), tr("تتم المعالجة في المتصفح دون رفع الصور لأي خادم.", "Processing happens in-browser; no images are uploaded.")],
              [tr("نسخ سريع", "Quick copy"), tr("نسخ كود اللون بضغطة واحدة (HEX).", "Copy the color code with a single click (HEX).")],
            ]}
          />
        </Section>

        <Section num="6" title={tr("البنية التقنية", "Technical Architecture")}>
          <h3 className="font-bold text-lg">{tr("6.1 النسخة التفاعلية (Web App)", "6.1 Interactive Web App")}</h3>
          <Table
            align={align}
            headers={[tr("المكوّن", "Component"), tr("التقنية المستخدمة", "Technology")]}
            rows={[
              [tr("لغة البرمجة", "Language"), "TypeScript"],
              [tr("إطار العمل", "Framework"), "React 19 + TanStack Start"],
              [tr("أداة البناء", "Build tool"), "Vite 7"],
              [tr("التنسيق", "Styling"), "Tailwind CSS v4"],
              [tr("خوارزمية الذكاء الاصطناعي", "AI algorithm"), tr("K-Means Clustering (تنفيذ مخصص)", "K-Means Clustering (custom implementation)")],
              [tr("معالجة الصور", "Image processing"), "HTML5 Canvas API"],
            ]}
          />
          <h3 className="font-bold text-lg mt-6">{tr("6.2 النسخة البحثية (Python Script)", "6.2 Research Version (Python Script)")}</h3>
          <Table
            align={align}
            headers={[tr("المكوّن", "Component"), tr("المكتبة", "Library")]}
            rows={[
              [tr("الواجهة", "UI"), "Streamlit"],
              [tr("معالجة الصور", "Image processing"), "Pillow (PIL)"],
              [tr("العمليات الرياضية", "Math operations"), "NumPy"],
              [tr("خوارزمية K-Means", "K-Means algorithm"), "scikit-learn"],
            ]}
          />
        </Section>

        <Section num="7" title={tr("سير العمل (Workflow)", "Workflow")}>
          <ol className={`list-decimal ${listPad} space-y-2`}>
            <li>{tr("يقوم المستخدم برفع صورة عبر الواجهة.", "User uploads an image through the interface.")}</li>
            <li>{tr("يتم تصغير الصورة تلقائياً لتسريع المعالجة دون فقدان الدقة اللونية.", "Image is auto-resized to speed up processing without losing color fidelity.")}</li>
            <li>{tr("استخراج بكسلات الصورة وتحويلها إلى مصفوفة RGB.", "Extract image pixels and convert to an RGB array.")}</li>
            <li>{tr("تطبيق خوارزمية K-Means لتجميع البكسلات في k مجموعات.", "Apply K-Means to cluster pixels into k groups.")}</li>
            <li>{tr("ترتيب المجموعات حسب التكرار وعرضها كلوحة ألوان.", "Sort clusters by frequency and display as a palette.")}</li>
            <li>{tr("تحليل مزاج اللوحة (الإضاءة + التشبّع) واقتراح خطوط مناسبة.", "Analyze palette mood (brightness + saturation) and suggest fonts.")}</li>
            <li>{tr("عرض النتائج للمستخدم مع إمكانية النسخ والتصدير.", "Show results with copy and export options.")}</li>
          </ol>
        </Section>

        <Section num="8" title={tr("الجدول الزمني المقترح", "Proposed Timeline")}>
          <Table
            align={align}
            headers={[tr("الأسبوع", "Week"), tr("المهمة", "Task")]}
            rows={[
              ["1", tr("تحليل المتطلبات وتصميم واجهة المستخدم (Mockups).", "Requirements analysis and UI mockups.")],
              ["2", tr("تنفيذ خوارزمية K-Means واختبارها على صور متنوعة.", "Implement and test K-Means on various images.")],
              ["3", tr("بناء الواجهة التفاعلية وربطها بالخوارزمية.", "Build the interactive UI and connect it to the algorithm.")],
              ["4", tr("إضافة منطق اقتراح الخطوط وتحسين الأداء.", "Add font-suggestion logic and optimize performance.")],
              ["5", tr("الاختبار، التوثيق، وإعداد العرض النهائي.", "Testing, documentation, and final presentation.")],
            ]}
          />
        </Section>

        <Section num="9" title={tr("معايير التقييم", "Evaluation Criteria")}>
          <ul className={`list-disc ${listPad} space-y-2`}>
            <li>{tr("دقة الألوان المستخرجة ومدى تطابقها مع الصورة الأصلية.", "Accuracy of extracted colors and fidelity to the original image.")}</li>
            <li>{tr("سرعة استجابة النظام (Response Time) — المستهدف أقل من 3 ثوانٍ.", "System response time — target under 3 seconds.")}</li>
            <li>{tr("سهولة استخدام الواجهة وجاذبيتها البصرية.", "Ease of use and visual appeal of the interface.")}</li>
            <li>{tr("جودة اقتراحات الخطوط وملاءمتها لمزاج الصورة.", "Quality of font suggestions and how well they match the mood.")}</li>
          </ul>
        </Section>

        <Section num="10" title={tr("مخرجات المشروع", "Project Deliverables")}>
          <ul className={`list-disc ${listPad} space-y-2`}>
            <li>{tr("تطبيق ويب تفاعلي يعمل على جميع المتصفحات الحديثة.", "Interactive web app working on all modern browsers.")}</li>
            <li>{tr("سكربت Python/Streamlit مستقل للتشغيل المحلي.", "Standalone Python/Streamlit script for local execution.")}</li>
            <li>{tr("وثيقة المشروع.", "Project document.")}</li>
            <li>{tr("عرض تقديمي نهائي للمدرس.", "Final presentation for the instructor.")}</li>
          </ul>
        </Section>

        <Section num="11" title={tr("كيفية تشغيل ملف المشروع", "How to Run the Project")}>
          <h3 className="font-bold text-lg">{tr("11.1 تشغيل سكربت Python (ai_palette_pro.py)", "11.1 Running the Python script (ai_palette_pro.py)")}</h3>

          <p className="font-semibold mt-4">{tr("الخطوة 1: التأكد من تثبيت Python", "Step 1: Verify Python installation")}</p>
          <p>{tr("تأكد من وجود Python 3.9 أو أحدث. للتحقق:", "Make sure Python 3.9 or newer is installed. To verify:")}</p>
          <pre dir="ltr" className="rounded-lg bg-secondary p-3 text-sm font-mono">python --version</pre>

          <p className="font-semibold mt-4">{tr("الخطوة 2: تثبيت المكتبات المطلوبة", "Step 2: Install required libraries")}</p>
          <pre dir="ltr" className="rounded-lg bg-secondary p-3 text-sm font-mono">pip install streamlit pillow numpy scikit-learn</pre>

          <p className="font-semibold mt-4">{tr("الخطوة 3: تشغيل التطبيق", "Step 3: Run the app")}</p>
          <pre dir="ltr" className="rounded-lg bg-secondary p-3 text-sm font-mono">streamlit run ai_palette_pro.py</pre>
          <p>
            {tr("سيفتح التطبيق تلقائياً في المتصفح على العنوان:", "The app will open automatically in the browser at:")}{" "}
            <code dir="ltr" className="font-mono">http://localhost:8501</code>
          </p>

          <p className="font-semibold mt-4">{tr("الخطوة 4: استخدام التطبيق", "Step 4: Use the app")}</p>
          <ol className={`list-decimal ${listPad} space-y-1`}>
            <li>{tr("اضغط على زر «Browse files» وارفع صورة من جهازك.", "Click the 'Browse files' button and upload an image.")}</li>
            <li>{tr("اختر عدد الألوان المراد استخراجها (افتراضياً 6).", "Choose the number of colors to extract (default 6).")}</li>
            <li>{tr("انتظر ثوانٍ قليلة لتظهر لوحة الألوان مع أكواد HEX.", "Wait a few seconds for the palette and HEX codes to appear.")}</li>
            <li>{tr("اطّلع على اقتراحات الخطوط في الأسفل.", "Check the font suggestions at the bottom.")}</li>
          </ol>

          <h3 className="font-bold text-lg mt-6">{tr("11.2 تشغيل النسخة التفاعلية (Web App)", "11.2 Running the interactive web app")}</h3>
          <p>
            {tr("النسخة التفاعلية متاحة مباشرة على الإنترنت دون أي تثبيت، وتعمل بالكامل في المتصفح.", "The interactive version is available online with no installation; it runs entirely in the browser.")}
          </p>
        </Section>

        <Section num="12" title={tr("ملاحظات مهمة", "Important Notes")}>
          <ul className={`list-disc ${listPad} space-y-2`}>
            <li>{tr("في حال ظهور خطأ pip not found، استبدل pip بـ pip3 و python بـ python3.", "If you see 'pip not found', replace pip with pip3 and python with python3.")}</li>
            <li>{tr("على نظام Windows قد تحتاج تشغيل CMD كمسؤول (Run as administrator).", "On Windows, you may need to run CMD as administrator.")}</li>
            <li>{tr("جميع المعالجة تتم محلياً — لا تُرفع أي صورة إلى أي خادم خارجي.", "All processing is local — no image is uploaded to any external server.")}</li>
            <li>{tr("يمكن إيقاف Streamlit بالضغط على Ctrl + C في موجّه الأوامر.", "Stop Streamlit by pressing Ctrl + C in the terminal.")}</li>
          </ul>
        </Section>

        <Section num="13" title={tr("الخاتمة", "Conclusion")}>
          <p>
            {tr(
              "يُمثّل مشروع AI Palette Pro نموذجاً عملياً يجمع بين علوم الحاسب والتصميم، ويُبرز كيف يمكن لخوارزميات تعلّم الآلة البسيطة (K-Means) أن تُقدّم قيمة حقيقية لمستخدمين غير تقنيين. المشروع قابل للتوسعة مستقبلاً ليشمل: استخراج الأنماط (Patterns)، اقتراح أيقونات، وتوليد دليل هوية بصرية (Brand Guide) كامل بصيغة PDF.",
              "AI Palette Pro is a practical example combining computer science and design, showing how simple ML algorithms (K-Means) can deliver real value to non-technical users. It can be extended in the future to include pattern extraction, icon suggestions, and a full PDF Brand Guide.",
            )}
          </p>
        </Section>

        <div className="text-center pt-4">
          <Link to="/">
            <Button variant="outline">{t("back")}</Button>
          </Link>
        </div>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground space-y-1">
        <p>{t("footerStudent")}</p>
        <p>{t("footerCopy")}</p>
      </footer>
    </div>
  );
}
