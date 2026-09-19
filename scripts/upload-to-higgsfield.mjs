/**
 * MLŽIDLA.cz → Higgsfield MCP uploader
 *
 * Server-side only. Never expose MCP_TOKEN to browser/client code.
 * Usage:
 *   MCP_TOKEN=... node scripts/upload-to-higgsfield.mjs ./path/to/file.json
 *
 * The exact ingest payload is intentionally passed in as JSON so the
 * uploader does not invent Higgsfield-specific asset metadata.
 */
import fs from "node:fs/promises";
import path from "node:path";

const MCP_ENDPOINT = "https://mcp.higsfield.net/api/ingest";
const TOKEN = process.env.MCP_TOKEN;

if (!TOKEN) {
  throw new Error("Missing MCP_TOKEN environment variable.");
}

const input = process.argv[2];
if (!input) {
  throw new Error("Usage: MCP_TOKEN=... node scripts/upload-to-higgsfield.mjs <payload.json>");
}

const payloadPath = path.resolve(input);
const payload = JSON.parse(await fs.readFile(payloadPath, "utf8"));

const response = await fetch(MCP_ENDPOINT, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
  body: JSON.stringify(payload),
});

const body = await response.text();

if (!response.ok) {
  throw new Error(`Higgsfield MCP ingest failed (${response.status}): ${body}`);
}

console.log("Higgsfield MCP ingest OK");
console.log(body);
