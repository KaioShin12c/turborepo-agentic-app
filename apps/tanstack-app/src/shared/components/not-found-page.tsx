import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Separator } from "@repo/ui/components/ui/separator";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Compass, LockKeyhole, Radar, Sparkles } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

export default function NotFoundPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="fixed right-4 top-4 z-50 sm:right-6 sm:top-6">
        <ModeToggle />
      </div>
      {/* Mirror the login page atmosphere so unknown routes still feel intentional. */}
      <div className="pointer-events-none fixed inset-0">
        <div className="home-atmosphere absolute inset-0" />
        <div className="home-grid-overlay absolute inset-0" />
        <div className="home-noise-overlay absolute inset-0 opacity-[0.035] mix-blend-multiply dark:opacity-5 dark:mix-blend-screen" />
        <div className="absolute left-1/2 top-0 h-px w-[70vw] -translate-x-1/2 bg-linear-to-r from-transparent via-primary/70 to-transparent" />
      </div>

      <div className="relative z-10 grid min-h-screen grid-cols-1 items-center gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(380px,500px)] lg:px-14 xl:px-24">
        <section className="hidden max-w-3xl animate-in fade-in slide-in-from-left-6 duration-700 lg:flex lg:flex-col lg:gap-10">
          <div className="flex items-center gap-3 text-primary">
            <div className="flex size-11 items-center justify-center rounded-full border border-primary/40 bg-primary/10 shadow-xl">
              <Sparkles />
            </div>
            <span className="font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.42em]">
              Lumina private access
            </span>
          </div>

          <div className="flex flex-col gap-6">
            <p className="font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.5em] text-muted-foreground">
              Signal lost / 404
            </p>
            <h1 className="max-w-2xl font-['Didot','Bodoni_72','Times_New_Roman',serif] text-6xl font-medium leading-[0.92] tracking-[-0.07em] text-foreground xl:text-7xl">
              This corridor is outside the archive.
            </h1>
            <p className="max-w-xl font-sans text-lg leading-8 text-muted-foreground">
              The requested workspace route is unavailable, expired, or sealed behind another access channel.
            </p>
          </div>
        </section>

        <div className="mx-auto flex w-full max-w-[500px] animate-in fade-in slide-in-from-bottom-8 duration-700 lg:mx-0 lg:justify-self-end">
          <Card className="relative w-full overflow-hidden rounded-[2rem] border-border/60 bg-card/75 py-0 shadow-2xl backdrop-blur-2xl">
            <div className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-primary/80 to-transparent" />
            <div className="absolute -right-16 -top-20 size-52 rounded-full bg-primary/10 blur-3xl" />

            <CardHeader className="relative gap-4 px-6 pb-2 pt-7 text-left sm:px-8 sm:pt-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
                    <Radar />
                  </div>
                  <div>
                    <p className="font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.34em] text-muted-foreground">
                      Route console
                    </p>
                    <p className="font-sans text-sm text-muted-foreground">lumina.os</p>
                  </div>
                </div>
                <div className="rounded-full border border-border/60 bg-secondary/40 px-3 py-1 font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.22em] text-primary">
                  404
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <CardTitle className="font-['Didot','Bodoni_72','Times_New_Roman',serif] text-4xl font-medium leading-none tracking-[-0.05em] text-card-foreground">
                  Access point not found
                </CardTitle>
                <CardDescription className="font-sans text-sm leading-6 text-muted-foreground">
                  We could not resolve this private route. Return to a verified channel to continue.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="relative flex flex-col gap-5 px-6 pb-7 sm:px-8 sm:pb-8">
              <div className="rounded-2xl border border-border/60 bg-background/35 p-4 font-[ui-monospace,Menlo,monospace] text-xs text-muted-foreground">
                <div className="mb-3 flex items-center gap-2 text-primary">
                  <LockKeyhole />
                  <span className="uppercase tracking-[0.28em]">Secure fallback</span>
                </div>
                <p className="leading-6">route status: unresolved · archive index: intact · action: return home</p>
              </div>

              <div className="flex items-center gap-3" aria-hidden="true">
                <Separator className="flex-1 bg-border/60" />
                <span className="whitespace-nowrap font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  navigation recovery
                </span>
                <Separator className="flex-1 bg-border/60" />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="h-12 flex-1 rounded-xl font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.24em] shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
                >
                  <Link to="/">
                    <ArrowLeft data-icon="inline-start" />
                    Return home
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 flex-1 rounded-xl border-border/60 bg-secondary/40 font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.24em] text-secondary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary/70"
                >
                  <Link to="/login">
                    <Compass data-icon="inline-start" />
                    Sign in
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
