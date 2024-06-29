import type { AstroIntegration } from "astro";
import * as fs from "fs";
import { Resvg } from "@resvg/resvg-js";
import satori, { type SatoriOptions } from "satori";
import type { Page, RenderFunction } from "./types.js";

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

export default function astroOpenGraphImages({
  options,
  render,
}: {
  options: DefaultOptions;
  render: RenderFunction;
}): AstroIntegration {
  const optionsWithDefaults: Options = { ...defaults, ...options };
  return {
    name: "astro-opengraph-images",
    hooks: {
      "astro:build:done": async (entry) => {
        entry.logger.info("Generating OpenGraph images");
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
  let target: string;

  // some files, e.g. index or 404 pages, are served without a folder
  // other files, e.g. blog posts, are served from a folder
  // I don't fully understand how Astro decides this, so:
  // Check if `page.pathname` is a directory on disk
  if (fs.existsSync(`${dir.pathname}${page.pathname}`)) {
    // if it is, save the image in that directory
    target = `${dir.pathname}${page.pathname}opengraph.png`;
  } else {
    // otherwise, save it in the root directory
    target = `${dir.pathname}opengraph.png`;
  }

  fs.writeFileSync(target, resvg.render().asPng());
}
