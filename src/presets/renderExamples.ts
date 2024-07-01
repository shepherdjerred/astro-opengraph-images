import { Resvg } from "@resvg/resvg-js";
import satori, { type SatoriOptions } from "satori";
import { presets } from "./index.js";
import * as fs from "fs/promises";
import type { RenderFunctionInput } from "../types.js";

// Updates the examples for the README
// Run with `npx tsx src/presets/renderExamples.ts`
async function renderExamples() {
  const page: RenderFunctionInput = {
    title: "3D Graphics with OpenGL",
    description: "An introduction to 3D graphics rendering and OpenGL.",
    url: "https://example.com/3d-graphics",
    type: "article",
    image: "https://example.com/3d-graphics.png",
    pathname: "empty",
  };

  const options: SatoriOptions = {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Roboto",
        weight: 400,
        style: "normal",
        data: await fs.readFile("node_modules/@fontsource/roboto/files/roboto-latin-400-normal.woff"),
      },
    ],
  };

  const promises = Object.entries(presets).map(async ([name, preset]) => {
    const node = await preset(page);
    const svg = await satori(node, options);
    const resvg = new Resvg(svg, {
      font: {
        loadSystemFonts: false,
      },
      fitTo: {
        mode: "width",
        value: options.width,
      },
    });
    const target = `assets/presets/${name}.png`;
    await fs.writeFile(target, resvg.render().asPng());
    console.log(`Wrote ${target}`);
  });

  await Promise.all(promises);
}

await renderExamples();
