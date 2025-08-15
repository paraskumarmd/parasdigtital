import { ContactSection } from '@/components/sections/contact-section';

export const metadata = {
  title: 'Contact - Alex Johnson | Get In Touch',
  description: 'Ready to transform your business with AI-driven marketing strategies? Contact Alex Johnson to discuss your project and goals.',
  keywords: ['contact AI consultant', 'digital marketing consultation', 'AI strategy consultation', 'get in touch'],
};

export default function ContactPage() {
  return (
    <main className="pt-20">
      <ContactSection />
    </main>
  );
}