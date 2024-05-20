import { walk } from "@std/fs";
import { parse } from "@std/jsonc";
import { dirname } from "@std/path";
import type { ActionInputs } from "./inputs.ts";

export type ActionParams = Required<ActionInputs>;

export async function fromInputs(inputs: ActionInputs): Promise<ActionParams> {
  const { config, root } = inputs.root.length
    ? {
      config: await findConfig(inputs.root),
      root: inputs.root,
    }
    : await findRootAndConfig();

  const source = inputs.source.length ? inputs.source : [
    config && await hasImports(config) ? config : "./**/*.ts",
  ];
  const prefix = inputs.prefix.length ? `${inputs.prefix} ` : "";
  return { ...inputs, root, source, prefix };
}

async function findConfig(root: string): Promise<string | undefined> {
  for await (const entry of walk(root, { maxDepth: 1 })) {
    if (entry.name === "deno.json" || entry.name === "deno.jsonc") {
      return entry.name;
    }
  }
  return undefined;
}

async function findRootAndConfig(): Promise<
  { config: string | undefined; root: string }
> {
  let root = ".";
  let config = undefined;
  for await (const entry of walk(".")) {
    if (entry.name === "deno.json" || entry.name === "deno.jsonc") {
      root = dirname(entry.path);
      config = entry.name;
    }
  }
  return { config, root };
}

async function hasImports(config?: string): Promise<boolean> {
  if (!config) return false;
  const jsonc = parse(await Deno.readTextFile(config));
  return jsonc !== null && typeof jsonc === "object" && "imports" in jsonc;
}