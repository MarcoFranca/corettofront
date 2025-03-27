// next.config.js
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    compress: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'corretorlab-file.s3.amazonaws.com',
                pathname: '/**',
            },
        ],
    },
};

export default withBundleAnalyzer(nextConfig);
