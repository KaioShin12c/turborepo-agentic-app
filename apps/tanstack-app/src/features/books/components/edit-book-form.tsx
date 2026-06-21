import { Alert, AlertDescription } from "@repo/ui/components/ui/alert";
import { Button } from "@repo/ui/components/ui/button";
import { Check, Loader2, Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CATEGORIES, LANGUAGES } from "#/features/books/constants";
import type { AddBookFormValues } from "#/features/books/schemas/book-form.schema";
import type { Book } from "#/features/books/types";
import { FormInput } from "#/shared/components/form-fields/form-input";
import { FormSelect } from "#/shared/components/form-fields/form-select";
import { FormTextarea } from "#/shared/components/form-fields/form-textarea";

interface EditBookFormProps {
  book: Book;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function EditBookForm({ book, onCancel, onSuccess }: EditBookFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddBookFormValues>({
    defaultValues: {
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      publisher: book.publisher,
      year: String(book.year),
      pages: String(book.pages),
      language: book.language,
      location: book.location,
      description: "",
    },
  });

  const category = watch("category");
  const language = watch("language");

  const onSubmit = async (_values: AddBookFormValues) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    setSuccess(true);
    onSuccess?.();
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <>
      {success && (
        <Alert
          variant="default"
          className="mb-6 border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        >
          <Check />
          <AlertDescription>Book updated successfully!</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormInput
              id="title"
              label="Title"
              placeholder="Enter book title"
              error={errors.title?.message}
              {...register("title")}
            />
          </div>

          <div className="sm:col-span-2">
            <FormInput
              id="author"
              label="Author"
              placeholder="Author full name"
              error={errors.author?.message}
              {...register("author")}
            />
          </div>

          <FormInput
            id="isbn"
            label="ISBN"
            placeholder="978-0-7475-3274-3"
            error={errors.isbn?.message}
            {...register("isbn")}
          />

          <FormInput
            id="publisher"
            label="Publisher"
            placeholder="Publishing house"
            error={errors.publisher?.message}
            {...register("publisher")}
          />

          <FormSelect
            id="category"
            label="Category"
            value={category}
            onValueChange={(v) => setValue("category", v)}
            error={errors.category?.message}
            placeholder="Select category"
            options={CATEGORIES}
          />

          <FormSelect
            id="language"
            label="Language"
            value={language}
            onValueChange={(v) => setValue("language", v)}
            error={errors.language?.message}
            placeholder="Select language"
            options={LANGUAGES}
          />

          <FormInput id="year" label="Year" placeholder="2024" error={errors.year?.message} {...register("year")} />

          <FormInput id="pages" label="Pages" placeholder="350" error={errors.pages?.message} {...register("pages")} />

          <div className="sm:col-span-2">
            <FormInput
              id="location"
              label="Shelf Location"
              placeholder="A-03-12"
              error={errors.location?.message}
              {...register("location")}
            />
          </div>

          <div className="sm:col-span-2">
            <FormTextarea
              id="description"
              label="Description"
              optional
              placeholder="Brief description of the book..."
              rows={3}
              {...register("description")}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} className="h-11 rounded-xl px-6">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="h-11 rounded-xl px-6 gap-2">
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Pencil size={16} />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </>
  );
}
