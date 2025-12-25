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
    /**
     * 🚨 CRITICAL DEPLOYMENT SETTING 🚨
     * DO NOT REMOVE 'output: export' for production builds!
     * 
     * Why this is required for production:
     * 1. Firebase Hosting: We use static hosting which requires a full static export.
     * 2. Build Artifacts: Without this, 'npm run build' will not generate the '/out' directory.
     * 3. Deployment Safety: Commenting this out will cause stale code to be served in production
     *    because the Firebase CLI will deploy the last successfully generated '/out' folder.
     * 
     * Why it's disabled in development:
     * - Static export requires all dynamic route params to be pre-generated via generateStaticParams()
     * - dynamicParams = true does NOT work with output: 'export'
     * - This allows /providers/[id] and /procedures/[slug] to work with any ID during local dev
     * 
     * Documentation: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
     */
    output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
    // standalone output is NOT compatible with your current firebase.json config
    // output: 'standalone',

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
    trailingSlash: false,
    env: {
        NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE,
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
    // Add rewrites for local development to proxy /api to the gateway
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/:path*',
            },
        ];
    },
};

export default nextConfig;
