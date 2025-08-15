/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    domains: ['prod-files-secure.s3.us-west-2.amazonaws.com', 's3.us-west-2.amazonaws.com'],
    unoptimized: false,
  },
  
  // Enable hybrid rendering for best performance + API routes
  // Pages are statically generated when possible, dynamic when needed
  
  // Performance optimizations for hybrid rendering
  experimental: {
    optimizePackageImports: ['lucide-react'],
    modern: true, // Target modern browsers only
  },
  
  // Reduce bundle size
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      // Split vendor chunks to reduce individual file sizes
      config.optimization.splitChunks = {
        chunks: 'all',
        maxSize: 20000000, // 20MB chunks (well under 25MB limit)
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
          // Split large packages into separate chunks
          lucide: {
            test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
            name: 'lucide',
            priority: 20,
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
  
  // Enable compression
  compress: true,
  
  // Target modern browsers only (ES2020+)
  experimental: {
    optimizePackageImports: ['lucide-react'],
    modern: true,
  },
};

module.exports = nextConfig;
