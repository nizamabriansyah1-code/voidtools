import test from "node:test";
import assert from "node:assert/strict";
import { convertUnits, decodeBase64Utf8, decodeJwtPayload, diffJsonText, diffTextLines, encodeBase64Utf8, formatJson, generatePassword, getUuidVersion, secureRandomInt, sha256Hex, simulateLoot } from "../lib/tool-logic.ts";

test("JSON formatter preserves values and rejects invalid input", () => {
  assert.equal(formatJson('{"hello":"void","ok":true}'), '{\n  "hello": "void",\n  "ok": true\n}');
  assert.throws(() => formatJson("{"), SyntaxError);
  assert.throws(() => formatJson("  "), /Paste JSON/);
});

test("JSON diff ignores object key order and reports nested changes with escaped paths", () => {
  assert.equal(diffJsonText('{"b":2,"a":{"x/y":1}}', '{"a":{"x/y":3},"b":2}'), '~ $/a/x~1y: 1 → 3');
  assert.equal(diffJsonText('{"a":1}', '{"a":1}'), "No differences found.");
  assert.match(diffJsonText('{"a":1}', '{"a":1,"b":2}'), /\+ \$\/b: 2/);
  assert.match(diffJsonText('{"a":1,"b":2}', '{"a":1}'), /- \$\/b: 2/);
  assert.throws(() => diffJsonText("{", "{}"), /Original JSON is invalid/);
  assert.throws(() => diffJsonText("{}", "{"), /Updated JSON is invalid/);
});

test("text diff handles replacements and empty sides without fake blank lines", () => {
  assert.equal(diffTextLines("keep\nold", "keep\nnew"), "  keep\n- old\n+ new");
  assert.equal(diffTextLines("gone", ""), "- gone");
  assert.equal(diffTextLines("", "added"), "+ added");
  assert.throws(() => diffTextLines("", ""), /at least one/);
});

test("JWT decoder reads Base64URL JSON locally and clearly says signature is unverified", () => {
  const encode = value => Buffer.from(JSON.stringify(value)).toString("base64url");
  const decoded = decodeJwtPayload(`${encode({ alg: "none" })}.${encode({ sub: "user-1" })}.signature`);
  assert.match(decoded, /"sub": "user-1"/);
  assert.match(decoded, /Signature: present, not verified/);
  assert.match(decodeJwtPayload(`${encode({ alg: "none" })}.${encode({})}.`), /Signature: empty, not verified/);
  assert.throws(() => decodeJwtPayload("not-a-jwt"), /compact JWT/);
  assert.throws(() => decodeJwtPayload("e30.e30.bad+sig"), /invalid Base64URL signature/);
  assert.throws(() => decodeJwtPayload("e30.%%%.."), /compact JWT/);
});

test("Base64 round-trips Unicode without corrupting multi-byte characters", () => {
  const value = "Halo 🌌 — 東京";
  assert.equal(decodeBase64Utf8(encodeBase64Utf8(value)), value);
  assert.throws(() => decodeBase64Utf8("%%%"));
});

test("UUID validator recognizes valid versions and rejects malformed IDs", () => {
  assert.equal(getUuidVersion("123e4567-e89b-42d3-a456-426614174000"), 4);
  assert.equal(getUuidVersion("{123e4567-e89b-12d3-a456-426614174000}"), 1);
  assert.equal(getUuidVersion("not-a-uuid"), null);
  assert.equal(getUuidVersion("{123e4567-e89b-42d3-a456-426614174000"), null);
});

test("SHA-256 matches the standard empty-string digest", async () => {
  assert.equal(await sha256Hex(""), "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
});

test("loot simulation is reproducible and respects probability boundaries", () => {
  assert.equal(simulateLoot(35, 500, "seed-a"), simulateLoot(35, 500, "seed-a"));
  assert.equal(simulateLoot(0, 100, "zero"), 0);
  assert.equal(simulateLoot(100, 100, "certain"), 100);
  assert.throws(() => simulateLoot(101, 10, "seed"), /0% to 100%/);
  assert.throws(() => simulateLoot(10, 0, "seed"), /1,000,000/);
});

test("secure passwords respect length and include one character from each selected set", () => {
  const password = generatePassword(24, ["abcdef", "ABCDEF", "012345", "!@#$"]);
  assert.equal(password.length, 24);
  assert.match(password, /[a-f]/);
  assert.match(password, /[A-F]/);
  assert.match(password, /[0-5]/);
  assert.match(password, /[!@#$]/);
  assert.throws(() => generatePassword(20, []), /at least one/);
  assert.throws(() => generatePassword(8, ["1", "2", "3", "4", "5", "6", "7", "8", "9"]), /too short/);
});

test("secure random values always fall within the requested range", () => {
  for (let i = 0; i < 100; i++) assert.ok(secureRandomInt(7) >= 0 && secureRandomInt(7) < 7);
  assert.throws(() => secureRandomInt(0), RangeError);
});

test("unit conversion handles metric, imperial, and temperature units", () => {
  assert.equal(convertUnits(1, "length", "m", "cm"), 100);
  assert.equal(convertUnits(1, "weight", "kg", "g"), 1000);
  assert.equal(convertUnits(0, "temperature", "°C", "°F"), 32);
  assert.equal(convertUnits(32, "temperature", "°F", "K"), 273.15);
  assert.throws(() => convertUnits(1, "length", "kg", "m"), /valid length units/);
});
