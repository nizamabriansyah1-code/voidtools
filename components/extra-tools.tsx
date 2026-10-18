"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Copy, RotateCcw, ShieldAlert } from "lucide-react";
import { decodeJwtPayload, diffJsonText, diffTextLines } from "@/lib/tool-logic";
import { tools } from "@/lib/tools";

const sampleJsonBefore = '{\n  "name": "VOIDTOOLS",\n  "tools": 20,\n  "status": "beta"\n}';
const sampleJsonAfter = '{\n  "name": "VOIDTOOLS",\n  "tools": 23,\n  "status": "live",\n  "private": true\n}';
const sampleTextBefore = "Build started\nTests passed\nDeploy pending";
const sampleTextAfter = "Build started\nTests passed\nDeploy complete";

export function ExtraToolWorkspace({ slug }: { slug: string }) {
  const tool = tools.find(item => item.slug === slug);
  const [left, setLeft] = useState(slug === "json-diff" ? sampleJsonBefore : sampleTextBefore);
  const [right, setRight] = useState(slug === "json-diff" ? sampleJsonAfter : sampleTextAfter);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (!tool) return;
    try {
      const recent = JSON.parse(localStorage.getItem("void:recent") || "[]") as string[];
      localStorage.setItem("void:recent", JSON.stringify([slug, ...recent.filter(item => item !== slug)].slice(0, 8)));
      setFavorites(JSON.parse(localStorage.getItem("void:favorites") || "[]") as string[]);
    } catch {
      setFavorites([]);
    }
  }, [slug, tool]);

  if (!tool) return <div className="mx-auto max-w-3xl p-10 text-center"><h1 className="text-xl font-bold">Tool not found</h1><Link href="/tools" className="mt-4 inline-block text-sm text-violet">Back to tools</Link></div>;

  const toggleFavorite = () => {
    const next = favorites.includes(slug) ? favorites.filter(item => item !== slug) : [slug, ...favorites];
    setFavorites(next);
    localStorage.setItem("void:favorites", JSON.stringify(next));
  };

  const run = () => {
    setError("");
    setNotice("");
    setResult("");
    try {
      const value = slug === "json-diff" ? diffJsonText(left, right) : slug === "text-diff" ? diffTextLines(left, right) : decodeJwtPayload(left);
      setResult(value);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not process that input.");
    }
  };

  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setNotice("Copied to clipboard.");
    } catch {
      setNotice("Clipboard access failed. Select and copy the result manually.");
    }
  };

  const reset = () => {
    setLeft(slug === "jwt-decoder" ? "" : slug === "json-diff" ? sampleJsonBefore : sampleTextBefore);
    setRight(slug === "json-diff" ? sampleJsonAfter : sampleTextAfter);
    setResult("");
    setError("");
    setNotice("");
  };

  const isJwt = slug === "jwt-decoder";
  const isJson = slug === "json-diff";

  return <div className="mx-auto max-w-[1000px] px-5 py-7 md:px-9 md:py-9">
    <Link href="/tools" className="focus-ring inline-flex items-center gap-2 text-[11px] text-[#8c8d99] hover:text-white"><ArrowLeft size={13}/>All tools</Link>
    <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2"><span className="rounded-md border border-violet/20 bg-violet/[.08] px-2 py-1 text-[9px] font-semibold text-[#c7baff]">{tool.category}</span><span className="mono text-[9px] text-[#686975]">VOID / TOOL / {slug.toUpperCase()}</span></div>
        <h1 className="mt-3 text-2xl font-extrabold tracking-[-.035em]">{tool.name}</h1>
        <p className="mt-2 max-w-xl text-xs leading-relaxed text-[#9293a0]">{tool.description}</p>
      </div>
      <button type="button" onClick={toggleFavorite} aria-pressed={favorites.includes(slug)} className={`focus-ring rounded-lg border px-3 py-2 text-[10px] transition ${favorites.includes(slug) ? "border-violet/30 bg-violet/[.08] text-violet" : "border-white/[.08] text-[#8c8d99] hover:text-white"}`}>{favorites.includes(slug) ? "♥ Saved" : "♡ Save tool"}</button>
    </div>

    <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_310px]">
      <section className="surface p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between"><h2 className="text-xs font-bold">{isJwt ? "Decode token" : "Compare inputs"}</h2><button type="button" onClick={reset} className="focus-ring flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[10px] text-[#838490] hover:bg-white/[.04] hover:text-white"><RotateCcw size={12}/>Reset</button></div>
        {isJwt ? <>
          <Field label="Compact JWT"><textarea aria-label="Compact JWT token" autoCapitalize="off" autoComplete="off" spellCheck={false} value={left} onChange={event => setLeft(event.target.value)} rows={7} placeholder="Paste a three-part JWT here…" className="field-text mono"/></Field>
          <div role="note" className="mt-3 flex gap-2 rounded-lg border border-amber-300/15 bg-amber-300/[.05] p-3 text-[10px] leading-relaxed text-amber-100/80"><ShieldAlert size={14} className="mt-0.5 shrink-0"/><span>Decodes the header and payload only. The signature is not verified, so this does not prove the token is authentic.</span></div>
        </> : <div className="grid gap-3 md:grid-cols-2">
          <Field label={isJson ? "Original JSON" : "Original text"}><textarea aria-label={isJson ? "Original JSON" : "Original text"} spellCheck={false} value={left} onChange={event => setLeft(event.target.value)} rows={10} placeholder={isJson ? "Paste the original JSON…" : "Paste the original text…"} className="field-text mono"/></Field>
          <Field label={isJson ? "Updated JSON" : "Updated text"}><textarea aria-label={isJson ? "Updated JSON" : "Updated text"} spellCheck={false} value={right} onChange={event => setRight(event.target.value)} rows={10} placeholder={isJson ? "Paste the updated JSON…" : "Paste the updated text…"} className="field-text mono"/></Field>
        </div>}
        {error && <div role="alert" className="mt-4 flex gap-2 rounded-lg border border-red-400/20 bg-red-400/[.06] p-3 text-[11px] leading-relaxed text-red-200"><AlertCircle size={14} className="mt-0.5 shrink-0"/>{error}</div>}
        {notice && <p aria-live="polite" className="mt-3 text-[10px] text-cyan">{notice}</p>}
        <button type="button" onClick={run} className="focus-ring mt-4 flex w-full items-center justify-center rounded-lg bg-violet px-4 py-2.5 text-xs font-bold text-[#100c1c] transition hover:bg-[#b3a1ff]">{isJwt ? "Decode locally" : "Compare"}</button>
      </section>

      <aside className="space-y-4">
        <div className="surface min-h-60 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-xs font-bold">{isJwt ? "Decoded content" : "Diff output"}</h2>{result && <button type="button" onClick={copy} className="focus-ring flex items-center gap-1.5 rounded-md border border-white/[.08] px-2 py-1.5 text-[10px] text-[#a3a4b0] hover:border-white/20 hover:text-white"><Copy size={11}/>Copy</button>}</div>
          {result ? <pre className="scrollbar max-h-[480px] overflow-auto whitespace-pre-wrap break-all rounded-lg border border-white/[.06] bg-[#0a0b10] p-3 text-[10px] leading-relaxed text-[#c8c6d4]">{result}</pre> : <div className="flex min-h-[190px] flex-col items-center justify-center text-center"><p className="text-[11px] font-medium text-[#999aa7]">Your result will appear here</p><p className="mt-1 max-w-[200px] text-[10px] leading-relaxed text-[#676874]">{isJwt ? "Decoded content stays in this browser." : "Edit either panel and compare the changes."}</p></div>}
        </div>
        <div className="surface-soft p-4"><p className="text-[10px] font-bold text-[#b2b3bf]">How it works</p><p className="mt-1.5 text-[10px] leading-relaxed text-[#82838f]">{isJwt ? "JWT sections are Base64URL-decoded in your browser. No request is sent and no signature verification is performed." : isJson ? "Parses both JSON documents and reports differences by JSON Pointer path. Array entries are compared by index." : "Uses a bounded longest-common-subsequence comparison to show removed, added, and unchanged lines."}</p><p className="mono mt-3 text-[9px] text-[#5f606c]">CLIENT-SIDE · PRIVATE</p></div>
      </aside>
    </div>
  </div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block space-y-1.5"><span className="block text-[10px] font-semibold text-[#a9aab5]">{label}</span>{children}</label>;
}
