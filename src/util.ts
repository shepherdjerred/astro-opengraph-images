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

  return target;
}
