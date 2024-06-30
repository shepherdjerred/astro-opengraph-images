import { defineConfig } from "astro/config";

import opengraphImages, { presets } from "astro-opengraph-images";

// https://astro.build/config
export default defineConfig({
  integrations: [
    opengraphImages({
      options: {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Roboto",
            weight: 400,
            style: "normal",
            data: fs.readFileSync("node_modules/@fontsource/roboto/files/roboto-latin-400-normal.woff"),
          },
        ],
      },
      render: presets.blackAndWhite,
    }),
  ],
});
