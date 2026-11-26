import { ImageResponse } from "next/og";

export const alt = "Aman Tyagi - AI & Backend Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* The site's palette as a card. Hex values: the renderer reads no CSS vars. */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#f4f2ee",
        color: "#161513",
        padding: 56,
        gap: 24,
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 2, color: "#6f6c66" }}>
          AMANTYAGI.ME
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 132, fontWeight: 700, letterSpacing: -8, lineHeight: 0.9 }}>
            Aman Tyagi
          </div>
          <div style={{ fontSize: 40, marginTop: 28, color: "#3d3b37" }}>
            AI & Backend Engineer
          </div>
        </div>
      </div>
      <div
        style={{
          width: 300,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ec5a24",
          borderRadius: 40,
          padding: 32,
        }}
      >
        <div style={{ display: "flex" }}>
          <div style={{ width: 118, height: 236, background: "#161513", borderRadius: "118px 0 0 118px" }} />
          <div style={{ width: 118, height: 236, background: "#161513", borderRadius: "118px 0 0 118px" }} />
        </div>
        <div style={{ display: "flex", fontSize: 26, lineHeight: 1.3 }}>
          RAG, LLM agents and multi-tenant backends
        </div>
      </div>
    </div>,
    size,
  );
}
