import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import type { AstroBuildDoneHookInput, IntegrationOptions, Page, RenderFunction } from "./types.js";
import * as fs from "fs/promises";
import type { AstroIntegrationLogger } from "astro";
import { extract, sanitizeHtml } from "./extract.js";
import { getFilePath } from "./util.js";
import { fileURLToPath } from "url";
import * as jsdom from "jsdom";

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
  const promises = pages.map((page) => handlePage({ page, options, render, dir, logger }));
  await Promise.all(promises);
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
  const html = (await fs.readFile(htmlFile)).toString();
  const document = new jsdom.JSDOM(sanitizeHtml(html)).window.document;

  const pageDetails = extract(document);

  const reactNode = await render({ ...page, ...pageDetails, dir, document });
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
  await fs.writeFile(pngFile, resvg.render().asPng());
  // dir.pathname accounts for the outDir build argument
  pngFile = pngFile.replace(dir.pathname, "").replace(/\\/g, "/");
  if (pngFile.startsWith("/")) pngFile = pngFile.slice(1);

  // convert the image path to a URL
  let imageUrl = new URL(pageDetails.image).pathname;
  // remove leading slash
  imageUrl = imageUrl.slice(1);

  // check that the og:image property matches the sitePath
  if (imageUrl !== pngFile) {
    throw new Error(
      `The og:image property in ${htmlFile} (${imageUrl}) does not match the generated image (${pngFile}).`,
    );
  }

  if (options.verbose) {
    logger.info(`Generated ${pngFile} for ${htmlFile}.`);
  }
}
