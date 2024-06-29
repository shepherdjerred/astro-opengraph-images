import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import type { AstroBuildDoneHookInput, IntegrationOptions, Page, RenderFunction } from "./types.js";
import * as fs from "fs";
import type { AstroIntegrationLogger } from "astro";
import { extract } from "./extract.js";
import { getFilePath } from "./util.js";
import { placeholder } from "./constants.js";

export async function buildDoneHook({
  logger,
  pages,
  options,
  dir,
  render,
}: AstroBuildDoneHookInput & {
  options: IntegrationOptions;
  render: RenderFunction;
}) {
  logger.info("Generating OpenGraph images");
  for (const page of pages) {
    try {
      await handlePage({ page, options, render, dir, logger });
    } catch (e) {
      logger.error(e as string);
    }
  }
}

interface HandlePageInput {
  page: Page;
  options: IntegrationOptions;
  render: RenderFunction;
  dir: URL;
  logger: AstroIntegrationLogger;
}

async function handlePage({ page, options, render, dir, logger }: HandlePageInput) {
  const file = getFilePath({ dir: dir.pathname, page: page.pathname });
  const html = fs.readFileSync(file).toString();
  const data = extract(html);

  const svg = await satori(render({ ...page, ...data }), options);
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: options.width,
    },
  });

  const target = file.replace(/\.html$/, ".png");
  fs.writeFileSync(target, resvg.render().asPng());

  // remove local filesystem pathname
  let sitePath = target.replace(process.cwd(), "");
  // remove leading dist/ from the path
  sitePath = sitePath.replace("/dist/", "");

  const content = fs.readFileSync(file).toString();
  fs.writeFileSync(file, content.replace(placeholder, sitePath));

  logger.info(`Generated ${sitePath} for ${page.pathname}`);
}
