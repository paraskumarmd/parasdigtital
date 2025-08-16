import { getBlogPosts } from '@/lib/notion';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

// Add ISR for automatic updates
export const revalidate = 86400; // Revalidate every day

export const metadata: Metadata = {
  title: 'Blog - Alex Johnson | AI & Digital Marketing Insights',
  description: 'Latest insights on AI trends, digital marketing strategies, and the future of technology-driven business growth.',
  keywords: ['AI blog', 'digital marketing insights', 'AI trends', 'marketing strategy', 'technology blog'],
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  // Debug: Log all posts and their status values
  console.log('=== BLOG PAGE DEBUG ===');
  console.log('Total posts found:', posts.length);
  posts.forEach((post: any, index: number) => {
    const title = post.properties?.Title?.title?.[0]?.plain_text || 'Untitled';
    const status = post.properties?.Status?.status?.name || '';
    console.log(`Post ${index + 1}: "${title}" - Status: "${status}"`);
  });
  console.log('=== END DEBUG ===');

  // Filter posts to only show published ones
  const publishedPosts = posts.filter((post: any) => {
    const status = post.properties?.Status?.status?.name || '';
    return status.toLowerCase() === 'published';
  });

  console.log('Published posts count:', publishedPosts.length);

  return (
    <main className="max-w-4xl mx-auto py-20 px-4">
      <h1 className="text-4xl font-bold mb-6 text-foreground">Blog</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {publishedPosts.map((post: any) => {
          const title = post.properties?.Title?.title?.[0]?.plain_text || 'Untitled';
          const description = post.properties?.Blogs?.rich_text?.[0]?.plain_text || '';
          const image = post.properties?.featuredImage?.files?.[0]?.file?.url || post.properties?.featuredImage?.files?.[0]?.external?.url || '';
          const slug = post.properties?.Slug?.rich_text?.[0]?.plain_text || '';
          
          return (
            <Link key={post.id} href={`/blog/${slug}`} className="block">
              <div className="bg-background rounded-lg shadow p-6 flex flex-col hover:shadow-lg transition-shadow cursor-pointer">
                {image && (
                  <div className="relative w-full h-48 mb-4">
                    <Image 
                      src={image} 
                      alt={title} 
                      fill
                      className="object-cover rounded"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}
                <h2 className="text-2xl font-semibold mb-2 text-foreground">{title}</h2>
                <p className="text-muted-foreground mb-4 flex-grow">{description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}