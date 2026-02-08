/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['images.unsplash.com'],
    },
    // Disable static page generation for pages that use dynamic features
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
};

module.exports = nextConfig;
