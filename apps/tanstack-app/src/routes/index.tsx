import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Separator } from "@repo/ui/components/ui/separator";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Compass,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050B14] text-[#EAF2FF]">
      {/* Keep the entry route visually aligned with the auth surfaces it points to. */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.24),transparent_32%),radial-gradient(circle_at_84%_8%,rgba(45,212,191,0.2),transparent_34%),linear-gradient(120deg,#050B14_0%,#07111F_46%,#0B1628_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(234,242,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(234,242,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_86%)]" />
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-screen"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute left-1/2 top-0 h-px w-[70vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#38BDF8]/70 to-transparent" />
      </div>

      <div className="relative z-10 grid min-h-screen grid-cols-1 items-center gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,500px)] lg:px-14 xl:px-24">
        <section className="flex max-w-3xl animate-in flex-col gap-8 fade-in slide-in-from-left-6 duration-700 lg:gap-10">
          <div className="flex items-center gap-3 text-[#38BDF8]">
            <div className="flex size-11 items-center justify-center rounded-full border border-[#38BDF8]/40 bg-[#38BDF8]/10 shadow-[0_0_48px_rgba(56,189,248,0.16)]">
              <Sparkles />
            </div>
            <span className="font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.42em]">
              Lumina gateway
            </span>
          </div>

          <div className="flex flex-col gap-6">
            <p className="font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.5em] text-[#7F91AA]">
              Private workspace / 2026
            </p>
            <h1 className="max-w-3xl font-['Didot','Bodoni_72','Times_New_Roman',serif] text-5xl font-medium leading-[0.92] tracking-[-0.07em] text-[#EAF2FF] sm:text-6xl xl:text-7xl">
              A composed threshold for secure teams.
            </h1>
            <p className="max-w-xl font-['Avenir_Next','Segoe_UI',sans-serif] text-lg leading-8 text-[#B8C7DA]">
              Enter Lumina through a refined authentication system built for
              protected sessions, calm onboarding, and low-noise collaboration.
            </p>
          </div>

          <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
            {["Private access", "Encrypted sessions", "Audit-ready flow"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[#EAF2FF]/10 bg-[#0D1B2F]/55 p-4 backdrop-blur-md"
                >
                  <Check className="mb-4 text-[#34D399]" />
                  <p className="font-[ui-monospace,Menlo,monospace] text-[11px] uppercase leading-5 tracking-[0.22em] text-[#CFE0F4]">
                    {item}
                  </p>
                </div>
              ),
            )}
          </div>
        </section>

        <div className="mx-auto flex w-full max-w-[500px] animate-in fade-in slide-in-from-bottom-8 duration-700 lg:mx-0 lg:justify-self-end">
          <Card className="relative w-full overflow-hidden rounded-[2rem] border-[#EAF2FF]/15 bg-[#0D1B2F]/75 py-0 shadow-[0_30px_120px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#38BDF8]/80 to-transparent" />
            <div className="absolute -right-16 -top-20 size-52 rounded-full bg-[#22D3EE]/10 blur-3xl" />

            <CardHeader className="relative gap-4 px-6 pb-2 pt-7 text-left sm:px-8 sm:pt-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl border border-[#38BDF8]/25 bg-[#38BDF8]/10 text-[#38BDF8]">
                    <Terminal />
                  </div>
                  <div>
                    <p className="font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.34em] text-[#7F91AA]">
                      Entry console
                    </p>
                    <p className="font-['Avenir_Next','Segoe_UI',sans-serif] text-sm text-[#B8C7DA]">
                      lumina.os
                    </p>
                  </div>
                </div>
                <div className="rounded-full border border-[#EAF2FF]/10 px-3 py-1 font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.22em] text-[#34D399]">
                  Live
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <CardTitle className="font-['Didot','Bodoni_72','Times_New_Roman',serif] text-4xl font-medium leading-none tracking-[-0.05em] text-[#EAF2FF]">
                  Open Lumina
                </CardTitle>
                <CardDescription className="font-['Avenir_Next','Segoe_UI',sans-serif] text-sm leading-6 text-[#B8C7DA]">
                  Restore an existing workspace or create a protected account to
                  begin.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="relative flex flex-col gap-5 px-6 pb-7 sm:px-8 sm:pb-8">
              <div className="rounded-2xl border border-[#EAF2FF]/10 bg-[#050B14]/35 p-4 font-[ui-monospace,Menlo,monospace] text-xs text-[#B8C7DA]">
                <div className="mb-3 flex items-center gap-2 text-[#34D399]">
                  <ShieldCheck />
                  <span className="uppercase tracking-[0.28em]">
                    Verified gateway
                  </span>
                </div>
                <p className="leading-6">
                  auth surface: synchronized · route index: ready · status:
                  protected
                </p>
              </div>

              <div className="flex items-center gap-3" aria-hidden="true">
                <Separator className="flex-1 bg-[#EAF2FF]/10" />
                <span className="whitespace-nowrap font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.24em] text-[#7F91AA]">
                  choose access
                </span>
                <Separator className="flex-1 bg-[#EAF2FF]/10" />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="h-12 flex-1 rounded-xl bg-[#38BDF8] font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.24em] text-[#050B14] shadow-[0_18px_50px_rgba(56,189,248,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#22D3EE] hover:shadow-[0_22px_60px_rgba(34,211,238,0.32)]"
                >
                  <Link to="/login">
                    Sign in
                    <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 flex-1 rounded-xl border-[#EAF2FF]/10 bg-[#EAF2FF]/[0.045] font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.24em] text-[#EAF2FF] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#EAF2FF]/10"
                >
                  <Link to="/signup">
                    <Compass data-icon="inline-start" />
                    Create account
                  </Link>
                </Button>
              </div>

              <p className="text-center font-['Avenir_Next','Segoe_UI',sans-serif] text-xs leading-relaxed text-[#7F91AA]">
                <LockKeyhole className="mr-1 inline align-[-2px] text-[#B8C7DA]" />
                Built with React, TanStack Router, and shadcn/ui components.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
