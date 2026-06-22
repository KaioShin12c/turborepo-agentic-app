import { z } from "zod";

export const signupSchema = z
  .object({
    fullName: z.string().trim().min(1, "Enter your full name."),
    email: z.string().email("Enter a valid email address."),
    password: z.string().min(8, "Use at least 8 characters."),
    confirmPassword: z.string().min(1, "Confirm your password."),
    acceptedTerms: z.boolean().refine((accepted) => accepted, "You must accept the terms to create an account."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
