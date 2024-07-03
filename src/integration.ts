import type { AstroIntegration } from "astro";
import type { IntegrationInput, IntegrationOptions } from "./types.js";
import { buildDoneHook } from "./hook.js";

const defaults = {
  width: 1200,
  height: 630,
  disableImagePathCheck: false,
};

export function astroOpenGraphImages({ options, render }: IntegrationInput): AstroIntegration {
  const optionsWithDefaults: IntegrationOptions = { ...defaults, ...options };

  return {
    name: "astro-opengraph-images",
    hooks: {
      "astro:build:done": async (entry) => {
        await buildDoneHook({
          ...entry,
          options: optionsWithDefaults,
          render,
        });
      },
    },
  };
}
