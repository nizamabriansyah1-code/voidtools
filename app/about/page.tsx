import { Globe2, ShieldCheck, Zap, type LucideIcon } from "lucide-react";

const features: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: ShieldCheck, title: "Private by default", description: "Your text, files, and calculations are handled locally in your browser." },
  { icon: Zap, title: "Quick by design", description: "Most tools respond instantly without accounts, APIs, or waiting." },
  { icon: Globe2, title: "Open to everyone", description: "A compact toolkit made to be useful wherever your work takes you." },
];

export default function About() {
  return <div className="mx-auto max-w-3xl px-5 py-12 md:px-9">
    <p className="text-[10px] font-bold uppercase tracking-[.18em] text-violet">About VOIDTOOLS</p>
    <h1 className="mt-3 text-3xl font-extrabold tracking-[-.04em]">Useful things, without the noise.</h1>
    <p className="mt-5 max-w-2xl text-sm leading-7 text-[#a2a3af]">VOIDTOOLS is a focused collection of everyday utilities for developers, Minecraft server owners, and creative people. It brings small, reliable tools into one place so you can stay in your flow.</p>
    <div className="mt-9 grid gap-3 sm:grid-cols-3">{features.map(({ icon: Icon, title, description }) => <div key={title} className="surface p-4"><Icon size={17} className="text-violet"/><h2 className="mt-3 text-xs font-bold">{title}</h2><p className="mt-2 text-[10px] leading-relaxed text-[#8d8e9b]">{description}</p></div>)}</div>
    <div className="surface mt-7 p-5"><p className="mono text-[11px] text-cyan">$ voidtools --version</p><p className="mono mt-2 text-[11px] text-[#a1a2ae]">1.1.0 // ALL YOUR TOOLS. ONE VOID.</p><p className="mt-4 text-[11px] leading-relaxed text-[#898a97]">Calculations and generation happen in your browser. Cryptographic tools use the Web Crypto API where available. Simulation outputs are random samples, not predictions of real-world outcomes.</p></div>
  </div>;
}
