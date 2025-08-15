/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  
  // Cloudflare Pages optimization
  experimental: {
    optimizePackageImports: ['lucide-react'],
    // Reduce bundle size
    optimizeCss: true,
    // Disable some features to reduce size
    serverComponentsExternalPackages: [],
  },
  
  // Reduce bundle size
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      // More aggressive chunk splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        maxSize: 20000000, // 20MB chunks (well under 25MB limit)
        minSize: 1000000,  // 1MB minimum
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
            enforce: true,
          },
          // Split large packages into separate chunks
          lucide: {
            test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
            name: 'lucide',
            priority: 20,
            chunks: 'all',
          },
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix',
            priority: 20,
            chunks: 'all',
          },
          framer: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer',
            priority: 20,
            chunks: 'all',
          },
        },
      };
      
      // Enable tree shaking
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      
      // Reduce bundle size
      config.optimization.minimize = true;
    }
    return config;
  },
  
  // Enable compression
  compress: true,
  
  // Reduce output size
  swcMinify: true,
  
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  
  // Reduce static generation
  staticPageGenerationTimeout: 120,
};

module.exports = nextConfig;
