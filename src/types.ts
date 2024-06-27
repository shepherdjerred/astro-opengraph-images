import type { APIContext } from "astro";
import type { ReactNode } from "react";

export interface Page {
  pathname: string;
}

export type RenderFunction = (page: Page) => ReactNode;

export type RenderRouteFunction = (context: APIContext) => ReactNode;

// copied from Satori
export type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type FontStyle = "normal" | "italic";
export interface FontOptions {
  data: Buffer | ArrayBuffer;
  name: string;
  weight?: Weight;
  style?: FontStyle;
  lang?: string;
}
export interface SatoriOptions {
  width: number;
  height: number;
  fonts: FontOptions[];
}
