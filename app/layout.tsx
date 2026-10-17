import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
export const metadata: Metadata = { title: "VOIDTOOLS — All your tools. One void.", description: "A focused collection of practical developer, Minecraft, creative, and everyday utilities." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><AppShell>{children}</AppShell></body></html>; }
