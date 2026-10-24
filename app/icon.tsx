import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 110,
          color: "#fff",
          fontSize: 300,
          fontWeight: 800,
          fontFamily: "sans-serif",
          letterSpacing: -20,
        }}
      >
        C
      </div>
    ),
    size,
  );
}
