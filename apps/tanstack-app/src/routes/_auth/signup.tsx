import { authClient } from "@repo/auth/client";
import { Alert, AlertDescription } from "@repo/ui/components/ui/alert";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { Label } from "@repo/ui/components/ui/label";
import { Separator } from "@repo/ui/components/ui/separator";
import { cn } from "@repo/ui/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  KeyRound,
  Loader2,
  LockKeyhole,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PasswordInput } from "../../features/auth/components/password-input";
import { type SignupFormValues, signupSchema } from "../../features/auth/schemas/signup.schema";
import { FormInput } from "../../shared/components/form-fields/form-input";
import { ModeToggle } from "../../shared/components/mode-toggle";

export const Route = createFileRoute("/_auth/signup")({
  component: SignupPage,
});

function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [signupComplete, setSignupComplete] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<SignupFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptedTerms: false,
    },
  });
  const acceptedTerms = watch("acceptedTerms");

  const onSubmit = async (values: SignupFormValues) => {
    setAuthError(null);
    setSignupComplete(false);

    const result = signupSchema.safeParse(values);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];

        if (
          fieldName === "fullName" ||
          fieldName === "email" ||
          fieldName === "password" ||
          fieldName === "confirmPassword" ||
          fieldName === "acceptedTerms"
        ) {
          setError(fieldName, { message: issue.message, type: "manual" });
        }
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        name: result.data.fullName,
        email: result.data.email,
        password: result.data.password,
      });

      if (error) {
        setAuthError(error.message || "Unable to create account.");
        return;
      }

      setSignupComplete(true);
    } catch {
      setAuthError("Unable to create account right now. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setAuthError(null);
    setSignupComplete(false);
    setIsGithubLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });

      if (error) {
        setAuthError(error.message || "Unable to continue with GitHub.");
      }
    } catch {
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
      <div className="pointer-events-none fixed inset-0">
        <div className="home-atmosphere absolute inset-0" />
        <div className="home-grid-overlay absolute inset-0" />
        <div className="home-noise-overlay absolute inset-0 opacity-[0.035] mix-blend-multiply dark:opacity-5 dark:mix-blend-screen" />
        <div className="absolute left-1/2 top-0 h-px w-[70vw] -translate-x-1/2 bg-linear-to-r from-transparent via-primary/70 to-transparent" />
      </div>

      <div className="relative z-10 grid min-h-screen grid-cols-1 items-center gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(400px,500px)] lg:px-14 xl:px-24">
        <section className="hidden max-w-3xl animate-in fade-in slide-in-from-left-6 duration-700 lg:flex lg:flex-col lg:gap-10">
          <div className="flex items-center gap-3 text-primary">
            <div className="flex size-11 items-center justify-center rounded-full border border-primary/40 bg-primary/10 shadow-xl">
              <Sparkles />
            </div>
            <span className="font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.42em]">
              Lumina invitation desk
            </span>
          </div>

          <div className="flex flex-col gap-6">
            <p className="font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.5em] text-muted-foreground">
              New secure workspace / 2026
            </p>
            <h1 className="max-w-2xl font-['Didot','Bodoni_72','Times_New_Roman',serif] text-6xl font-medium leading-[0.92] tracking-[-0.07em] text-foreground xl:text-7xl">
              Begin with a key cut only for you.
            </h1>
            <p className="max-w-xl font-sans text-lg leading-8 text-muted-foreground">
              Create your private console with a polished authentication flow, protected onboarding, and a low-noise
              workspace from the first session.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-3 gap-3">
            {["Private profile", "Policy consent", "Encrypted access"].map((item) => (
              <div key={item} className="rounded-2xl border border-border/60 bg-card/55 p-4 backdrop-blur-md">
                <Check className="mb-4 text-primary" />
                <p className="font-[ui-monospace,Menlo,monospace] text-[11px] uppercase leading-5 tracking-[0.22em] text-card-foreground">
                  {item}
                </p>
              </div>
            ))}
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
                    <Terminal />
                  </div>
                  <div>
                    <p className="font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.34em] text-muted-foreground">
                      Onboard console
                    </p>
                    <p className="font-sans text-sm text-muted-foreground">lumina.os</p>
                  </div>
                </div>
                <div className="rounded-full border border-border/60 bg-secondary/40 px-3 py-1 font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.22em] text-primary">
                  Invite
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <CardTitle className="font-['Didot','Bodoni_72','Times_New_Roman',serif] text-4xl font-medium leading-none tracking-[-0.05em] text-card-foreground">
                  Create account
                </CardTitle>
                <CardDescription className="font-sans text-sm leading-6 text-muted-foreground">
                  Register your credentials to open a private Lumina workspace.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="relative flex flex-col gap-5 px-6 pb-7 sm:px-8 sm:pb-8">
              <div className="rounded-2xl border border-border/60 bg-background/35 p-4 font-[ui-monospace,Menlo,monospace] text-xs text-muted-foreground">
                <div className="mb-3 flex items-center gap-2 text-primary">
                  <ShieldCheck />
                  <span className="uppercase tracking-[0.28em]">Protected enrollment</span>
                </div>
                <p className="leading-6">identity seed: encrypted · consent: required · status: ready</p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGithubSignIn}
                disabled={isGithubLoading || isLoading}
                className="h-12 rounded-xl border-border/60 bg-secondary/40 font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.22em] text-secondary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary/70"
              >
                {isGithubLoading ? (
                  <Loader2 className="animate-spin" data-icon="inline-start" />
                ) : (
                  <svg aria-hidden="true" className="size-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.71.5.09.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.38 9.38 0 0 1 12 6.98c.85 0 1.7.12 2.5.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.04 10.04 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
                  </svg>
                )}
                {isGithubLoading ? "Opening GitHub" : "Continue with GitHub"}
              </Button>

              <div className="flex items-center gap-3" aria-hidden="true">
                <Separator className="flex-1 bg-border/60" />
                <span className="whitespace-nowrap font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  account details
                </span>
                <Separator className="flex-1 bg-border/60" />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                <FormInput
                  id="full-name"
                  label="Full name"
                  type="text"
                  placeholder="Ada Lovelace"
                  autoComplete="name"
                  error={errors.fullName?.message}
                  {...register("fullName")}
                />

                <FormInput
                  id="signup-email"
                  label="Email"
                  type="email"
                  placeholder="name@company.com"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register("email")}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <PasswordInput
                    id="signup-password"
                    label="Password"
                    placeholder="Create password"
                    autoComplete="new-password"
                    error={errors.password?.message}
                    {...register("password")}
                  />

                  <PasswordInput
                    id="confirm-password"
                    label="Confirm"
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    showPasswordAriaLabel="Show confirm password"
                    hidePasswordAriaLabel="Hide confirm password"
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                  />
                </div>

                <div className="rounded-[1.35rem] border border-border/60 bg-background/35 p-4 sm:rounded-2xl">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => {
                        setValue("acceptedTerms", checked === true);
                        clearErrors("acceptedTerms");
                      }}
                      aria-invalid={errors.acceptedTerms ? "true" : "false"}
                      aria-describedby={errors.acceptedTerms ? "terms-error" : undefined}
                      className="mt-0.5 border-border data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                    <div className="flex flex-1 flex-col gap-3">
                      <Label
                        htmlFor="terms"
                        className="cursor-pointer font-sans text-sm leading-6 text-card-foreground"
                      >
                        I agree to Lumina's account policies and protected enrollment terms.
                      </Label>
                      <div className="flex flex-wrap gap-2 pl-0.5 font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.18em]">
                        <a
                          href="/terms"
                          className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-primary transition-colors hover:border-primary/40 hover:bg-primary/15 hover:text-primary/80"
                        >
                          Terms
                        </a>
                        <a
                          href="/privacy"
                          className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-primary transition-colors hover:border-primary/40 hover:bg-primary/15 hover:text-primary/80"
                        >
                          Privacy Policy
                        </a>
                      </div>
                      {errors.acceptedTerms ? (
                        <p id="terms-error" className="font-sans text-sm text-destructive">
                          {errors.acceptedTerms.message}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>

                {authError ? (
                  <Alert variant="destructive">
                    <AlertDescription>{authError}</AlertDescription>
                  </Alert>
                ) : null}

                {signupComplete ? (
                  <Alert>
                    <AlertDescription>
                      Account created. You can now{" "}
                      <Link
                        to="/login"
                        className="font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
                      >
                        sign in to Lumina
                      </Link>
                      .
                    </AlertDescription>
                  </Alert>
                ) : null}

                <Button
                  type="submit"
                  disabled={isLoading || isGithubLoading}
                  className={cn(
                    "mt-1 h-12 rounded-xl font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.24em] shadow-xl transition-all duration-300 hover:shadow-2xl",
                    !isLoading && "hover:-translate-y-0.5",
                  )}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" data-icon="inline-start" />
                      Creating
                    </>
                  ) : (
                    <>
                      <KeyRound data-icon="inline-start" />
                      Create account
                      <ArrowRight data-icon="inline-end" />
                    </>
                  )}
                </Button>
              </form>

              <p className="text-center font-sans text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mx-auto flex max-w-[500px] flex-col items-center gap-3 text-center font-sans text-xs leading-relaxed text-muted-foreground lg:col-start-2 lg:justify-self-end">
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/55 px-3 py-2 backdrop-blur-md">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-muted-foreground">
              <LockKeyhole className="size-3.5" />
            </span>
            <span>Enrollment is protected by Lumina policy controls.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.18em]">
            <ScrollText className="size-3.5 text-muted-foreground" />
            <a
              href="/privacy"
              className="text-muted-foreground underline underline-offset-4 transition-colors hover:text-primary"
            >
              Privacy Policy
            </a>
            <span className="text-muted-foreground">/</span>
            <a
              href="/terms"
              className="text-muted-foreground underline underline-offset-4 transition-colors hover:text-primary"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
