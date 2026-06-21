import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { ArrowLeft, BookOpen } from "lucide-react";
import { BOOKS } from "#/features/books/data";

export const Route = createFileRoute("/_authenticated/books/$id")({
  component: BookLayout,
});

function BookLayout() {
  const { id } = Route.useParams();
  const router = useRouter();
  const book = BOOKS.find((b) => b.id === id);

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
            <BookOpen size={22} className="text-primary" />
            <h1 className="text-xl font-semibold tracking-tight">Book Not Found</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            The book you&apos;re looking for does not exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
