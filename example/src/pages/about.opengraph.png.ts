import type { APIContext } from "astro";
import { handleRoute } from "astro-opengraph-images";
import * as fs from "fs";
import { render } from "../og";

export async function GET(context: APIContext) {
  const path = new URL("../../public/fonts/atkinson-regular.woff", import.meta.url);
  const atkinson = fs.readFileSync(path);

  return new Response(
    await handleRoute({
      context,
      options: {
        width: 1200,
        height: 630,
        fonts: [
          {
            data: atkinson,
            name: "Atkinson",
            weight: 400,
            style: "normal",
          },
        ],
      },
      render,
    }),
  );
}
