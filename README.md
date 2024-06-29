# Astro OpenGraph Images

[![astro-opengraph-images](https://img.shields.io/npm/v/astro-opengraph-images.svg)](https://www.npmjs.com/package/astro-opengraph-images)

Generate OpenGraph images with a few lines of code.

This is an [Astro](https://astro.build/) integration that generates images for [OpenGraph](https://ogp.me/) using [Satori](https://github.com/vercel/satori) and [resvg-js](https://github.com/yisibl/resvg-js).

OpenGraph images are the link preview you see when linking a site to Slack, Discord, Twitter, Facebook, etc.

## Usage

1. Install this package:

   ```bash
   npm i astro-opengraph-images
   ```

1. If you want to use React syntax (recommended), install `@types/react`:

   ```bash
   npm i -D @types/react
   ```

1. Define a render function:

   - Satori supports a [limited subset of CSS](https://github.com/vercel/satori?tab=readme-ov-file#css).
   - You can use the [Satori playground](https://og-playground.vercel.app/) to iterate on your render function

   - Using React:

   Create a `.tsx` file to define your render function. Note: Astro does not support `.tsx` files for a static file endpoint, so you must define the render function in a separate `.tsx` file.

   ```tsx
   import type { APIContext } from "astro";
   import type { ReactNode } from "react";
   import React from "react";

   export const render = ({ params, request }: APIContext): ReactNode => {
     const title = params.slug;
     const type = "blog";

     return (
       <div
         style={{
           height: "100%",
           width: "100%",
           display: "flex",
           flexDirection: "column",
           backgroundColor: "#000",
           padding: "55px 70px",
           color: "#fff",
           fontFamily: "Atkinson",
           fontSize: 72,
         }}
       >
         <div
           style={{
             marginTop: 96,
           }}
         >
           {title}
         </div>
         <div
           style={{
             fontSize: 40,
           }}
         >
           {type === "blog" ? "by Jerred Shepherd" : ""}
         </div>
       </div>
     );
   };
   ```

   - Using vanilla JavaScript:

     ```typescript
     export function render() ({
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
             fontFamily: "CommitMono",
             fontSize: 72,
             },
             children: [
             {
                 type: "div",
                 props: {
                 style: {
                     marginTop: 96,
                 },
                 children: title,
                 },
             },
             {
                 type: "div",
                 props: {
                 style: {
                     fontSize: 40,
                 },
                 children: type === "blog" ? "by Jerred Shepherd" : "",
                 },
             },
             ],
         },
     });
     ```

1. Add this integration to your Astro config

   ```typescript
   import satoriOpenGraph from "satro-satori";

   // You'll need to provide _every_ font that you use with Satori. Satori does not have any fonts by default.
   const commitMono = fs.readFileSync("public/fonts/CommitMono/CommitMono-450-Regular.otf");

   // https://astro.build/config
   export default defineConfig({
       integrations: [satoriOpenGraph(options: {
           fonts: [
             {
               name: "Commit Mono",
               data: commitMono,
               weight: 400,
               style: "normal",
             },
           ],
       }, render)],
   });
   ```

   The integration will generate a `openGraph.png` file next to every `.html` in your Astro site.

1. Update your layout to add the appropriate `meta` tags. The [OpenGraph site](https://ogp.me/) has more information about valid tags. At a minimum, you should define the tags below.

```astro
---
const { url } = Astro;
---

<meta property="og:title" content="" />
<meta property="og:type" content="" />
<meta property="og:url" content={url} />
<meta property="og:image" content={url.toString()}openGraph.png} />
```

1. Confirm that your OpenGraph images are accessible. After you deploy these changes, navigate to [OpenGraph.xyz](https://www.opengraph.xyz/) and test your site.

## Resources

I consulted these resources while building this library.

- https://dietcode.io/p/astro-og/
- https://github.com/sdnts/dietcode/blob/914e3970f6a0f555113768b12db3229dd822e6f1/astro.config.ts#L55

## Alternatives

Here are some similar libraries using Satori and Astro. I haven't done a feature comparison.

- https://github.com/florian-lefebvre/satori-astro (This library looks excellent)
- https://github.com/delucis/astro-og-canvas (Doesn't allow arbitrary layouts)
- https://github.com/thewebforge/astro-og-images (Only allows you to choose from a list of templates)
- https://github.com/tomaskebrle/astro-og-image (Seems limited)
- https://github.com/cijiugechu/astro-satori (Possibly dead, hasn't been updated in a year)
- https://github.com/kevinzunigacuellar/astro-satori (Possibly dead, hasn't been updated in a year)
- https://github.com/rumaan/astro-vercel-og (Possibly dead, hasn't been updated in a year)

## Related

I didn't consult these resources, but they're relevant if you wanted to build your own version of this library.

- https://www.knaap.dev/posts/dynamic-og-images-with-any-static-site-generator/
- https://blog.otterlord.dev/posts/dynamic-opengraph/
- https://egghead.io/lessons/astro-implement-dynamic-og-image-generation-with-astro-api-routes-and-satori
- https://arne.me/blog/static-og-images-in-astro/
- https://jafaraziz.com/blog/generate-open-graph-images-with-astro-and-satori/
- https://rumaan.dev/blog/open-graph-images-using-satori
- https://www.alperdogan.dev/blog/og-image-with-satori-and-astro/
- https://techsquidtv.com/blog/generating-open-graph-images-for-astro/
- https://blog.vhng.dev/posts/20230901-dynamically-generate-og-image
- https://www.kozhuhds.com/blog/generating-static-open-graph-og-images-in-astro-using-vercel-og/
- https://arne.me/blog/static-og-images-in-astro
- https://aidankinzett.com/blog/astro-open-graph-image/
- https://dev.to/jxd-dev/open-graph-image-generation-with-astro-gnp
- https://www.omar45.com/blog/dynamic-og-images-with-astro
- https://www.jafaraziz.com/blog/generate-open-graph-images-with-astro-and-satori/
- https://www.merlinmason.co.uk/blog/generate-open-graph-images-with-astro
