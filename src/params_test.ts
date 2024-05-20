import { assertObjectMatch } from "@std/assert";
import { defaults } from "./inputs.ts";
import { fromInputs } from "./params.ts";

Deno.test("fromInputs - default source (deno.json)", async () => {
  assertObjectMatch(
    await fromInputs({
      ...defaults,
      root: "test/fixtures",
    }),
    {
      prefix: "chore: ",
      root: "test/fixtures",
      source: ["deno.json"],
    },
  );
});

Deno.test("fromInputs - default source (modules)", async () => {
  assertObjectMatch(
    await fromInputs({
      ...defaults,
      root: "src",
    }),
    {
      prefix: "chore: ",
      root: "src",
      source: ["./**/*.ts"],
    },
  );
});

Deno.test("fromInputs - explicit sources", async () => {
  assertObjectMatch(
    await fromInputs({
      ...defaults,
      root: "test/fixtures",
      source: ["mod.ts", "deps.ts"],
    }),
    {
      prefix: "chore: ",
      root: "test/fixtures",
      source: ["mod.ts", "deps.ts"],
    },
  );
});

Deno.test("fromInputs - default inputs", async () => {
  assertObjectMatch(
    await fromInputs(defaults),
    {
      prefix: "chore: ",
      resolve: false,
      root: ".",
      source: ["deno.json"],
    },
  );
});