import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import type { AstroBuildDoneHookInput, IntegrationOptions, Page, RenderFunction } from "./types.js";
import * as fs from "fs";
import type { AstroIntegrationLogger } from "astro";
import { extract } from "./extract.js";
import { getFilePath } from "./util.js";
import { fileURLToPath } from 'url';

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
  logger.info("Generating Open Graph images");
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
  const htmlFile = getFilePath({ dir: fileURLToPath(dir), page: page.pathname });
  const html = fs.readFileSync(htmlFile).toString();
  const pageDetails = extract(html);

  const reactNode = await render({ ...page, ...pageDetails });
  const svg = await satori(reactNode, options);
  const resvg = new Resvg(svg, {
    font: {
      loadSystemFonts: false,
    },
    fitTo: {
      mode: "width",
      value: options.width,
    },
  });

  let pngFile = htmlFile.replace(/\.html$/, ".png");

  // remove leading dist/ from the path
  fs.writeFileSync(pngFile, resvg.render().asPng());
  pngFile = pngFile.replace("dist/", "");

  // convert the image path to a URL
  let imageUrl = new URL(pageDetails.image).pathname;
  // remove leading slash
  imageUrl = imageUrl.slice(1);

  // check that the og:image property matches the sitePath
  if (!options.disableImagePathCheck && imageUrl !== pngFile) {
    throw new Error(
      `The og:image property in ${htmlFile} (${imageUrl}) does not match the generated image (${pngFile}).`,
    );
  }

  logger.info(`Generated ${pngFile} for ${htmlFile}.`);
}
