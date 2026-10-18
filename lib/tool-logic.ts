export function secureRandomInt(max: number): number {
  if (!Number.isSafeInteger(max) || max < 1 || max > 0x1_0000_0000) throw new RangeError("A positive safe random range is required.");
  if (typeof crypto === "undefined" || !crypto.getRandomValues) throw new Error("Secure randomness is unavailable in this browser.");
  const limit = Math.floor(0x1_0000_0000 / max) * max;
  const sample = new Uint32Array(1);
  do crypto.getRandomValues(sample); while (sample[0] >= limit);
  return sample[0] % max;
}

export function generateUuidV4(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  if (typeof crypto === "undefined" || !crypto.getRandomValues) throw new Error("Secure randomness is unavailable in this browser.");
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = [...bytes].map(byte => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function formatJson(input: string): string {
  if (!input.trim()) throw new Error("Paste JSON to format or validate.");
  return JSON.stringify(JSON.parse(input), null, 2);
}

export function diffJsonText(left: string, right: string): string {
  if (!left.trim() || !right.trim()) throw new Error("Paste JSON into both panels to compare.");
  let before: unknown;
  let after: unknown;
  try { before = JSON.parse(left); } catch (cause) { throw new Error(`Original JSON is invalid: ${cause instanceof Error ? cause.message : "parse error"}`); }
  try { after = JSON.parse(right); } catch (cause) { throw new Error(`Updated JSON is invalid: ${cause instanceof Error ? cause.message : "parse error"}`); }
  const changes: string[] = [];

  const visit = (a: unknown, b: unknown, path: string, depth = 0): void => {
    if (depth > 100) throw new RangeError("JSON nesting is too deep to compare (maximum 100 levels).");
    if (Object.is(a, b)) return;
    if (Array.isArray(a) && Array.isArray(b)) {
      const length = Math.max(a.length, b.length);
      for (let index = 0; index < length; index++) {
        const itemPath = `${path}[${index}]`;
        if (index >= a.length) changes.push(`+ ${itemPath}: ${JSON.stringify(b[index])}`);
        else if (index >= b.length) changes.push(`- ${itemPath}: ${JSON.stringify(a[index])}`);
        else visit(a[index], b[index], itemPath, depth + 1);
      }
      return;
    }
    if (isJsonObject(a) && isJsonObject(b)) {
      const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])].sort();
      for (const key of keys) {
        const itemPath = `${path}/${key.replace(/~/g, "~0").replace(/\//g, "~1")}`;
        if (!Object.prototype.hasOwnProperty.call(a, key)) changes.push(`+ ${itemPath}: ${JSON.stringify(b[key])}`);
        else if (!Object.prototype.hasOwnProperty.call(b, key)) changes.push(`- ${itemPath}: ${JSON.stringify(a[key])}`);
        else visit(a[key], b[key], itemPath, depth + 1);
      }
      return;
    }
    changes.push(`~ ${path}: ${JSON.stringify(a)} → ${JSON.stringify(b)}`);
  };

  visit(before, after, "$");
  return changes.length ? changes.join("\n") : "No differences found.";
}

