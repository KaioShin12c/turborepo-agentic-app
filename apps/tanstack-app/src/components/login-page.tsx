import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { Label } from "@repo/ui/components/ui/label";
import { Separator } from "@repo/ui/components/ui/separator";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@repo/ui/lib/utils";
import { authClient } from "@repo/auth/client";
import { PasswordInput } from "./password-input";

const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [isHandoffReady, setIsHandoffReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  const rememberMe = watch("rememberMe");

  const onSubmit = async (values: LoginFormValues) => {
    setAuthError(null);

    const result = loginSchema.safeParse(values);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];

        if (fieldName === "email" || fieldName === "password") {
          setError(fieldName, { message: issue.message, type: "manual" });
        }
      });
      return;
    }

    setIsLoading(true);
    setIsHandoffReady(false);
    try {
      const { error } = await authClient.signIn.email({
        email: result.data.email,
        password: result.data.password,
        rememberMe: result.data.rememberMe,
        callbackURL: "/dashboard",
      });

      if (error) {
        setAuthError(error.message || "Unable to sign in.");
        setIsHandoffReady(false);
      } else {
        setIsHandoffReady(true);
      }
    } catch {
      setIsHandoffReady(false);
      setAuthError(
        "Unable to sign in right now. Check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setAuthError(null);
    setIsGithubLoading(true);
    setIsHandoffReady(false);

    try {
      const { error } = await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });

      if (error) {
        setAuthError(error.message || "Unable to continue with GitHub.");
        setIsHandoffReady(false);
      } else {
        setIsHandoffReady(true);
      }
    } catch {
      setIsHandoffReady(false);
      setAuthError(
        "Unable to continue with GitHub right now. Check your connection and try again.",
      );
    } finally {
      setIsGithubLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7FBFF] text-[#102033]">
      {/* A restrained atmospheric system keeps the login surface legible. */}
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

      <div className="relative z-10 grid min-h-screen grid-cols-1 items-center gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,480px)] lg:px-14 xl:px-24">
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
              Secure workspace / 2026
            </p>
            <h1 className="max-w-2xl font-['Didot','Bodoni_72','Times_New_Roman',serif] text-6xl font-medium leading-[0.92] tracking-[-0.07em] text-[#102033] xl:text-7xl">
              Enter the archive with calm precision.
            </h1>
            <p className="max-w-xl font-['Avenir_Next','Segoe_UI',sans-serif] text-lg leading-8 text-[#475569]">
              A refined terminal for teams who need their command center to feel
              composed, protected, and unmistakably premium.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-3 gap-3">
            {[
              "Encrypted sessions",
              "Audit-ready access",
              "Low-noise workflow",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/70 bg-white/58 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-md"
              >
                <Check className="mb-4 text-[#34D399]" />
                <p className="font-[ui-monospace,Menlo,monospace] text-[11px] uppercase leading-5 tracking-[0.22em] text-[#334155]">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="mx-auto flex w-full max-w-[460px] animate-in fade-in slide-in-from-bottom-8 duration-700 lg:mx-0 lg:justify-self-end">
          <Card className="relative w-full overflow-hidden rounded-[2rem] border-white/75 bg-white/78 py-0 shadow-[0_30px_110px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#0284C7]/55 to-transparent" />
            <div className="absolute -right-16 -top-20 size-52 rounded-full bg-[#7DD3FC]/30 blur-3xl" />

            <CardHeader className="relative gap-4 px-6 pb-2 pt-7 text-left sm:px-8 sm:pt-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl border border-[#0284C7]/20 bg-[#E0F2FE]/80 text-[#0369A1]">
                    <Terminal />
                  </div>
                  <div>
                    <p className="font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.34em] text-[#64748B]">
                      Auth console
                    </p>
                    <p className="font-['Avenir_Next','Segoe_UI',sans-serif] text-sm text-[#475569]">
                      lumina.os
                    </p>
                  </div>
                </div>
                <div className="rounded-full border border-[#10B981]/20 bg-[#ECFDF5]/80 px-3 py-1 font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.22em] text-[#047857]">
                  SSL
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <CardTitle className="font-['Didot','Bodoni_72','Times_New_Roman',serif] text-4xl font-medium leading-none tracking-[-0.05em] text-[#102033]">
                  Welcome back
                </CardTitle>
                <CardDescription className="font-['Avenir_Next','Segoe_UI',sans-serif] text-sm leading-6 text-[#475569]">
                  Sign in with your credentials to restore your private
                  workspace.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="relative flex flex-col gap-5 px-6 pb-7 sm:px-8 sm:pb-8">
              <div className="rounded-2xl border border-[#CFE8F7] bg-[#F0FAFF]/75 p-4 font-[ui-monospace,Menlo,monospace] text-xs text-[#475569]">
                <div className="mb-3 flex items-center gap-2 text-[#059669]">
                  <ShieldCheck />
                  <span className="uppercase tracking-[0.28em]">
                    Verified channel
                  </span>
                </div>
                <p className="leading-6">
                  session handoff: encrypted · region: private · status:{" "}
                  {isHandoffReady ? "entering" : "ready"}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGithubSignIn}
                disabled={isGithubLoading || isLoading}
                className="h-12 rounded-xl border-[#CBD5E1] bg-white/70 font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.22em] text-[#102033] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0284C7]/35 hover:bg-white hover:text-[#075985]"
              >
                {isGithubLoading ? (
                  <Loader2 className="animate-spin" data-icon="inline-start" />
                ) : (
                  <svg
                    aria-hidden="true"
                    className="size-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.71.5.09.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.38 9.38 0 0 1 12 6.98c.85 0 1.7.12 2.5.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.04 10.04 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
                  </svg>
                )}
                {isGithubLoading
                  ? "Opening GitHub"
                  : isHandoffReady
                    ? "Entering dashboard"
                    : "Continue with GitHub"}
              </Button>

              <div className="flex items-center gap-3" aria-hidden="true">
                <Separator className="flex-1 bg-[#CBD5E1]" />
                <span className="whitespace-nowrap font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.24em] text-[#64748B]">
                  email access
                </span>
                <Separator className="flex-1 bg-[#CBD5E1]" />
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
                noValidate
              >
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="email"
                    className="font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.22em] text-[#475569]"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    autoComplete="email"
                    className="h-12 rounded-xl border-[#CBD5E1] bg-white/72 font-['Avenir_Next','Segoe_UI',sans-serif] text-[#102033] placeholder:text-[#94A3B8] focus-visible:border-[#0284C7]/70 focus-visible:ring-[#38BDF8]/20"
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    {...register("email")}
                  />
                  {errors.email ? (
                    <p
                      id="email-error"
                      className="font-['Avenir_Next','Segoe_UI',sans-serif] text-sm text-red-600"
                    >
                      {errors.email.message}
                    </p>
                  ) : null}
                </div>

                <PasswordInput
                  id="password"
                  label="Password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  error={errors.password?.message}
                  {...register("password")}
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => {
                        setValue("rememberMe", checked === true);
                        clearErrors("rememberMe");
                      }}
                      className="border-[#94A3B8] data-[state=checked]:border-[#0284C7] data-[state=checked]:bg-[#0284C7] data-[state=checked]:text-white"
                    />
                    <Label
                      htmlFor="remember"
                      className="cursor-pointer font-['Avenir_Next','Segoe_UI',sans-serif] text-sm text-[#475569]"
                    >
                      Remember me
                    </Label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="font-['Avenir_Next','Segoe_UI',sans-serif] text-sm text-[#0284C7] underline-offset-4 transition-colors hover:text-[#075985] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {authError ? (
                  <div
                    role="alert"
                    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-['Avenir_Next','Segoe_UI',sans-serif] text-sm leading-6 text-red-700"
                  >
                    {authError}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  disabled={isLoading || isGithubLoading}
                  className={cn(
                    "mt-1 h-12 rounded-xl bg-[#0284C7] font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.24em] text-white shadow-[0_18px_50px_rgba(2,132,199,0.22)] transition-all duration-300 hover:bg-[#0369A1] hover:shadow-[0_22px_60px_rgba(2,132,199,0.28)]",
                    !isLoading && "hover:-translate-y-0.5",
                  )}
                >
                  {isLoading ? (
                    <>
                      <Loader2
                        className="animate-spin"
                        data-icon="inline-start"
                      />
                      {isHandoffReady ? "Entering" : "Securing"}
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight data-icon="inline-end" />
                    </>
                  )}
                </Button>
              </form>

              <p className="text-center font-['Avenir_Next','Segoe_UI',sans-serif] text-sm text-[#475569]">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-[#0284C7] underline-offset-4 transition-colors hover:text-[#075985] hover:underline"
                >
                  Create one
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>

        <p className="mx-auto max-w-[460px] text-center font-['Avenir_Next','Segoe_UI',sans-serif] text-xs leading-relaxed text-[#64748B] lg:col-start-2 lg:justify-self-end">
          <LockKeyhole className="mr-1 inline align-[-2px] text-[#475569]" />
          Protected by reCAPTCHA and subject to our{" "}
          <Link
            to="/privacy"
            className="text-[#475569] underline underline-offset-4 transition-colors hover:text-[#0284C7]"
          >
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link
            to="/terms"
            className="text-[#475569] underline underline-offset-4 transition-colors hover:text-[#0284C7]"
          >
            Terms of Service
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
