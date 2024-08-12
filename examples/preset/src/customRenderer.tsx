import type { RenderFunctionInput } from "astro-opengraph-images";
import React from "react";

export async function customOgMediaLayout({ title }: RenderFunctionInput): Promise<React.ReactNode> {
  const twj = (await import("tw-to-css")).twj;

  return (
    <div
      style={{
        ...twj("h-full w-full flex items-start justify-start"),
        ...{
          backgroundImage: "linear-gradient(to right, #24243e, #302b63, #0f0c29)",
        },
      }}
    >
      <div style={twj("flex items-start justify-start h-full")}>
        <div style={twj("flex flex-col justify-between w-full h-full p-20")}>
          <h1 style={twj("text-[60px] text-white font-bold text-left")}>{title}</h1>
        </div>
      </div>
    </div>
  );
}
