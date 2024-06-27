import type { APIContext } from "astro";
import type { ReactNode } from "react";
import React from "react";
import { BlogSchema } from "./content/config";

export const render = (_context: APIContext): ReactNode => {
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
        fontFamily: "Atkinson",
        fontSize: 72,
      }}
    >
      <div
        style={{
          marginTop: 96,
        }}
      >
        Hello World
      </div>
    </div>
  );
};

export const renderBlog = ({ props }: APIContext): ReactNode => {
  const { title, description } = BlogSchema.parse(props.data);

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
        fontFamily: "Atkinson",
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
          marginTop: 96,
        }}
      >
        {description}
      </div>
    </div>
  );
};
