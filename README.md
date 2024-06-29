# Astro OpenGraph Images

[![astro-opengraph-images](https://img.shields.io/npm/v/astro-opengraph-images.svg)](https://www.npmjs.com/package/astro-opengraph-images)

Generate fully customizable OpenGraph images with a few lines of code.

## Quick Start

1. Add this integration:

   ```bash
   npm i astro-opengraph-images
   ```

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

## Alternatives

Here are some similar libraries using Satori and Astro. I haven't done a feature comparison.

- https://github.com/florian-lefebvre/satori-astro (This library looks excellent)
- https://github.com/delucis/astro-og-canvas (Doesn't allow arbitrary layouts)
- https://github.com/thewebforge/astro-og-images (Only allows you to choose from a list of templates)
- https://github.com/tomaskebrle/astro-og-image (Seems limited)
- https://github.com/cijiugechu/astro-satori (Possibly dead, hasn't been updated in a year)
- https://github.com/kevinzunigacuellar/astro-satori (Possibly dead, hasn't been updated in a year)
- https://github.com/rumaan/astro-vercel-og (Possibly dead, hasn't been updated in a year)
