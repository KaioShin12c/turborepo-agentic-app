import { Button } from "@repo/ui/components/ui/button";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { BookPlus, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { BooksFilters } from "#/features/books/components/books-filters";
import { BooksPagination } from "#/features/books/components/books-pagination";
import { BooksTable } from "#/features/books/components/books-table";
import { BOOKS } from "#/features/books/data";
import type { Book } from "#/features/books/types";

export const Route = createFileRoute("/_authenticated/books/")({
  component: BooksPage,
});

function BooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>(BOOKS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [language, setLanguage] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);

  const filtered = useMemo(() => {
    return books.filter((b) => {
      if (
        search &&
        !b.title.toLowerCase().includes(search.toLowerCase()) &&
        !b.author.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (category !== "all" && b.category !== category) return false;
      if (status !== "all" && b.status !== status) return false;
      if (language !== "all" && b.language !== language) return false;
      return true;
    });
  }, [books, search, category, status, language]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setStatus("all");
    setLanguage("all");
    setPage(1);
  };

  const handleFilterChange = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  const handlePerPageChange = (n: number) => {
    setPerPage(n);
    setPage(1);
  };

  const handleDelete = (book: Book) => {
    setBooks((prev) => prev.filter((b) => b.id !== book.id));
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Books Collection</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="gap-1  border border-border bg-muted/60 text-sm text-muted-foreground">
            Export <ChevronDown size={14} />
          </Button>
          <Button className="gap-1.5 text-sm" onClick={() => router.navigate({ to: "/books/add" })}>
            <BookPlus size={14} />
            Add Book
          </Button>
        </div>
      </div>

      <BooksFilters
        search={search}
        category={category}
        status={status}
        language={language}
        onSearchChange={handleFilterChange(setSearch)}
        onCategoryChange={handleFilterChange(setCategory)}
        onStatusChange={handleFilterChange(setStatus)}
        onLanguageChange={handleFilterChange(setLanguage)}
        onReset={resetFilters}
      />

      <BooksTable books={paged} onDelete={handleDelete} />

      <BooksPagination
        page={page}
        totalPages={totalPages}
        totalRecords={filtered.length}
        perPage={perPage}
        onPageChange={setPage}
        onPerPageChange={handlePerPageChange}
      />
    </div>
  );
}
