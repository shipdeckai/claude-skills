import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const marketplacePath = path.join(root, ".claude-plugin", "marketplace.json");

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

describe("marketplace", () => {
  it("declares valid, unique plugin entries", async () => {
    const marketplace = await readJson(marketplacePath);
    const readme = await readFile(path.join(root, "README.md"), "utf8");
    assert.equal(typeof marketplace.name, "string");
    assert.ok(Array.isArray(marketplace.plugins));
    assert.ok(marketplace.plugins.length > 0);

    const names = marketplace.plugins.map((plugin) => plugin.name);
    assert.equal(new Set(names).size, names.length);

    for (const plugin of marketplace.plugins) {
      assert.match(plugin.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      assert.equal(typeof plugin.description, "string");
      assert.ok(plugin.description.trim().length > 0);
      assert.match(readme, new RegExp(`\\| \\[${plugin.name}\\]\\(`));

      if (typeof plugin.source === "string") {
        const pluginDirectory = path.resolve(root, plugin.source);
        assert.equal((await stat(pluginDirectory)).isDirectory(), true);
        const manifest = await readJson(
          path.join(pluginDirectory, ".claude-plugin", "plugin.json"),
        );
        assert.equal(manifest.name, plugin.name);
        continue;
      }

      assert.deepEqual(Object.keys(plugin.source).sort(), ["repo", "source"]);
      assert.equal(plugin.source.source, "github");
      assert.match(plugin.source.repo, /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/);
    }
  });
});
