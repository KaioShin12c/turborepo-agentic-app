import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Separator } from "@repo/ui/components/ui/separator";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Compass, LockKeyhole, ShieldCheck, Terminal } from "lucide-react";

export function EntryCard() {
  return (
    <div className="mx-auto flex w-full max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-700 lg:mx-0 lg:justify-self-end">
      <Card className="relative w-full overflow-hidden rounded-3xl border-border/60 bg-card/75 py-0 shadow-2xl backdrop-blur-2xl">
        <div className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-primary/80 to-transparent" />
        <div className="absolute -right-16 -top-20 size-52 rounded-full bg-primary/10 blur-3xl" />

        <CardHeader className="relative gap-4 px-6 pb-2 pt-7 text-left sm:px-8 sm:pt-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
                <Terminal />
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Entry console</p>
                <p className="text-sm text-muted-foreground">lumina.os</p>
              </div>
            </div>
            <div className="rounded-full border border-border/60 bg-secondary/40 px-3 py-1 font-mono text-xs uppercase tracking-widest text-primary">
              Live
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <CardTitle className="font-serif text-4xl font-medium leading-none tracking-tighter text-card-foreground">
              Open Lumina
            </CardTitle>
            <CardDescription className="text-sm leading-6 text-muted-foreground">
              Restore an existing workspace or create a protected account to begin.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="relative flex flex-col gap-5 px-6 pb-7 sm:px-8 sm:pb-8">
          <div className="rounded-2xl border border-border/60 bg-background/35 p-4 font-mono text-xs text-muted-foreground">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <ShieldCheck />
              <span className="uppercase tracking-widest">Verified gateway</span>
            </div>
            <p className="leading-6">auth surface: synchronized · route index: ready · status: protected</p>
          </div>

          <div className="flex items-center gap-3" aria-hidden="true">
            <Separator className="flex-1 bg-border/60" />
            <span className="whitespace-nowrap font-mono text-xs uppercase tracking-widest text-muted-foreground">
              choose access
            </span>
            <Separator className="flex-1 bg-border/60" />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="h-12 flex-1 rounded-xl font-mono text-xs uppercase tracking-widest shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
            >
              <Link to="/login">
                Sign in
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 flex-1 rounded-xl border-border/60 bg-secondary/40 font-mono text-xs uppercase tracking-widest text-secondary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary/70"
            >
              <Link to="/signup">
                <Compass data-icon="inline-start" />
                Create account
              </Link>
            </Button>
          </div>

          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            <LockKeyhole className="mr-1 inline align-[-2px] text-muted-foreground" />
            Built with React, TanStack Router, and shadcn/ui components.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
