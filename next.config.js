/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.weatherapi.com',
            }
        ]
    },
    nextConfig,
    env: {
        HOST: process.env.HOST,
        KEY: process.env.KEY
    }
}
