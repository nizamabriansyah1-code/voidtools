import type { Config } from "tailwindcss";
const config: Config = { content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./lib/**/*.{js,ts,jsx,tsx}"], theme: { extend: { colors: { ink: "#08090d", panel: "#101117", line: "#252630", muted: "#9293a1", violet: "#9d82ff", cyan: "#62d9e8" }, fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui"] } } }, plugins: [] };
export default config;
