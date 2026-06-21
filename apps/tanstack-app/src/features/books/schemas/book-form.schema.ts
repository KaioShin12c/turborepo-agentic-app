import { z } from "zod";

export const addBookSchema = z.object({
  title: z.string().trim().min(1, "Book title is required."),
  author: z.string().trim().min(1, "Author name is required."),
  isbn: z
    .string()
    .trim()
    .min(1, "ISBN is required.")
    .regex(/^\d{3}-\d-\d{2,6}-\d{4,6}-\d$/, "Enter a valid ISBN (e.g. 978-0-7475-3274-3)."),
  category: z.string().min(1, "Select a category."),
  publisher: z.string().trim().min(1, "Publisher is required."),
  year: z
    .string()
    .trim()
    .min(1, "Publication year is required.")
    .regex(/^\d{4}$/, "Enter a valid year."),
  pages: z.string().trim().min(1, "Page count is required.").regex(/^\d+$/, "Enter a valid number."),
  language: z.string().min(1, "Select a language."),
  location: z.string().trim().min(1, "Shelf location is required."),
  description: z.string().trim().optional(),
});

export type AddBookFormValues = z.infer<typeof addBookSchema>;
