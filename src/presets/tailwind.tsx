import React from "react";
import type { RenderFunctionInput } from "../types.js";
import { twj } from "tw-to-css";

export function tailwind({ title, description }: RenderFunctionInput): React.ReactNode {
  return (
    // Modified based on https://tailwindui.com/components/marketing/sections/cta-sections
    <div style={twj("flex flex-col w-full h-full items-center justify-center bg-white")}>
      <div style={twj("bg-gray-50 flex w-full")}>
        <div style={twj("flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8")}>
          <h2 style={twj("flex flex-col text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-left")}>
            <span>{title}</span>
            <span style={twj("text-indigo-600")}>{description}</span>
          </h2>
        </div>
      </div>
    </div>
  );
}
