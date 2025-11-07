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
    images: {
        domains: [
            'images.unsplash.com',
            'vercel.app',
            'lh3.googleusercontent.com',
            'mario-health-api-ei5wbr4h5a-uc.a.run.app',
        ],
    },
    trailingSlash: true,
    env: {
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    },
};

export default nextConfig;
