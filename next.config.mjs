/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🚀 CRITICAL: Enable Next.js standalone output for Docker
  output: "standalone",
  async rewrites() {
    return [
      {
        // Source path remains the same
        source: "/stream-proxy/:path*",

        // Destination must be a specific target.
        // This is the main limitation. We can't proxy to a variable domain here.
        //
        // ⚠️ Solution: To support multiple domains, you'll have to manually define
        // a rewrite for every possible domain prefix, or simply use the full
        // external URL in the Client Component and rely on **browser extensions**
        // to disable CORS during development, as a Next.js rewrite cannot easily
        // handle a variable domain target.

        // Since you got the previous rewrite to work, let's continue with
        // the assumption that you will update the DESTINATION for testing:

        // NOTE: This destination needs to be updated manually every time you switch
        // to a new domain *if* you rely on the rewrite to fix CORS.
        destination: "https://:path*", // This is not valid Next.js rewrite syntax!

        // For simplicity, let's use the first movie's domain for local testing.
        // You will have to switch this destination when testing the other domain.
        // This is a common development limitation.
        destination: "https://be7713.rcr82.waw05.i8yz83pn.com/:path*",
      },
    ];
  },
};

export default nextConfig;
