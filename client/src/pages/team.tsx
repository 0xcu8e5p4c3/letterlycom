import TeamSection from '@/components/team-section';
import CTASection from '@/components/cta-section';

export default function Team() {
  return (
    <main className="pt-24">
      <div className="bg-primary/10 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">Our Team</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Meet the talented professionals behind our successful projects.
          </p>
        </div>
      </div>
      <TeamSection />
      <CTASection />
    </main>
  );
}