function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function diffTextLines(left: string, right: string): string {
  if (!left && !right) throw new Error("Enter text in at least one panel to compare.");
  const before = left ? left.split(/\r?\n/) : [];
  const after = right ? right.split(/\r?\n/) : [];
  if (before.length * after.length > 1_000_000) throw new RangeError("Compare up to 1,000 lines per panel at a time.");

  const lcs = Array.from({ length: before.length + 1 }, () => new Uint32Array(after.length + 1));
  for (let i = before.length - 1; i >= 0; i--) {
    for (let j = after.length - 1; j >= 0; j--) {
      lcs[i][j] = before[i] === after[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const diff: string[] = [];
  let i = 0;
  let j = 0;
  while (i < before.length && j < after.length) {
    if (before[i] === after[j]) {
      diff.push(`  ${before[i]}`);
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) diff.push(`- ${before[i++]}`);
    else diff.push(`+ ${after[j++]}`);
  }
  while (i < before.length) diff.push(`- ${before[i++]}`);
  while (j < after.length) diff.push(`+ ${after[j++]}`);
  return diff.join("\n");
}

export function decodeJwtPayload(token: string): string {
  const parts = token.trim().split(".");
  if (parts.length !== 3 || !parts[0] || !parts[1]) throw new Error("Enter a compact JWT with header, payload, and signature sections.");
  if (token.length > 256_000) throw new RangeError("JWT is too large to decode here (maximum 256 KB).");
  if (parts[2] && !/^[A-Za-z0-9_-]+$/.test(parts[2])) throw new Error("JWT contains an invalid Base64URL signature section.");

  const decodeSegment = (segment: string): unknown => {
    if (!/^[A-Za-z0-9_-]+$/.test(segment)) throw new Error("JWT contains an invalid Base64URL section.");
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - base64.length % 4) % 4);
    const bytes = Uint8Array.from(atob(padded), char => char.charCodeAt(0));
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return JSON.parse(text) as unknown;
  };

  const header = decodeSegment(parts[0]);
  const payload = decodeSegment(parts[1]);
  if (!isJsonObject(header)) throw new Error("The JWT header must decode to a JSON object.");
  if (!isJsonObject(payload)) throw new Error("The JWT payload must decode to a JSON object.");
  return `Header\n${JSON.stringify(header, null, 2)}\n\nPayload\n${JSON.stringify(payload, null, 2)}\n\nSignature: ${parts[2] ? "present, not verified" : "empty, not verified"}`;
}

export function encodeBase64Utf8(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

export function decodeBase64Utf8(input: string): string {
  return new TextDecoder().decode(Uint8Array.from(atob(input), char => char.charCodeAt(0)));
}

export function getUuidVersion(input: string): number | null {
  let value = input.trim();
  const wrapped = value.startsWith("{") || value.endsWith("}");
  if (wrapped) {
    if (!value.startsWith("{") || !value.endsWith("}")) return null;
    value = value.slice(1, -1);
  }
  const match = value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-([1-8])[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  return match ? Number(match[1]) : null;
}

export async function sha256Hex(input: string): Promise<string> {
  if (!globalThis.crypto?.subtle) throw new Error("Web Crypto requires a secure context (HTTPS or localhost).");
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
}

export function simulateLoot(probability: number, trials: number, seed: string): number {
  if (!Number.isFinite(probability) || probability < 0 || probability > 100) throw new RangeError("Drop chance must be from 0% to 100%.");
  if (!Number.isSafeInteger(trials) || trials < 1 || trials > 1_000_000) throw new RangeError("Trials must be an integer from 1 to 1,000,000.");
  let state = [...seed].reduce((acc, char) => ((acc * 31 + char.charCodeAt(0)) >>> 0), 2166136261) || 1;
  const random = () => { state = (Math.imul(1664525, state) + 1013904223) >>> 0; return state / 4294967296; };
  let hits = 0;
  for (let i = 0; i < trials; i++) if (random() < probability / 100) hits++;
  return hits;
}

export function generatePassword(length: number, sets: string[]): string {
  if (!Number.isSafeInteger(length) || length < 8 || length > 128) throw new RangeError("Password length must be from 8 to 128 characters.");
  const usable = sets.filter(Boolean);
  if (!usable.length) throw new Error("Select at least one character set.");
  if (usable.length > length) throw new RangeError("Password length is too short for the selected character sets.");
  const pool = usable.join("");
  const characters = usable.map(set => set[secureRandomInt(set.length)]);
  while (characters.length < length) characters.push(pool[secureRandomInt(pool.length)]);
  for (let i = characters.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [characters[i], characters[j]] = [characters[j], characters[i]];
  }
  return characters.join("");
}

const unitFactors: Record<"length" | "weight", Record<string, number>> = {
  length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, ft: 0.3048, in: 0.0254 },
  weight: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.45359237, oz: 0.028349523125 },
};

export function convertUnits(value: number, category: "length" | "weight" | "temperature", from: string, to: string): number {
  if (!Number.isFinite(value)) throw new TypeError("Enter a finite number to convert.");
  if (category === "temperature") {
    if (!["°C", "°F", "K"].includes(from) || !["°C", "°F", "K"].includes(to)) throw new RangeError("Choose valid temperature units.");
    const celsius = from === "°F" ? (value - 32) * 5 / 9 : from === "K" ? value - 273.15 : value;
    return to === "°F" ? celsius * 9 / 5 + 32 : to === "K" ? celsius + 273.15 : celsius;
  }
  const factors = unitFactors[category];
  if (!(from in factors) || !(to in factors)) throw new RangeError(`Choose valid ${category} units.`);
  return value * factors[from] / factors[to];
}
