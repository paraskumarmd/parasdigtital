/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  
  // Cloudflare Pages optimization
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Reduce bundle size
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Split vendor chunks to reduce individual file sizes
      config.optimization.splitChunks = {
        chunks: 'all',
        maxSize: 244000, // Just under 25MB limit
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
  
  // Enable compression
  compress: true,
};

module.exports = nextConfig;
