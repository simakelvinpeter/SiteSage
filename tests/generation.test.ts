import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import express from "express";

const directory = mkdtempSync(join(tmpdir(), "sitesage-"));
process.env.DATA_FILE = join(directory, "websites.json");
delete process.env.OPENAI_API_KEY;
delete process.env.OPENAI_API_KEY_ENV_VAR;
const { FileStorage } = await import("../server/storage");
const { registerRoutes } = await import("../server/routes");

await test("generate, restore, isolate visitors, sandbox preview and reject bad input", async () => {
  const app = express();
  app.use(express.json());
  const server = await registerRoutes(app);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address() as { port: number };
  const base = `http://127.0.0.1:${address.port}`;
  try {
    const created = await fetch(`${base}/api/websites/generate`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "My bakery", description: "A welcoming local bakery serving fresh bread and homemade cakes every morning." }),
    });
    assert.equal(created.status, 200);
    const cookie = created.headers.get("set-cookie")!.split(";")[0];
    const website = await created.json();
    assert.ok(website.generatedHtml.includes("My bakery"));
    const restored = new FileStorage(process.env.DATA_FILE);
    const owner = cookie.slice("sitesage=".length).split(".")[0];
    assert.equal((await restored.getWebsite(website.id, owner))?.name, "My bakery");
    assert.equal(await restored.getWebsite(website.id, "another-visitor"), undefined);
    assert.equal((await fetch(`${base}/api/websites/${website.id}`)).status, 404);
    const preview = await fetch(`${base}/preview/${website.id}`, { headers: { Cookie: cookie } });
    assert.equal(preview.status, 200);
    assert.match(preview.headers.get("content-security-policy")!, /sandbox;/);
    assert.equal((await fetch(`${base}/api/websites`, { headers: { Cookie: cookie } }).then(r => r.json())).length, 1);
    const invalid = await fetch(`${base}/api/websites/generate`, {
      method: "POST", headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({ name: " ", description: "too short" }),
    });
    assert.equal(invalid.status, 400);
  } finally {
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    rmSync(directory, { recursive: true, force: true });
  }
});
