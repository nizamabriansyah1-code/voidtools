import Link from "next/link";
import { ArrowDownToLine, ArrowRight, Check, Monitor, Shield, Smartphone } from "lucide-react";

const repository = process.env.NEXT_PUBLIC_GITHUB_REPOSITORY;
const releaseUrl = repository ? `https://github.com/${repository}/releases/latest/download/` : "/downloads/";

const platforms = [
  {
    name: "Android",
    detail: "APK · Version 1.0.0",
    description: "Install VOIDTOOLS on your Android phone. Your utilities work on-device, without an account.",
    icon: Smartphone,
    href: `${releaseUrl}VOIDTOOLS-android.apk`,
    size: "4.5 MB",
    accent: "text-cyan",
    surface: "border-cyan/20 bg-cyan/[.06]",
    button: "bg-cyan text-[#061013] hover:bg-cyan/90",
  },
  {
    name: "Windows",
    detail: "Portable EXE · Version 1.0.0",
    description: "Run VOIDTOOLS on a Windows PC. No installer or Vercel account required.",
    icon: Monitor,
    href: `${releaseUrl}VOIDTOOLS-Windows.exe`,
    size: "96 MB",
    accent: "text-violet",
    surface: "border-violet/20 bg-violet/[.06]",
    button: "bg-violet text-white hover:bg-violet/90",
  },
];

export default function DownloadPage() {
  return <div className="mx-auto max-w-5xl px-5 py-10 md:px-9 md:py-14">
    <div className="surface grid-bg relative overflow-hidden p-6 md:p-10">
      <div className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full bg-violet/[.12] blur-3xl" />
      <div className="relative max-w-2xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-violet/20 bg-violet/[.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-[#c0adff]">
          <ArrowDownToLine size={13} /> VOIDTOOLS apps
        </p>
        <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-[-.045em] md:text-5xl">Your tools, wherever you work.</h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[#a1a2ae]">Get the VOIDTOOLS app for Android or Windows. Pick a version below and start using your tools.</p>
      </div>
    </div>

    <div className="mt-8 grid gap-4 md:grid-cols-2">
      {platforms.map(({ name, detail, description, icon: Icon, href, size, accent, surface, button }) => <section key={name} className="surface flex flex-col p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className={`grid h-12 w-12 place-items-center rounded-xl border ${surface} ${accent}`}><Icon size={22} /></div>
          <span className="rounded-full border border-white/[.08] px-2.5 py-1 text-[10px] text-[#9394a1]">{detail}</span>
        </div>
        <h2 className="mt-5 text-xl font-bold tracking-tight">{name}</h2>
        <p className="mt-2 min-h-12 text-xs leading-6 text-[#91929f]">{description}</p>
        <div className="mt-5 flex items-center gap-2 text-[10px] text-[#8c8d9a]"><Check size={13} className="text-emerald-400" />No account needed <span className="text-[#50515c]">·</span> {size}</div>
        <a href={href} download className={`focus-ring mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-xs font-bold transition ${button}`}>
          <ArrowDownToLine size={15} /> Download for {name}
        </a>
      </section>)}
    </div>

    <div className="surface-soft mt-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="flex items-start gap-3"><Shield size={16} className="mt-0.5 shrink-0 text-cyan"/><p className="text-[11px] leading-5 text-[#9697a3]">VOIDTOOLS runs its utilities locally. Your text and files stay on your device.</p></div>
      <Link href="/" className="focus-ring inline-flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-[#c5b6ff] hover:text-white">Open web version <ArrowRight size={13}/></Link>
    </div>
  </div>;
}
