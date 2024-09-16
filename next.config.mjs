/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['corretorlab-file.s3.amazonaws.com'], // Adicione aqui o domínio da sua imagem
    },
};


export default nextConfig;
