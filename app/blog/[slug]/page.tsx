import { notFound } from 'next/navigation';
import { Client } from '@notionhq/client';
import { getPageContent } from '@/lib/notion';
import Image from 'next/image';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Add ISR for automatic updates
export const revalidate = 86400; // Revalidate every day (3600 seconds)

// Add this function to generate all possible routes at build time
export async function generateStaticParams() {
  const databaseId = process.env.NOTION_DATABASE_ID!;
  
  const response = await notion.databases.query({
    database_id: databaseId,
  });
  
  return response.results.map((post: any) => ({
    slug: post.properties?.Slug?.rich_text?.[0]?.plain_text || post.id,
  }));
}

async function getBlogPost(slug: string) {
  const databaseId = process.env.NOTION_DATABASE_ID!;
  //console.log('Searching for slug:', slug);
  
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Slug',
      rich_text: {
        equals: slug
      }
    }
  });
  
  //console.log('Found posts:', response.results.length);
  //console.log('First result:', response.results[0]);
  
  return response.results[0] || null;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  //console.log('BlogPostPage called with params:', params);
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const postData = post as any; // Type assertion for Notion response
  const title = postData.properties?.Title?.title?.[0]?.plain_text || 'Untitled';
  const image = postData.properties?.featuredImage?.files?.[0]?.file?.url || postData.properties?.featuredImage?.files?.[0]?.external?.url || '';

  // Fetch the full page content
  const pageContent = await getPageContent(postData.id);
 //console.log('Page content blocks:', pageContent);

  return (
    <main className="max-w-4xl mx-auto py-20 px-4">
      <article>
        {image && (
          <div className="relative w-full h-64 mb-8">
            <Image 
              src={image} 
              alt={title} 
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}
        <h1 className="text-4xl font-bold mb-6 text-foreground">{title}</h1>
        <div className="prose prose-lg max-w-none">
          {pageContent.map((block: any, index: number) => {
            if (block.type === 'paragraph') {
              return (
                <p key={block.id} className="text-muted-foreground leading-relaxed mb-4">
                  {block.paragraph.rich_text.map((text: any) => text.plain_text).join('')}
                </p>
              );
            }
            if (block.type === 'heading_1') {
              return (
                <h2 key={block.id} className="text-2xl font-bold mb-4 text-foreground">
                  {block.heading_1.rich_text.map((text: any) => text.plain_text).join('')}
                </h2>
              );
            }
            if (block.type === 'heading_2') {
              return (
                <h3 key={block.id} className="text-xl font-semibold mb-3 text-foreground">
                  {block.heading_2.rich_text.map((text: any) => text.plain_text).join('')}
                </h3>
              );
            }
            if (block.type === 'bulleted_list_item') {
              return (
                <ul key={block.id} className="list-disc list-inside mb-4">
                  <li className="text-muted-foreground leading-relaxed">
                    {block.bulleted_list_item.rich_text.map((text: any) => text.plain_text).join('')}
                  </li>
                </ul>
              );
            }
            if (block.type === 'image') {
              const imageUrl = block.image.file?.url || block.image.external?.url || '';
              const caption = block.image.caption?.[0]?.plain_text || '';
              return (
                <figure key={block.id} className="my-6">
                  <div className="relative w-full h-96">
                    <Image 
                      src={imageUrl} 
                      alt={caption || 'Blog image'} 
                      fill
                      className="object-contain rounded-lg"
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                  </div>
                  {caption && (
                    <figcaption className="text-sm text-muted-foreground mt-2 text-center">
                      {caption}
                    </figcaption>
                  )}
                </figure>
              );
            }
            if (block.type === 'numbered_list_item') {
              return (
                <ol key={block.id} className="list-decimal list-inside mb-4">
                  <li className="text-muted-foreground leading-relaxed">
                    {block.numbered_list_item.rich_text.map((text: any) => text.plain_text).join('')}
                  </li>
                </ol>
              );
            }
            if (block.type === 'quote') {
              return (
                <blockquote key={block.id} className="border-l-4 border-primary pl-4 my-6 italic text-muted-foreground">
                  {block.quote.rich_text.map((text: any) => text.plain_text).join('')}
                </blockquote>
              );
            }
            if (block.type === 'code') {
              return (
                <pre key={block.id} className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
                  <code className="text-sm">
                    {block.code.rich_text.map((text: any) => text.plain_text).join('')}
                  </code>
                </pre>
              );
            }
            return null;
          })}
        </div>
      </article>
    </main>
  );
} 