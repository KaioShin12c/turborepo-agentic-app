import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Separator } from "@repo/ui/components/ui/separator";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Compass, LockKeyhole, Radar, Sparkles } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7FBFF] text-[#102033]">
      {/* Mirror the login page atmosphere so unknown routes still feel intentional. */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.24),transparent_34%),radial-gradient(circle_at_84%_8%,rgba(45,212,191,0.18),transparent_36%),radial-gradient(circle_at_50%_96%,rgba(251,191,36,0.14),transparent_34%),linear-gradient(120deg,#F9FCFF_0%,#ECF8FF_48%,#FFF8EA_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,32,51,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(16,32,51,0.045)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_86%)]" />
        <div
          className="absolute inset-0 opacity-[0.035] mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute left-1/2 top-0 h-px w-[70vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#0284C7]/45 to-transparent" />
      </div>

      <div className="relative z-10 grid min-h-screen grid-cols-1 items-center gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(380px,500px)] lg:px-14 xl:px-24">
        <section className="hidden max-w-3xl animate-in fade-in slide-in-from-left-6 duration-700 lg:flex lg:flex-col lg:gap-10">
          <div className="flex items-center gap-3 text-[#0369A1]">
            <div className="flex size-11 items-center justify-center rounded-full border border-[#0284C7]/25 bg-white/65 shadow-[0_18px_54px_rgba(14,116,144,0.16)]">
              <Sparkles />
            </div>
            <span className="font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.42em]">
              Lumina private access
            </span>
          </div>

          <div className="flex flex-col gap-6">
            <p className="font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.5em] text-[#64748B]">
              Signal lost / 404
            </p>
            <h1 className="max-w-2xl font-['Didot','Bodoni_72','Times_New_Roman',serif] text-6xl font-medium leading-[0.92] tracking-[-0.07em] text-[#102033] xl:text-7xl">
              This corridor is outside the archive.
            </h1>
            <p className="max-w-xl font-['Avenir_Next','Segoe_UI',sans-serif] text-lg leading-8 text-[#475569]">
              The requested workspace route is unavailable, expired, or sealed
              behind another access channel.
            </p>
          </div>
        </section>

        <div className="mx-auto flex w-full max-w-[500px] animate-in fade-in slide-in-from-bottom-8 duration-700 lg:mx-0 lg:justify-self-end">
          <Card className="relative w-full overflow-hidden rounded-[2rem] border-white/75 bg-white/78 py-0 shadow-[0_30px_110px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#0284C7]/55 to-transparent" />
            <div className="absolute -right-16 -top-20 size-52 rounded-full bg-[#7DD3FC]/30 blur-3xl" />

            <CardHeader className="relative gap-4 px-6 pb-2 pt-7 text-left sm:px-8 sm:pt-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl border border-[#0284C7]/20 bg-[#E0F2FE]/80 text-[#0369A1]">
                    <Radar />
                  </div>
                  <div>
                    <p className="font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.34em] text-[#64748B]">
                      Route console
                    </p>
                    <p className="font-['Avenir_Next','Segoe_UI',sans-serif] text-sm text-[#475569]">
                      lumina.os
                    </p>
                  </div>
                </div>
                <div className="rounded-full border border-[#10B981]/20 bg-[#ECFDF5]/80 px-3 py-1 font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.22em] text-[#047857]">
                  404
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <CardTitle className="font-['Didot','Bodoni_72','Times_New_Roman',serif] text-4xl font-medium leading-none tracking-[-0.05em] text-[#102033]">
                  Access point not found
                </CardTitle>
                <CardDescription className="font-['Avenir_Next','Segoe_UI',sans-serif] text-sm leading-6 text-[#475569]">
                  We could not resolve this private route. Return to a verified
                  channel to continue.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="relative flex flex-col gap-5 px-6 pb-7 sm:px-8 sm:pb-8">
              <div className="rounded-2xl border border-[#CFE8F7] bg-[#F0FAFF]/75 p-4 font-[ui-monospace,Menlo,monospace] text-xs text-[#475569]">
                <div className="mb-3 flex items-center gap-2 text-[#059669]">
                  <LockKeyhole />
                  <span className="uppercase tracking-[0.28em]">
                    Secure fallback
                  </span>
                </div>
                <p className="leading-6">
                  route status: unresolved · archive index: intact · action:
                  return home
                </p>
              </div>

              <div className="flex items-center gap-3" aria-hidden="true">
                <Separator className="flex-1 bg-[#CBD5E1]" />
                <span className="whitespace-nowrap font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.24em] text-[#64748B]">
                  navigation recovery
                </span>
                <Separator className="flex-1 bg-[#CBD5E1]" />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="h-12 flex-1 rounded-xl bg-[#0284C7] font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.24em] text-white shadow-[0_18px_50px_rgba(2,132,199,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0369A1] hover:shadow-[0_22px_60px_rgba(2,132,199,0.28)]"
                >
                  <Link to="/">
                    <ArrowLeft data-icon="inline-start" />
                    Return home
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 flex-1 rounded-xl border-[#CBD5E1] bg-white/70 font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.24em] text-[#102033] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0284C7]/35 hover:bg-white hover:text-[#075985]"
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
