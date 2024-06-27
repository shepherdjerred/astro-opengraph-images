import type { APIContext } from "astro";
import { handleRoute } from "astro-opengraph-images";
import * as fs from "fs";
import { renderBlog } from "../../og";
import { getCollection } from "astro:content";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: post,
  }));
}

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
      render: renderBlog,
    }),
  );
}
