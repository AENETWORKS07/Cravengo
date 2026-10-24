import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BRAND.appName} by ${BRAND.name}`,
    short_name: BRAND.appName,
    description: "Earn points on every dessert. Double after 10pm.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0712",
    theme_color: "#0b0712",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
