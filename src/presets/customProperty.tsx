import { fileURLToPath } from "url";
import { sanitizeHtml } from "../extract.js";
import type { RenderFunctionInput } from "../types.js";
import { getFilePath } from "../util.js";
import * as jsdom from "jsdom";
import * as fs from "fs";

// This preset demonstrates how to extract arbitrary content from an HTML file
// and render it in an opengraph image.
export async function customProperty({ title, pathname, dir }: RenderFunctionInput): Promise<React.ReactNode> {
  const htmlFile = getFilePath({ dir: fileURLToPath(dir), page: pathname });
  const html = fs.readFileSync(htmlFile).toString();
  const htmlDoc = new jsdom.JSDOM(sanitizeHtml(html)).window.document;

  // extract the body
  const body = htmlDoc.querySelector("body")?.textContent ?? "";
  // truncate the body to 50 characters, add ellipsis if truncated
  const bodyTruncated = body.substring(0, 50) + (body.length > 50 ? "..." : "");

  const twj = (await import("tw-to-css")).twj;

  return (
    <div style={twj("h-full w-full flex items-start justify-start border border-blue-500 border-[12px] bg-gray-50")}>
      <div style={twj("flex items-start justify-start h-full")}>
        <div style={twj("flex flex-col justify-between w-full h-full")}>
          <h1 style={twj("text-[80px] p-20 font-black text-left")}>{title}</h1>
          <div style={twj("text-2xl pb-10 px-20 font-bold mb-0")}>{bodyTruncated}</div>
        </div>
      </div>
    </div>
  );
}
