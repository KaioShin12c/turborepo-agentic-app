import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft, BookPlus } from "lucide-react";
import { AddBookForm } from "#/features/books/components/add-book-form";

export const Route = createFileRoute("/_authenticated/books/add")({
  component: AddBookPage,
});

function AddBookPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => router.navigate({ to: "/books" })}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Books
      </button>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookPlus size={22} className="text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">Add New Book</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Fill in the details below to add a new book to the library collection.
        </p>
        <AddBookForm onCancel={() => router.navigate({ to: "/books" })} />
      </div>
    </div>
  );
}
