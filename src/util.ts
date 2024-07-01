import * as fs from "fs";

// some files, e.g. index or 404 pages, are served without a folder
// other files, e.g. blog posts, are served from a folder
// I don't fully understand how Astro decides this, so:
// Check if `page.pathname` is a directory on disk
export function getFilePath({ dir, page }: { dir: string; page: string }) {
  let target: string;
  if (fs.existsSync(`${dir}${page}`)) {
    target = `${dir}${page}index.html`;
  } else {
    target = `${dir}${page}`;
    target = target.slice(0, -1);
    target = target + ".html";
  }

  return trim(target);
}

export function getImagePath({ url }: { url: URL }): string {
  let target = url.pathname;

  console.log("target", target);

  // if url ends with a slash, it's a directory
  // add index.png to the end
  if (target.endsWith("/")) {
    target = target + "index.png";
  } else {
    target = target + ".png";
  }

  // Astro creates these as top-level files rather than in a folder
  if (target === "/404/index.png") {
    return "404.png";
  } else if (target === "/500/index.png") {
    return "500.png";
  }

  // remove leading slash
  target = target.slice(1);

  return target;
}

function trim(input: string): string {
  // remove local filesystem pathname
  input = input.replace(process.cwd(), "");
  input = input.replace("/dist/", "dist/");

  return input;
}
