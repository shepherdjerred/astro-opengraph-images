import type { APIContext, AstroIntegration } from "astro";
import * as fs from "fs";
import { Resvg } from "@resvg/resvg-js";
import satori, { type SatoriOptions } from "satori";
import type { Page, RenderFunction, RenderRouteFunction } from "./types.js";

const defaults = {
  width: 1200,
  height: 630,
};

export type DefaultOptions = SatoriOptions & {
  width?: number;
  height?: number;
};

export type Options = DefaultOptions & {
  width: number;
  height: number;
};

export default function satoriOpenGraph({
  options,
  render,
}: {
  options: DefaultOptions;
  render: RenderFunction;
}): AstroIntegration {
  const optionsWithDefaults: Options = { ...defaults, ...options };
  return {
    name: "astro-satori",
    hooks: {
      "astro:build:done": async (entry) => {
        try {
          for (const page of entry.pages) {
            await handlePage({ page, options: optionsWithDefaults, render, dir: entry.dir });
            entry.logger.info(`Generated OpenGraph image for ${page.pathname}`);
          }
        } catch (e) {
          entry.logger.error(e as string);
        }
      },
    },
  };
}

async function handlePage({
  page,
  options,
  render,
  dir,
}: {
  page: Page;
  dir: URL;
  options: Options;
  render: RenderFunction;
}) {
  const svg = await satori(render(page), options);
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: options.width,
    },
  });
  fs.writeFileSync(`${dir.pathname}${page.pathname}openGraph.png`, resvg.render().asPng());
}

export async function handleRoute({
  context,
  options,
  render,
}: {
  context: APIContext;
  options: Options;
  render: RenderRouteFunction;
}) {
  const svg = await satori(render(context), options);
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: options.width,
    },
  });
  return resvg.render().asPng();
}
