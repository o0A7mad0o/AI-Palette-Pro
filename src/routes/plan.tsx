import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
}: {
  headers: [string, string];
  rows: [string, string][];
}) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-secondary">
          <tr>
            <th className="px-4 py-2 text-right font-semibold">{headers[0]}</th>
            <th className="px-4 py-2 text-right font-semibold">{headers[1]}</th>
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
  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
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
            خطة المشروع الجامعي
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base opacity-100 text-gray-600 md:text-lg">
            نظام استخراج وتحليل الهوية البصرية المدعوم بالذكاء الاصطناعي
          </p>
          <div className="mt-6">
            <Link to="/">
              <Button variant="secondary">← العودة للموقع</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 -mt-12 pb-20 space-y-6 max-w-4xl">
        <Section num="1" title="نظرة عامة على المشروع">
          <p>
            AI Palette Pro هو تطبيق تفاعلي يجمع بين الفن والذكاء الاصطناعي
            ليُساعد المصممين والهواة على بناء هوياتهم البصرية بطريقة سريعة
            وذكية. يقوم النظام بتحليل أي صورة يرفعها المستخدم باستخدام خوارزميات
            تعلّم آلي (تحديداً K-Means Clustering)، فيستخرج منها لوحة الألوان
            الأكثر هيمنة وتناسقاً، ثم يقترح أزواجاً من الخطوط التي تتناسب مع
            روح الصورة ومزاجها العام.
          </p>
          <p>
            الهدف هو تقليص الفجوة بين الإلهام البصري والتنفيذ العملي: بدلاً من
            قضاء ساعات في اختيار الألوان والخطوط يدوياً، يحصل المصمم على نقطة
            انطلاق احترافية خلال ثوانٍ.
          </p>
        </Section>

        <Section num="2" title="المشكلة والحاجة">
          <ul className="list-disc pr-6 space-y-2">
            <li>صعوبة استخراج لوحة ألوان متناسقة من صورة مرجعية بسرعة ودقة.</li>
            <li>غياب أداة عربية تربط بين تحليل الصور واقتراح الخطوط في مكان واحد.</li>
            <li>هدر وقت المصممين المبتدئين في تجربة الألوان والخطوط بشكل عشوائي.</li>
            <li>الحاجة إلى أداة تعليمية تُظهر كيف يمكن للذكاء الاصطناعي أن يخدم قطاع التصميم.</li>
          </ul>
        </Section>

        <Section num="3" title="أهداف المشروع">
          <ol className="list-decimal pr-6 space-y-2">
            <li>بناء واجهة تفاعلية بسيطة لرفع الصور وعرض النتائج فوراً.</li>
            <li>تطبيق خوارزمية K-Means لاستخراج (5–8) ألوان مهيمنة من الصورة.</li>
            <li>عرض الألوان بصيغة HEX و RGB مع نسبة كل لون في الصورة.</li>
            <li>اقتراح أزواج خطوط (عربية/إنجليزية) بناءً على مزاج اللوحة.</li>
            <li>توفير إمكانية نسخ الألوان وتصدير اللوحة للاستخدام في مشاريع أخرى.</li>
          </ol>
        </Section>

        <Section num="4" title="الفئة المستهدفة">
          <ul className="list-disc pr-6 space-y-2">
            <li>المصممون الجرافيكيون ومصممو واجهات المستخدم (UI/UX).</li>
            <li>الهواة وصُنّاع المحتوى الباحثون عن هوية بصرية متناسقة.</li>
            <li>طلاب التصميم ونظم المعلومات.</li>
            <li>المسوّقون ومُديرو وسائل التواصل الاجتماعي.</li>
          </ul>
        </Section>

        <Section num="5" title="المميزات الرئيسية">
          <Table
            headers={["الميزة", "الوصف"]}
            rows={[
              ["رفع الصور بسهولة", "دعم السحب والإفلات وجميع الصيغ الشائعة (JPG, PNG, WebP)."],
              ["استخراج الألوان", "خوارزمية K-Means لاستخراج لوحة متناسقة في ثوانٍ."],
              ["تحليل المزاج", "تحديد مستوى الإضاءة والتشبّع لاقتراح خطوط مناسبة."],
              ["اقتراح الخطوط", "أزواج خطوط احترافية تجمع بين العربي والإنجليزي."],
              ["معالجة محلية", "تتم المعالجة في المتصفح دون رفع الصور لأي خادم."],
              ["نسخ سريع", "نسخ كود اللون بضغطة واحدة (HEX)."],
            ]}
          />
        </Section>

        <Section num="6" title="البنية التقنية">
          <h3 className="font-bold text-lg">6.1 النسخة التفاعلية (Web App)</h3>
          <Table
            headers={["المكوّن", "التقنية المستخدمة"]}
            rows={[
              ["لغة البرمجة", "TypeScript"],
              ["إطار العمل", "React 19 + TanStack Start"],
              ["أداة البناء", "Vite 7"],
              ["التنسيق", "Tailwind CSS v4"],
              ["خوارزمية الذكاء الاصطناعي", "K-Means Clustering (تنفيذ مخصص)"],
              ["معالجة الصور", "HTML5 Canvas API"],
            ]}
          />
          <h3 className="font-bold text-lg mt-6">6.2 النسخة البحثية (Python Script)</h3>
          <Table
            headers={["المكوّن", "المكتبة"]}
            rows={[
              ["الواجهة", "Streamlit"],
              ["معالجة الصور", "Pillow (PIL)"],
              ["العمليات الرياضية", "NumPy"],
              ["خوارزمية K-Means", "scikit-learn"],
            ]}
          />
        </Section>

        <Section num="7" title="سير العمل (Workflow)">
          <ol className="list-decimal pr-6 space-y-2">
            <li>يقوم المستخدم برفع صورة عبر الواجهة.</li>
            <li>يتم تصغير الصورة تلقائياً لتسريع المعالجة دون فقدان الدقة اللونية.</li>
            <li>استخراج بكسلات الصورة وتحويلها إلى مصفوفة RGB.</li>
            <li>تطبيق خوارزمية K-Means لتجميع البكسلات في k مجموعات.</li>
            <li>ترتيب المجموعات حسب التكرار وعرضها كلوحة ألوان.</li>
            <li>تحليل مزاج اللوحة (الإضاءة + التشبّع) واقتراح خطوط مناسبة.</li>
            <li>عرض النتائج للمستخدم مع إمكانية النسخ والتصدير.</li>
          </ol>
        </Section>

        <Section num="8" title="الجدول الزمني المقترح">
          <Table
            headers={["الأسبوع", "المهمة"]}
            rows={[
              ["1", "تحليل المتطلبات وتصميم واجهة المستخدم (Mockups)."],
              ["2", "تنفيذ خوارزمية K-Means واختبارها على صور متنوعة."],
              ["3", "بناء الواجهة التفاعلية وربطها بالخوارزمية."],
              ["4", "إضافة منطق اقتراح الخطوط وتحسين الأداء."],
              ["5", "الاختبار، التوثيق، وإعداد العرض النهائي."],
            ]}
          />
        </Section>

        <Section num="9" title="معايير التقييم">
          <ul className="list-disc pr-6 space-y-2">
            <li>دقة الألوان المستخرجة ومدى تطابقها مع الصورة الأصلية.</li>
            <li>سرعة استجابة النظام (Response Time) — المستهدف أقل من 3 ثوانٍ.</li>
            <li>سهولة استخدام الواجهة وجاذبيتها البصرية.</li>
            <li>جودة اقتراحات الخطوط وملاءمتها لمزاج الصورة.</li>
          </ul>
        </Section>

        <Section num="10" title="مخرجات المشروع">
          <ul className="list-disc pr-6 space-y-2">
            <li>تطبيق ويب تفاعلي يعمل على جميع المتصفحات الحديثة.</li>
            <li>سكربت Python/Streamlit مستقل للتشغيل المحلي.</li>
            <li>وثيقة المشروع.</li>
            <li>عرض تقديمي نهائي للمدرس.</li>
          </ul>
        </Section>

        <Section num="11" title="كيفية تشغيل ملف المشروع">
          <h3 className="font-bold text-lg">11.1 تشغيل سكربت Python (ai_palette_pro.py)</h3>
          <p>
            {"\n"}
          </p>

          <p className="font-semibold mt-4">الخطوة 1: التأكد من تثبيت Python</p>
          <p>تأكد من وجود Python 3.9 أو أحدث. للتحقق:</p>
          <pre dir="ltr" className="rounded-lg bg-secondary p-3 text-sm font-mono">python --version</pre>

          <p className="font-semibold mt-4">الخطوة 2: تثبيت المكتبات المطلوبة</p>
          <pre dir="ltr" className="rounded-lg bg-secondary p-3 text-sm font-mono">pip install streamlit pillow numpy scikit-learn</pre>

          <p className="font-semibold mt-4">الخطوة 3: تشغيل التطبيق</p>
          <pre dir="ltr" className="rounded-lg bg-secondary p-3 text-sm font-mono">streamlit run ai_palette_pro.py</pre>
          <p>
            سيفتح التطبيق تلقائياً في المتصفح على العنوان:{" "}
            <code dir="ltr" className="font-mono">http://localhost:8501</code>
          </p>

          <p className="font-semibold mt-4">الخطوة 4: استخدام التطبيق</p>
          <ol className="list-decimal pr-6 space-y-1">
            <li>اضغط على زر «Browse files» وارفع صورة من جهازك.</li>
            <li>اختر عدد الألوان المراد استخراجها (افتراضياً 6).</li>
            <li>انتظر ثوانٍ قليلة لتظهر لوحة الألوان مع أكواد HEX.</li>
            <li>اطّلع على اقتراحات الخطوط في الأسفل.</li>
          </ol>

          <h3 className="font-bold text-lg mt-6">11.2 تشغيل النسخة التفاعلية (Web App)</h3>
          <p>
            النسخة التفاعلية متاحة مباشرة على الإنترنت دون أي تثبيت، وتعمل
            بالكامل في المتصفح.
          </p>
        </Section>

        <Section num="12" title="ملاحظات مهمة">
          <ul className="list-disc pr-6 space-y-2">
            <li>في حال ظهور خطأ <code>pip not found</code>، استبدل <code>pip</code> بـ <code>pip3</code> و <code>python</code> بـ <code>python3</code>.</li>
            <li>على نظام Windows قد تحتاج تشغيل CMD كمسؤول (Run as administrator).</li>
            <li>جميع المعالجة تتم محلياً — لا تُرفع أي صورة إلى أي خادم خارجي.</li>
            <li>يمكن إيقاف Streamlit بالضغط على <kbd>Ctrl + C</kbd> في موجّه الأوامر.</li>
          </ul>
        </Section>

        <Section num="13" title="الخاتمة">
          <p>
            يُمثّل مشروع AI Palette Pro نموذجاً عملياً يجمع بين علوم الحاسب
            والتصميم، ويُبرز كيف يمكن لخوارزميات تعلّم الآلة البسيطة (K-Means)
            أن تُقدّم قيمة حقيقية لمستخدمين غير تقنيين. المشروع قابل للتوسعة
            مستقبلاً ليشمل: استخراج الأنماط (Patterns)، اقتراح أيقونات، وتوليد
            دليل هوية بصرية (Brand Guide) كامل بصيغة PDF.
          </p>
        </Section>

        <div className="text-center pt-4">
          <Link to="/">
            <Button variant="outline">← العودة للموقع</Button>
          </Link>
        </div>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground space-y-1">
        <p>اعداد الطالب : احمد نبهان - الرقم الجامعي : 0130012510048</p>
        <p>مشروع جامعي — AI Palette Pro © 2026</p>
      </footer>
    </div>
  );
}
