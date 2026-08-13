import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { ArrowLeft, Building2, ChartNoAxesCombined, Scale, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";

/**
 * All content in this page are only for example, replace with your own feature implementation
 * When building pages, remember your instructions in Frontend Workflow, Frontend Best Practices, Design Guide and Common Pitfalls
 */
export default function Home() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_80%_8%,rgba(16,104,108,.13),transparent_30%),linear-gradient(180deg,#f8fcfc_0%,#edf6f5_100%)]">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 lg:px-8">
        <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#0b4f52] text-xl font-extrabold text-white shadow-lg shadow-teal-900/15">أ</div><div><p className="text-xl font-extrabold text-[#0b4f52]">أصولي</p><p className="text-xs text-[#577173]">بوابة الملاك الذكية</p></div></div>
        <Button onClick={() => user ? setLocation("/portal") : startLogin()} className="bg-[#0b4f52] text-white hover:bg-[#073f42]">{loading ? "جارٍ التحقق..." : user ? "دخول البوابة" : "تسجيل الدخول"}</Button>
      </header>
      <main className="mx-auto grid min-h-[calc(100vh-92px)] w-full max-w-7xl items-center gap-12 px-5 pb-14 pt-8 lg:grid-cols-[1.08fr_.92fr] lg:px-8">
        <section className="rise-in space-y-7"><div className="inline-flex items-center gap-2 rounded-full border border-[#e9a34b]/35 bg-[#fff8ef] px-3 py-1.5 text-xs font-bold text-[#a65e0c]"><ShieldCheck className="h-4 w-4"/> نظام تشغيل حماية الإيجار</div><h1 className="max-w-3xl text-4xl font-extrabold leading-[1.35] tracking-tight text-[#123f42] md:text-6xl">أصلٌ تقني يحمي إيرادك ويُدير عقارك <span className="text-[#dc7e16]">بذكاء.</span></h1><p className="max-w-2xl text-base leading-8 text-[#526f71] md:text-lg">أصولي تجمع محفظتك، دفعاتك، وعقودك في بوابة واحدة؛ وتحوّل تأخر الإيجار إلى مسار موثق ومتدرج قابل للمتابعة.</p><div className="flex flex-wrap gap-3"><Button size="lg" onClick={() => user ? setLocation("/portal") : startLogin()} className="bg-[#e2841d] px-6 text-[#173b3d] shadow-lg shadow-orange-500/20 hover:bg-[#cc7012]">ابدأ من بوابة الملاك <ArrowLeft className="mr-2 h-4 w-4" /></Button><Button size="lg" variant="outline" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} className="border-[#0b4f52]/20 bg-white text-[#0b4f52] hover:bg-[#eff8f7]">استكشف المنصة</Button></div></section>
        <section className="rise-in rounded-[2rem] border border-[#d9e9e7] bg-white p-5 shadow-2xl shadow-teal-950/8 [animation-delay:80ms] md:p-7"><div className="mb-5 flex items-center justify-between"><div><p className="text-sm font-bold text-[#0b4f52]">ملخص محفظتك</p><p className="text-xs text-[#759091]">متابعة شفافة في الوقت الحقيقي</p></div><div className="rounded-xl bg-[#eaf5f3] px-3 py-1 text-xs font-bold text-[#0b7771]">محمي</div></div><div className="grid grid-cols-2 gap-3"><div className="rounded-2xl bg-[#0b4f52] p-4 text-white"><p className="text-xs text-teal-100">إيراد شهري</p><p className="mt-2 text-2xl font-extrabold">— د.أ</p><p className="mt-1 text-xs text-teal-200">يظهر بعد إضافة عقاراتك</p></div><div className="rounded-2xl bg-[#fff5e8] p-4 text-[#9b5809]"><p className="text-xs">حالات المتابعة</p><p className="mt-2 text-2xl font-extrabold">0</p><p className="mt-1 text-xs text-[#b9782f]">لا إجراء مطلوب</p></div></div><div className="mt-4 rounded-2xl border border-[#e3eeee] p-4"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#edf7f6] text-[#0b7771]"><ChartNoAxesCombined className="h-5 w-5"/></div><div><p className="text-sm font-bold text-[#1d4c4e]">مسار التحصيل الآلي</p><p className="text-xs text-[#698586]">تنبيه ودي ← إنذار رسمي ← تدقيق قانوني</p></div></div></div></section>
      </main>
      <section id="features" className="border-t border-[#dcebea] bg-white/80"><div className="mx-auto grid max-w-7xl gap-4 px-5 py-12 md:grid-cols-3 lg:px-8">{[[Building2,"محفظة موحّدة","العقارات والمستأجرون والعقود في مكان واحد."],[Scale,"سجل قانوني موثق","كل مرحلة تصعيد مسجلة بتاريخها وإجرائها."],[ShieldCheck,"صلاحيات آمنة","كل مالك يرى محفظته فقط، والمشرف يرى الصورة الكاملة."]].map(([Icon,title,text]) => { const FeatureIcon = Icon as typeof Building2; return <div key={String(title)} className="rounded-2xl border border-[#e1eeed] p-5"><FeatureIcon className="mb-4 h-5 w-5 text-[#e2841d]"/><h2 className="font-extrabold text-[#17494b]">{String(title)}</h2><p className="mt-2 text-sm leading-7 text-[#678283]">{String(text)}</p></div>})}</div></section>
    </div>
  );
}
