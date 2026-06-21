import { Check, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="flex max-w-3xl animate-in flex-col gap-8 fade-in slide-in-from-left-6 duration-700 lg:gap-10">
      <div className="flex items-center gap-3 text-primary">
        <div className="flex size-11 items-center justify-center rounded-full border border-primary/40 bg-primary/10 shadow-xl">
          <Sparkles />
        </div>
        <span className="font-mono text-xs uppercase tracking-widest">Lumina gateway</span>
      </div>

      <div className="flex flex-col gap-6">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Private workspace / 2026</p>
        <h1 className="max-w-3xl font-serif text-5xl font-medium leading-none tracking-tighter text-foreground sm:text-6xl xl:text-7xl">
          A composed threshold for secure teams.
        </h1>
        <p className="max-w-xl text-lg leading-8 text-muted-foreground">
          Enter Lumina through a refined authentication system built for protected sessions, calm onboarding, and
          low-noise collaboration.
        </p>
      </div>

      <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
        {["Private access", "Encrypted sessions", "Audit-ready flow"].map((item) => (
          <div key={item} className="rounded-2xl border border-border/60 bg-card/55 p-4 backdrop-blur-md">
            <Check className="mb-4 text-primary" />
            <p className="font-mono text-xs uppercase leading-5 tracking-widest text-card-foreground">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
