import { Resvg } from "@resvg/resvg-js";
import satori, { type SatoriOptions } from "satori";
import { presets } from "./index.js";
import * as fs from "fs";

// Updates the examples for the README
// Run with `npx tsx src/presets/renderExamples.ts`
async function renderExamples() {
  const page = {
    title: "Hello, world!",
    description: "This is a description",
    pathname: "empty",
  };

  const font = fs.readFileSync("assets/fonts/Roboto/Roboto-Regular.ttf");

  const options: SatoriOptions = {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Roboto",
        weight: 400,
        style: "normal",
        data: font,
      },
    ],
  };

  // for each preset, render the page and save the file
  for (const [name, preset] of Object.entries(presets)) {
    const svg = await satori(preset(page), options);
    const resvg = new Resvg(svg, {
      fitTo: {
        mode: "width",
        value: options.width,
      },
    });
    const target = `assets/presets/${name}.png`;
    fs.writeFileSync(target, resvg.render().asPng());
  }
}

await renderExamples();
