import type { APIContext } from "astro";
import { handleRoute } from "astro-opengraph-images";
import type { ReactNode } from "react";
import * as fs from "fs";

export async function GET(context: APIContext) {
  const render = (): ReactNode =>
    ({
      type: "div",
      props: {
        style: {
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#000",
          padding: "55px 70px",
          color: "#fff",
          fontFamily: "Atkinson",
          fontSize: 72,
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                fontSize: 40,
              },
              children: "by Jerred Shepherd",
            },
          },
        ],
      },
    }) as ReactNode;

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
