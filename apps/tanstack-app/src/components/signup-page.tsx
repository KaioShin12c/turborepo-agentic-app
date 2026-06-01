import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { Separator } from "@repo/ui/components/ui/separator";
import { cn } from "@repo/ui/lib/utils";
import { Link } from "@tanstack/react-router";
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
import { z } from "zod";
import { authClient } from "../lib/auth-client";
import { PasswordInput } from "./password-input";

const signupSchema = z
  .object({
    fullName: z.string().trim().min(1, "Enter your full name."),
    email: z.email("Enter a valid email address."),
    password: z.string().min(8, "Use at least 8 characters."),
    confirmPassword: z.string().min(1, "Confirm your password."),
    acceptedTerms: z
      .boolean()
      .refine(
        (accepted) => accepted,
        "You must accept the terms to create an account.",
      ),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
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
      setAuthError(
        "Unable to create account right now. Check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050B14] text-[#EAF2FF]">
      {/* The signup route mirrors login's atmosphere so auth feels like one cohesive product surface. */}
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

      <div className="relative z-10 grid min-h-screen grid-cols-1 items-center gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(400px,500px)] lg:px-14 xl:px-24">
        <section className="hidden max-w-3xl animate-in fade-in slide-in-from-left-6 duration-700 lg:flex lg:flex-col lg:gap-10">
          <div className="flex items-center gap-3 text-[#38BDF8]">
            <div className="flex size-11 items-center justify-center rounded-full border border-[#38BDF8]/40 bg-[#38BDF8]/10 shadow-[0_0_48px_rgba(56,189,248,0.16)]">
              <Sparkles />
            </div>
            <span className="font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.42em]">
              Lumina invitation desk
            </span>
          </div>

          <div className="flex flex-col gap-6">
            <p className="font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.5em] text-[#7F91AA]">
              New secure workspace / 2026
            </p>
            <h1 className="max-w-2xl font-['Didot','Bodoni_72','Times_New_Roman',serif] text-6xl font-medium leading-[0.92] tracking-[-0.07em] text-[#EAF2FF] xl:text-7xl">
              Begin with a key cut only for you.
            </h1>
            <p className="max-w-xl font-['Avenir_Next','Segoe_UI',sans-serif] text-lg leading-8 text-[#B8C7DA]">
              Create your private console with a polished authentication flow,
              protected onboarding, and a low-noise workspace from the first
              session.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-3 gap-3">
            {["Private profile", "Policy consent", "Encrypted access"].map(
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
                      Onboard console
                    </p>
                    <p className="font-['Avenir_Next','Segoe_UI',sans-serif] text-sm text-[#B8C7DA]">
                      lumina.os
                    </p>
                  </div>
                </div>
                <div className="rounded-full border border-[#EAF2FF]/10 px-3 py-1 font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.22em] text-[#34D399]">
                  Invite
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <CardTitle className="font-['Didot','Bodoni_72','Times_New_Roman',serif] text-4xl font-medium leading-none tracking-[-0.05em] text-[#EAF2FF]">
                  Create account
                </CardTitle>
                <CardDescription className="font-['Avenir_Next','Segoe_UI',sans-serif] text-sm leading-6 text-[#B8C7DA]">
                  Register your credentials to open a private Lumina workspace.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="relative flex flex-col gap-5 px-6 pb-7 sm:px-8 sm:pb-8">
              <div className="rounded-2xl border border-[#EAF2FF]/10 bg-[#050B14]/35 p-4 font-[ui-monospace,Menlo,monospace] text-xs text-[#B8C7DA]">
                <div className="mb-3 flex items-center gap-2 text-[#34D399]">
                  <ShieldCheck />
                  <span className="uppercase tracking-[0.28em]">
                    Protected enrollment
                  </span>
                </div>
                <p className="leading-6">
                  identity seed: encrypted · consent: required · status: ready
                </p>
              </div>

              <div className="flex items-center gap-3" aria-hidden="true">
                <Separator className="flex-1 bg-[#EAF2FF]/10" />
                <span className="whitespace-nowrap font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.24em] text-[#7F91AA]">
                  account details
                </span>
                <Separator className="flex-1 bg-[#EAF2FF]/10" />
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
                noValidate
              >
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="full-name"
                    className="font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.22em] text-[#B8C7DA]"
                  >
                    Full name
                  </Label>
                  <Input
                    id="full-name"
                    type="text"
                    placeholder="Ada Lovelace"
                    autoComplete="name"
                    className="h-12 rounded-xl border-[#EAF2FF]/10 bg-[#EAF2FF]/[0.045] font-['Avenir_Next','Segoe_UI',sans-serif] text-[#EAF2FF] placeholder:text-[#7F91AA] focus-visible:border-[#38BDF8]/70 focus-visible:ring-[#38BDF8]/20"
                    aria-invalid={errors.fullName ? "true" : "false"}
                    aria-describedby={
                      errors.fullName ? "full-name-error" : undefined
                    }
                    {...register("fullName")}
                  />
                  {errors.fullName ? (
                    <p
                      id="full-name-error"
                      className="font-['Avenir_Next','Segoe_UI',sans-serif] text-sm text-red-300"
                    >
                      {errors.fullName.message}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="signup-email"
                    className="font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.22em] text-[#B8C7DA]"
                  >
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="name@company.com"
                    autoComplete="email"
                    className="h-12 rounded-xl border-[#EAF2FF]/10 bg-[#EAF2FF]/[0.045] font-['Avenir_Next','Segoe_UI',sans-serif] text-[#EAF2FF] placeholder:text-[#7F91AA] focus-visible:border-[#38BDF8]/70 focus-visible:ring-[#38BDF8]/20"
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={
                      errors.email ? "signup-email-error" : undefined
                    }
                    {...register("email")}
                  />
                  {errors.email ? (
                    <p
                      id="signup-email-error"
                      className="font-['Avenir_Next','Segoe_UI',sans-serif] text-sm text-red-300"
                    >
                      {errors.email.message}
                    </p>
                  ) : null}
                </div>

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

                <div className="rounded-[1.35rem] border border-[#EAF2FF]/10 bg-[#EAF2FF]/[0.035] p-4 shadow-[inset_0_1px_0_rgba(234,242,255,0.04)] sm:rounded-2xl">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => {
                        setValue("acceptedTerms", checked === true);
                        clearErrors("acceptedTerms");
                      }}
                      aria-invalid={errors.acceptedTerms ? "true" : "false"}
                      aria-describedby={
                        errors.acceptedTerms ? "terms-error" : undefined
                      }
                      className="mt-0.5 border-[#EAF2FF]/20 data-[state=checked]:border-[#38BDF8] data-[state=checked]:bg-[#38BDF8] data-[state=checked]:text-[#050B14]"
                    />
                    <div className="flex flex-1 flex-col gap-3">
                      <Label
                        htmlFor="terms"
                        className="cursor-pointer font-['Avenir_Next','Segoe_UI',sans-serif] text-sm leading-6 text-[#D4E2F4]"
                      >
                        I agree to Lumina's account policies and protected
                        enrollment terms.
                      </Label>
                      <div className="flex flex-wrap gap-2 pl-0.5 font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.18em]">
                        <Link
                          to="/terms"
                          className="rounded-full border border-[#38BDF8]/25 bg-[#38BDF8]/10 px-3 py-1.5 text-[#7DD3FC] transition-colors hover:border-[#22D3EE]/50 hover:bg-[#22D3EE]/15 hover:text-[#CFFAFE]"
                        >
                          Terms
                        </Link>
                        <Link
                          to="/privacy"
                          className="rounded-full border border-[#38BDF8]/25 bg-[#38BDF8]/10 px-3 py-1.5 text-[#7DD3FC] transition-colors hover:border-[#22D3EE]/50 hover:bg-[#22D3EE]/15 hover:text-[#CFFAFE]"
                        >
                          Privacy Policy
                        </Link>
                      </div>
                      {errors.acceptedTerms ? (
                        <p
                          id="terms-error"
                          className="font-['Avenir_Next','Segoe_UI',sans-serif] text-sm text-red-300"
                        >
                          {errors.acceptedTerms.message}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>

                {authError ? (
                  <div
                    role="alert"
                    className="rounded-2xl border border-red-300/25 bg-red-950/25 px-4 py-3 font-['Avenir_Next','Segoe_UI',sans-serif] text-sm leading-6 text-red-200"
                  >
                    {authError}
                  </div>
                ) : null}

                {signupComplete ? (
                  <div
                    role="status"
                    aria-live="polite"
                    className="rounded-2xl border border-[#34D399]/30 bg-[#34D399]/10 px-4 py-3 font-['Avenir_Next','Segoe_UI',sans-serif] text-sm leading-6 text-[#BBF7D0]"
                  >
                    Account created. You can now{" "}
                    <Link
                      to="/login"
                      className="font-medium text-[#7DD3FC] underline underline-offset-4 transition-colors hover:text-[#CFFAFE]"
                    >
                      sign in to Lumina
                    </Link>
                    .
                  </div>
                ) : null}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "mt-1 h-12 rounded-xl bg-[#38BDF8] font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.24em] text-[#050B14] shadow-[0_18px_50px_rgba(56,189,248,0.24)] transition-all duration-300 hover:bg-[#22D3EE] hover:shadow-[0_22px_60px_rgba(34,211,238,0.32)]",
                    !isLoading && "hover:-translate-y-0.5",
                  )}
                >
                  {isLoading ? (
                    <>
                      <Loader2
                        className="animate-spin"
                        data-icon="inline-start"
                      />
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

              <p className="text-center font-['Avenir_Next','Segoe_UI',sans-serif] text-sm text-[#B8C7DA]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-[#38BDF8] underline-offset-4 transition-colors hover:text-[#22D3EE] hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mx-auto flex max-w-[500px] flex-col items-center gap-3 text-center font-['Avenir_Next','Segoe_UI',sans-serif] text-xs leading-relaxed text-[#7F91AA] lg:col-start-2 lg:justify-self-end">
          <div className="flex items-center gap-2 rounded-full border border-[#EAF2FF]/10 bg-[#0D1B2F]/50 px-3 py-2 backdrop-blur-md">
            <span className="flex size-7 items-center justify-center rounded-full bg-[#38BDF8]/10 text-[#B8C7DA]">
              <LockKeyhole className="size-3.5" />
            </span>
            <span>Enrollment is protected by Lumina policy controls.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.18em]">
            <ScrollText className="size-3.5 text-[#B8C7DA]" />
            <Link
              to="/privacy"
              className="text-[#B8C7DA] underline underline-offset-4 transition-colors hover:text-[#38BDF8]"
            >
              Privacy Policy
            </Link>
            <span className="text-[#3F536D]">/</span>
            <Link
              to="/terms"
              className="text-[#B8C7DA] underline underline-offset-4 transition-colors hover:text-[#38BDF8]"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
