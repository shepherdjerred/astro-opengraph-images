# Astro OpenGraph

This is an [Astro](https://astro.build/) integration that generates images for [OpenGraph](https://ogp.me/) using [Satori](https://github.com/vercel/satori) and [resvg-js](https://github.com/yisibl/resvg-js).

OpenGraph images are the link preview you see when linking a site to Slack, Discord, Twitter, Facebook, etc.

## Usage

1. Install this package:

   ```bash
   npm i astro-satori
   ```

1. If you want to use React syntax (recommended), install `@types/react`:

   ```bash
   npm i -D @types/react
   ```

1. Define a render function:

   - Satori supports a [limited subset of CSS](https://github.com/vercel/satori?tab=readme-ov-file#css).
   - You can use the [Satori playground](https://og-playground.vercel.app/) to iterate on your render function

   - Using React:

     ```tsx
     export function render(): JSX.Element {
       const title = "";
       const type: "blog" | "event" = "blog";

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
             fontFamily: "CommitMono",
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
     }
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

- https://dietcode.io/p/astro-og/
- https://github.com/sdnts/dietcode/blob/914e3970f6a0f555113768b12db3229dd822e6f1/astro.config.ts#L55
