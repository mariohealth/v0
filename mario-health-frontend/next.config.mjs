/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    // CRITICAL: Enable static export for Firebase Hosting
    output: 'export',
    // Disable image optimization for static export (or use unoptimized)
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'vercel.app',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'mario-health-api-ei5wbr4h5a-uc.a.run.app',
            },
            {
                protocol: 'https',
                hostname: 'mario-health-api-gateway-x5pghxd.uc.gateway.dev',
            },
        ],
    },
    trailingSlash: true,
    env: {
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
};

export default nextConfig;
