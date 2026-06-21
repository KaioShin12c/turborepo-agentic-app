import { createFileRoute } from "@tanstack/react-router";
import { EntryCard } from "../features/landing/components/entry-card";
import { HeroSection } from "../features/landing/components/hero-section";
import { ModeToggle } from "../shared/components/mode-toggle";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="fixed right-4 top-4 z-50 sm:right-6 sm:top-6">
        <ModeToggle />
      </div>
      <div className="pointer-events-none fixed inset-0">
        <div className="home-atmosphere absolute inset-0" />
        <div className="home-grid-overlay absolute inset-0" />
        <div className="home-noise-overlay absolute inset-0 opacity-[0.035] mix-blend-multiply dark:opacity-5 dark:mix-blend-screen" />
        <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-linear-to-r from-transparent via-primary/70 to-transparent" />
      </div>

      <div className="relative z-10 grid min-h-screen grid-cols-1 items-center gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,500px)] lg:px-14 xl:px-24">
        <HeroSection />
        <EntryCard />
      </div>
    </main>
  );
}
