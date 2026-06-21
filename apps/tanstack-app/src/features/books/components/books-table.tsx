import { AlertDialog } from "@repo/ui/components/ui/alert-dialog";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/ui/table";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Book } from "#/features/books/types";

function statusBadge(status: Book["status"]) {
  const map: Record<Book["status"], string> = {
    Available: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-medium",
    Borrowed: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-medium",
    Reserved: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30 font-medium",
    Lost: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 font-medium",
  };
  return map[status];
}

interface BooksTableProps {
  books: Book[];
  onView?: (book: Book) => void;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
}

function TitleCell({ book }: { book: Book }) {
  return (
    <div className="flex items-center gap-3">
      <div className="size-9 shrink-0 rounded-lg border border-border bg-gradient-to-br from-primary/25 to-muted flex items-center justify-center text-xs font-bold text-primary shadow-sm">
        {book.title.charAt(0)}
      </div>
      <div className="min-w-0">
        <div className="font-semibold text-sm truncate max-w-[200px]">{book.title}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{book.author}</div>
      </div>
    </div>
  );
}

export function BooksTable({ books, onView, onEdit, onDelete }: BooksTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<Book | null>(null);

  return (
    <>
      <div className="rounded-lg border border-border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40 [&_th]:h-11 [&_th]:px-4 [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wider [&_th]:text-muted-foreground">
              <TableHead className="w-[100px] hidden sm:table-cell">Book ID</TableHead>
              <TableHead>Title & Author</TableHead>
              <TableHead className="hidden lg:table-cell">ISBN</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden xl:table-cell">Location</TableHead>
              <TableHead className="hidden sm:table-cell">Language</TableHead>
              <TableHead className="text-right">Borrowed</TableHead>
              <TableHead className="w-[60px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <p className="text-sm font-medium">No books found</p>
                    <p className="text-xs">Add a new book to get started.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              books.map((book, i) => (
                <TableRow key={book.id} className={i % 2 === 0 ? "bg-muted/10" : ""}>
                  <TableCell className="px-4 text-xs font-mono text-muted-foreground hidden sm:table-cell">
                    {book.id}
                  </TableCell>
                  <TableCell className="px-4">
                    <TitleCell book={book} />
                  </TableCell>
                  <TableCell className="px-4 text-xs font-mono text-muted-foreground hidden lg:table-cell">
                    {book.isbn}
                  </TableCell>
                  <TableCell className="px-4 hidden md:table-cell">
                    <Badge variant="secondary" className="font-medium">
                      {book.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4">
                    <Badge variant="outline" className={statusBadge(book.status)}>
                      {book.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 text-xs font-medium text-muted-foreground hidden xl:table-cell">
                    {book.location}
                  </TableCell>
                  <TableCell className="px-4 hidden sm:table-cell text-xs font-medium text-muted-foreground">
                    {book.language}
                  </TableCell>
                  <TableCell className="px-4 text-right text-sm font-semibold tabular-nums">
                    {book.timesBorrowed.toLocaleString()}
                  </TableCell>
                  <TableCell className="px-2 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" sideOffset={4} className="w-40">
                        <DropdownMenuItem className="cursor-pointer" onClick={() => onView?.(book)}>
                          <Eye className="size-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit?.(book)}>
                          <Pencil className="size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          className="cursor-pointer"
                          onClick={() => setDeleteTarget(book)}
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete Book"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={() => {
          if (deleteTarget) {
            onDelete?.(deleteTarget);
            setDeleteTarget(null);
          }
        }}
      />
    </>
  );
}
