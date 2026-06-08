import { authClient } from "@repo/auth/client";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { Separator } from "@repo/ui/components/ui/separator";
import { cn } from "@repo/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Loader2, LockKeyhole, ShieldCheck, Sparkles, Terminal } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ModeToggle } from "./mode-toggle";
import { PasswordInput } from "./password-input";

const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoadingDots() {
  return (
    <span className="inline-flex" aria-hidden="true">
      <span className="animate-pulse">.</span>
      <span className="animate-pulse [animation-delay:200ms]">.</span>
      <span className="animate-pulse [animation-delay:400ms]">.</span>
    </span>
  );
}

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
  const loading = isLoading || isGithubLoading;

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
      setAuthError("Unable to sign in right now. Check your connection and try again.");
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
      setAuthError("Unable to continue with GitHub right now. Check your connection and try again.");
    } finally {
      setIsGithubLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="fixed right-4 top-4 z-50 sm:right-6 sm:top-6">
        <ModeToggle />
      </div>
      {/* A restrained atmospheric system keeps the login surface legible. */}
      <div className="pointer-events-none fixed inset-0">
        <div className="home-atmosphere absolute inset-0" />
        <div className="home-grid-overlay absolute inset-0" />
        <div className="home-noise-overlay absolute inset-0 opacity-[0.035] mix-blend-multiply dark:opacity-5 dark:mix-blend-screen" />
        <div className="absolute left-1/2 top-0 h-px w-[70vw] -translate-x-1/2 bg-linear-to-r from-transparent via-primary/70 to-transparent" />
      </div>

      <div className="relative z-10 grid min-h-screen grid-cols-1 items-center gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,480px)] lg:px-14 xl:px-24">
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
              Secure workspace / 2026
            </p>
            <h1 className="max-w-2xl font-['Didot','Bodoni_72','Times_New_Roman',serif] text-6xl font-medium leading-[0.92] tracking-[-0.07em] text-foreground xl:text-7xl">
              Enter the archive with calm precision.
            </h1>
            <p className="max-w-xl font-['Avenir_Next','Segoe_UI',sans-serif] text-lg leading-8 text-muted-foreground">
              A refined terminal for teams who need their command center to feel composed, protected, and unmistakably
              premium.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-3 gap-3">
            {["Encrypted sessions", "Audit-ready access", "Low-noise workflow"].map((item) => (
              <div key={item} className="rounded-2xl border border-border/60 bg-card/55 p-4 backdrop-blur-md">
                <Check className="mb-4 text-primary" />
                <p className="font-[ui-monospace,Menlo,monospace] text-[11px] uppercase leading-5 tracking-[0.22em] text-card-foreground">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="mx-auto flex w-full max-w-[460px] animate-in fade-in slide-in-from-bottom-8 duration-700 lg:mx-0 lg:justify-self-end">
          <Card
            className={cn(
              "relative w-full overflow-hidden rounded-[2rem] border-border/60 bg-card/75 py-0 shadow-2xl backdrop-blur-2xl transition-shadow duration-700",
              loading && "shadow-primary/20 shadow-[0_0_60px_-15px]",
            )}
          >
            {loading ? (
              <div className="absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden">
                <div className="animate-pulse absolute inset-0 bg-linear-to-r from-transparent via-primary/60 to-transparent" />
              </div>
            ) : null}
            <div className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-primary/80 to-transparent" />
            <div className="absolute -right-16 -top-20 size-52 rounded-full bg-primary/10 blur-3xl" />

            <CardHeader className="relative gap-4 px-6 pb-2 pt-7 text-left sm:px-8 sm:pt-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
                    <Terminal />
                  </div>
                  <div>
                    <p className="font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.34em] text-muted-foreground">
                      Auth console
                    </p>
                    <p className="font-['Avenir_Next','Segoe_UI',sans-serif] text-sm text-muted-foreground">
                      lumina.os
                    </p>
                  </div>
                </div>
                <div className="rounded-full border border-border/60 bg-secondary/40 px-3 py-1 font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.22em] text-primary">
                  SSL
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <CardTitle className="font-['Didot','Bodoni_72','Times_New_Roman',serif] text-4xl font-medium leading-none tracking-[-0.05em] text-card-foreground">
                  Welcome back
                </CardTitle>
                <CardDescription className="font-['Avenir_Next','Segoe_UI',sans-serif] text-sm leading-6 text-muted-foreground">
                  Sign in with your credentials to restore your private workspace.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="relative flex flex-col gap-5 px-6 pb-7 sm:px-8 sm:pb-8">
              <div className="rounded-2xl border border-border/60 bg-background/35 p-4 font-[ui-monospace,Menlo,monospace] text-xs text-muted-foreground">
                <div className="mb-3 flex items-center gap-2 text-primary">
                  <ShieldCheck />
                  <span className="uppercase tracking-[0.28em]">Verified channel</span>
                </div>
                <p className="leading-6">
                  session handoff: encrypted · region: private · status:{" "}
                  <span
                    className={cn(
                      "font-medium transition-colors duration-500",
                      isHandoffReady && "text-emerald-500",
                      loading && !isHandoffReady && "text-primary",
                    )}
                  >
                    {loading ? (isHandoffReady ? "entering" : "authenticating") : "ready"}
                  </span>
                  {loading ? <LoadingDots /> : null}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGithubSignIn}
                disabled={isGithubLoading || isLoading}
                className="h-12 rounded-xl border-border/60 bg-secondary/40 font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.22em] text-secondary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary/70"
              >
                {isGithubLoading ? (
                  <>
                    <Loader2 className="animate-spin" data-icon="inline-start" />
                    Opening GitHub
                    <LoadingDots />
                  </>
                ) : isHandoffReady ? (
                  <>
                    <Check className="text-emerald-500" data-icon="inline-start" />
                    Entering dashboard
                    <LoadingDots />
                  </>
                ) : (
                  <>
                    <svg aria-hidden="true" className="size-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.71.5.09.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.38 9.38 0 0 1 12 6.98c.85 0 1.7.12 2.5.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.04 10.04 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
                    </svg>
                    Continue with GitHub
                  </>
                )}
              </Button>

              <div className="flex items-center gap-3" aria-hidden="true">
                <Separator className="flex-1 bg-border/60" />
                <span className="whitespace-nowrap font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  email access
                </span>
                <Separator className="flex-1 bg-border/60" />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="email"
                    className="font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.22em] text-muted-foreground"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    autoComplete="email"
                    disabled={loading}
                    className="h-12 rounded-xl border-border/60 bg-background/50 font-['Avenir_Next','Segoe_UI',sans-serif] text-foreground placeholder:text-muted-foreground focus-visible:border-primary/70 focus-visible:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    {...register("email")}
                  />
                  {errors.email ? (
                    <p id="email-error" className="font-['Avenir_Next','Segoe_UI',sans-serif] text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  ) : null}
                </div>

                <PasswordInput
                  id="password"
                  label="Password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                  error={errors.password?.message}
                  {...register("password")}
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      disabled={loading}
                      onCheckedChange={(checked) => {
                        setValue("rememberMe", checked === true);
                        clearErrors("rememberMe");
                      }}
                      className="border-border data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                    <Label
                      htmlFor="remember"
                      className="cursor-pointer font-['Avenir_Next','Segoe_UI',sans-serif] text-sm text-muted-foreground"
                    >
                      Remember me
                    </Label>
                  </div>
                  <Link
                    to="/"
                    className="font-['Avenir_Next','Segoe_UI',sans-serif] text-sm text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {authError ? (
                  <div
                    role="alert"
                    className="rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 font-['Avenir_Next','Segoe_UI',sans-serif] text-sm leading-6 text-destructive"
                  >
                    {authError}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "mt-1 h-12 rounded-xl font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.24em] shadow-xl transition-all duration-300 hover:shadow-2xl",
                    !loading && "hover:-translate-y-0.5",
                  )}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" data-icon="inline-start" />
                      {isHandoffReady ? "Entering" : "Securing"}
                      <LoadingDots />
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight data-icon="inline-end" />
                    </>
                  )}
                </Button>
              </form>

              <p className="text-center font-['Avenir_Next','Segoe_UI',sans-serif] text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
                >
                  Create one
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>

        <p className="mx-auto max-w-[460px] text-center font-['Avenir_Next','Segoe_UI',sans-serif] text-xs leading-relaxed text-muted-foreground lg:col-start-2 lg:justify-self-end">
          <LockKeyhole className="mr-1 inline align-[-2px] text-muted-foreground" />
          Protected by reCAPTCHA and subject to our{" "}
          <Link
            to="/"
            className="text-muted-foreground underline underline-offset-4 transition-colors hover:text-primary"
          >
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link
            to="/"
            className="text-muted-foreground underline underline-offset-4 transition-colors hover:text-primary"
          >
            Terms of Service
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
