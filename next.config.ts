import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async redirects() {
    return [
      // Short alias for the Carnegie Mellon Racing section, so /cmr and
      // /cmr/delaunay reach the same pages as /projects/fsae.
      {
        source: "/cmr",
        destination: "/projects/fsae",
        permanent: false,
      },
      {
        source: "/cmr/:slug*",
        destination: "/projects/fsae/:slug*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
