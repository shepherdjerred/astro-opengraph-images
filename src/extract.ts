import type { PageDetails } from "./types.js";
import * as jsdom from "jsdom";

// Astro CSS parsing fails: Error: Could not parse CSS stylesheet
// Remove CSS from the HTML
// https://github.com/jsdom/jsdom/issues/2005#issuecomment-1758940894
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<style([\S\s]*?)>([\S\s]*?)<\/style>/gim, "")
    .replace(/<script([\S\s]*?)>([\S\s]*?)<\/script>/gim, "");
}

export function extract(html: string): PageDetails {
  const htmlDoc = new jsdom.JSDOM(sanitizeHtml(html)).window.document;
  const title = htmlDoc.title;
  const description = htmlDoc.querySelector("meta[name=description]")?.getAttribute("content");
  const returnVal: PageDetails = {};
  if (title) {
    returnVal.title = title;
  }
  if (description) {
    returnVal.description = description;
  }
  return returnVal;
}
