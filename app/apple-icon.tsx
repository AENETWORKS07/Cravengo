import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ff3d81 0%, #7b2cbf 100%)",
          color: "#fff",
          fontSize: 110,
          fontWeight: 800,
          fontFamily: "sans-serif",
          letterSpacing: -6,
        }}
      >
        C
      </div>
    ),
    size,
  );
}
