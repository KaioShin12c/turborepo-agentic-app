import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, BookPlus, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CATEGORIES, LANGUAGES } from "./books-data";

const addBookSchema = z.object({
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

type AddBookFormValues = z.infer<typeof addBookSchema>;

export default function AddBookContent() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddBookFormValues>({
    defaultValues: {
      title: "",
      author: "",
      isbn: "",
      category: "",
      publisher: "",
      year: "",
      pages: "",
      language: "",
      location: "",
      description: "",
    },
  });

  const category = watch("category");
  const language = watch("language");

  const onSubmit = async (_values: AddBookFormValues) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 4000);
  };

  const fieldClass =
    "h-12 rounded-xl border-border/60 bg-background/50 font-['Avenir_Next','Segoe_UI',sans-serif] text-foreground placeholder:text-muted-foreground focus-visible:border-primary/70 focus-visible:ring-primary/20";
  const labelClass = "font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.22em] text-muted-foreground";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <button
        type="button"
        onClick={() => router.navigate({ to: "/books" })}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Books
      </button>

      <Card className="rounded-2xl border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookPlus size={22} className="text-primary" />
            Add New Book
          </CardTitle>
          <CardDescription>Fill in the details below to add a new book to the library collection.</CardDescription>
        </CardHeader>
        <CardContent>
          {submitted && (
            <div
              role="status"
              aria-live="polite"
              className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400"
            >
              <Check size={16} />
              Book added successfully! Redirect to view it in the collection.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="title" className={labelClass}>
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="Enter book title"
                  className={fieldClass}
                  aria-invalid={errors.title ? "true" : "false"}
                  {...register("title")}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="author" className={labelClass}>
                  Author
                </Label>
                <Input
                  id="author"
                  placeholder="Author full name"
                  className={fieldClass}
                  aria-invalid={errors.author ? "true" : "false"}
                  {...register("author")}
                />
                {errors.author && <p className="text-sm text-destructive">{errors.author.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="isbn" className={labelClass}>
                  ISBN
                </Label>
                <Input
                  id="isbn"
                  placeholder="978-0-7475-3274-3"
                  className={fieldClass}
                  aria-invalid={errors.isbn ? "true" : "false"}
                  {...register("isbn")}
                />
                {errors.isbn && <p className="text-sm text-destructive">{errors.isbn.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="category" className={labelClass}>
                  Category
                </Label>
                <Select value={category} onValueChange={(v: string) => setValue("category", v)}>
                  <SelectTrigger
                    id="category"
                    className="h-12 rounded-xl border-border/60 bg-background/50 font-['Avenir_Next','Segoe_UI',sans-serif] text-foreground data-[placeholder]:text-muted-foreground focus:border-primary/70 focus:ring-primary/20"
                    aria-invalid={errors.category ? "true" : "false"}
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="publisher" className={labelClass}>
                  Publisher
                </Label>
                <Input
                  id="publisher"
                  placeholder="Publishing house"
                  className={fieldClass}
                  aria-invalid={errors.publisher ? "true" : "false"}
                  {...register("publisher")}
                />
                {errors.publisher && <p className="text-sm text-destructive">{errors.publisher.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="year" className={labelClass}>
                  Year
                </Label>
                <Input
                  id="year"
                  placeholder="2024"
                  className={fieldClass}
                  aria-invalid={errors.year ? "true" : "false"}
                  {...register("year")}
                />
                {errors.year && <p className="text-sm text-destructive">{errors.year.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="pages" className={labelClass}>
                  Pages
                </Label>
                <Input
                  id="pages"
                  placeholder="350"
                  className={fieldClass}
                  aria-invalid={errors.pages ? "true" : "false"}
                  {...register("pages")}
                />
                {errors.pages && <p className="text-sm text-destructive">{errors.pages.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="language" className={labelClass}>
                  Language
                </Label>
                <Select value={language} onValueChange={(v: string) => setValue("language", v)}>
                  <SelectTrigger
                    id="language"
                    className="h-12 rounded-xl border-border/60 bg-background/50 font-['Avenir_Next','Segoe_UI',sans-serif] text-foreground data-[placeholder]:text-muted-foreground focus:border-primary/70 focus:ring-primary/20"
                    aria-invalid={errors.language ? "true" : "false"}
                  >
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.language && <p className="text-sm text-destructive">{errors.language.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="location" className={labelClass}>
                  Shelf Location
                </Label>
                <Input
                  id="location"
                  placeholder="A-03-12"
                  className={fieldClass}
                  aria-invalid={errors.location ? "true" : "false"}
                  {...register("location")}
                />
                {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="description" className={labelClass}>
                  Description <span className="normal-case tracking-normal text-[10px]">(optional)</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the book..."
                  rows={3}
                  className="min-h-[80px] rounded-xl border-border/60 bg-background/50 font-['Avenir_Next','Segoe_UI',sans-serif] text-foreground placeholder:text-muted-foreground focus-visible:border-primary/70 focus-visible:ring-primary/20"
                  {...register("description")}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.navigate({ to: "/books" })}
                className="h-11 rounded-xl px-6"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="h-11 rounded-xl px-6 gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <BookPlus size={16} />
                    Add Book
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
