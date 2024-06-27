export interface Page {
  pathname: string;
}

export type RenderFunction = (page: Page) => JSX.Element;

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
