import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { Pencil } from "lucide-react";
import type { Book } from "#/features/books/types";

function statusBadgeClass(status: Book["status"]) {
  const map: Record<Book["status"], string> = {
    Available: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-medium",
    Borrowed: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-medium",
    Reserved: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30 font-medium",
    Lost: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 font-medium",
  };
  return map[status];
}

interface BookDetailProps {
  book: Book;
  onEdit?: (book: Book) => void;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{children}</span>;
}

export function BookDetail({ book, onEdit }: BookDetailProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-6 border-b border-border">
        <div className="size-12 shrink-0 rounded-xl border border-border bg-gradient-to-br from-primary/25 to-muted flex items-center justify-center text-lg font-bold text-primary shadow-sm">
          {book.title.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold tracking-tight">{book.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
          <div className="mt-3">
            <Badge variant="outline" className={statusBadgeClass(book.status)}>
              {book.status}
            </Badge>
          </div>
        </div>
        {onEdit && (
          <Button variant="outline" className="gap-1.5 shrink-0" onClick={() => onEdit(book)}>
            <Pencil size={16} />
            Edit Book
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
        <div className="space-y-1">
          <FieldLabel>ISBN</FieldLabel>
          <p className="font-mono text-sm">{book.isbn}</p>
        </div>

        <div className="space-y-1">
          <FieldLabel>Category</FieldLabel>
          <p className="text-sm font-medium">{book.category}</p>
        </div>

        <div className="space-y-1">
          <FieldLabel>Publisher</FieldLabel>
          <p className="text-sm">{book.publisher}</p>
        </div>

        <div className="space-y-1">
          <FieldLabel>Language</FieldLabel>
          <p className="text-sm">{book.language}</p>
        </div>

        <div className="space-y-1">
          <FieldLabel>Year</FieldLabel>
          <p className="text-sm tabular-nums">{book.year}</p>
        </div>

        <div className="space-y-1">
          <FieldLabel>Pages</FieldLabel>
          <p className="text-sm tabular-nums">{book.pages.toLocaleString()}</p>
        </div>

        <div className="space-y-1">
          <FieldLabel>Status</FieldLabel>
          <Badge variant="outline" className={statusBadgeClass(book.status)}>
            {book.status}
          </Badge>
        </div>

        <div className="space-y-1">
          <FieldLabel>Location</FieldLabel>
          <p className="font-mono text-sm">{book.location}</p>
        </div>

        <div className="space-y-1">
          <FieldLabel>Added Date</FieldLabel>
          <p className="text-sm">{book.addedDate}</p>
        </div>

        <div className="space-y-1">
          <FieldLabel>Times Borrowed</FieldLabel>
          <p className="text-sm font-semibold tabular-nums">{book.timesBorrowed.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
