import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Pencil } from "lucide-react";
import { EditBookForm } from "#/features/books/components/edit-book-form";
import { BOOKS } from "#/features/books/data";

export const Route = createFileRoute("/_authenticated/books/$id/edit")({
  component: EditBookPage,
});

function EditBookPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const book = BOOKS.find((b) => b.id === id);

  // Handle book not found state
  if (!book) {
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
            <Pencil size={22} className="text-primary" />
            <h1 className="text-xl font-semibold tracking-tight">Book Not Found</h1>
          </div>
          <p className="text-sm text-muted-foreground">The book you&apos;re trying to edit does not exist.</p>
        </div>
      </div>
    );
  }

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
          <Pencil size={22} className="text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">Edit Book</h1>
        </div>
        <p className="text-sm text-muted-foreground">Edit the details of &quot;{book.title}&quot;</p>
        <EditBookForm
          book={book}
          onCancel={() => router.navigate({ to: "/books" })}
          onSuccess={() => router.navigate({ to: "/books" })}
        />
      </div>
    </div>
  );
}
