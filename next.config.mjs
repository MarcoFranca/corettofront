/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
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

export default nextConfig;
