// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true, // ✅ Ativa minificação mais rápida
    compress: true, // ✅ Ativa gzip na build final
    experimental: {
        appDir: true,
    },
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

module.exports = withBundleAnalyzer(nextConfig);
