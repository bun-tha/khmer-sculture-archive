/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // The contribute form uploads a photo inside a Server Action; the
      // default 1 MB body limit is too small, so allow up to 4 MB.
      bodySizeLimit: "4mb",
    },
  },
};
export default nextConfig;
