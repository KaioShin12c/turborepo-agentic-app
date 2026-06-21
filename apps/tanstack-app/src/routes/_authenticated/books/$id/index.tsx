import { createFileRoute, useRouter } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { BookDetail } from "#/features/books/components/book-detail";
import { BOOKS } from "#/features/books/data";

export const Route = createFileRoute("/_authenticated/books/$id/")({
  component: BookDetailPage,
});

function BookDetailPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const book = BOOKS.find((b) => b.id === id);

  if (!book) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BookOpen size={22} className="text-primary" />
        <h1 className="text-xl font-semibold tracking-tight">Book Details</h1>
      </div>
      <p className="text-sm text-muted-foreground">View detailed information about &quot;{book.title}&quot;</p>
      <BookDetail book={book} onEdit={(b) => router.navigate({ to: "/books/$id/edit", params: { id: b.id } })} />
    </div>
  );
}
