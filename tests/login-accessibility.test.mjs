import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../src/pages/Login.jsx", import.meta.url), "utf8");

test("login submit button exposes an accessible name and busy state", () => {
  assert.match(
    source,
    /type="submit"[\s\S]*aria-label=\{loading \? "Probíhá přihlašování" : "Přihlásit se"\}/,
  );
  assert.match(source, /aria-busy=\{loading\}/);
  assert.match(source, /<Loader2[^>]*aria-hidden="true"/);
});

test("login errors are announced by assistive technology", () => {
  assert.match(source, /role="alert"/);
  assert.match(source, /aria-live="assertive"/);
});
