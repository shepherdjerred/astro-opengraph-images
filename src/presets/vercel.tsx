import type { RenderFunctionInput } from "../types.js";

export async function vercel({ title }: RenderFunctionInput): Promise<React.ReactNode> {
  return Promise.resolve(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        flexWrap: "nowrap",
        backgroundColor: "white",
        backgroundImage:
          "radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)",
        backgroundSize: "100px 100px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg height={80} viewBox="0 0 75 65" fill="black" style={{ margin: "0 75px" }}>
          <path d="M37.59.25l36.95 64H.64l36.95-64z"></path>
        </svg>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 40,
          fontStyle: "normal",
          color: "black",
          marginTop: 30,
          lineHeight: 1.8,
          whiteSpace: "pre-wrap",
        }}
      >
        <b>{title}</b>
      </div>
    </div>,
  );
}
