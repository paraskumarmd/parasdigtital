import { AboutSection } from '@/components/sections/about-section';

export const metadata = {
  title: 'About - Alex Johnson | AI Enthusiast & Digital Marketing Strategist',
  description: 'Learn about Alex Johnson\'s journey in AI and digital marketing, skills, expertise, and passion for bridging technology with business growth.',
  keywords: ['AI consultant', 'digital marketing expert', 'machine learning', 'marketing automation', 'Alex Johnson'],
};

export default function AboutPage() {
  return (
    <main className="pt-20">
      <AboutSection />
    </main>
  );
}