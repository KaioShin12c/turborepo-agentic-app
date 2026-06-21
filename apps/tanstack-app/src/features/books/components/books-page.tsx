import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";
import { useRouter } from "@tanstack/react-router";
import { BookPlus, ChevronDown, ChevronsLeft, ChevronsRight, RotateCcw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { BOOKS, type Book, CATEGORIES, ITEMS_PER_PAGE, LANGUAGES, STATUSES } from "./books-data";

const statusBadge = (status: Book["status"]) => {
  const map: Record<Book["status"], string> = {
    Available: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    Borrowed: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
    Reserved: "bg-sky-500/10 text-sky-500 border border-sky-500/20",
    Lost: "bg-rose-500/10 text-rose-500 border border-rose-500/20",
  };
  return map[status];
};

export default function BooksContent() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [language, setLanguage] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return BOOKS.filter((b) => {
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
  }, [search, category, status, language]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <CardTitle className="text-base font-semibold">
          Books Collection
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            ({filtered.length} record{filtered.length !== 1 ? "s" : ""})
          </span>
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 rounded-full border border-border bg-muted/60 text-xs text-muted-foreground"
          >
            Export <ChevronDown size={12} />
          </Button>
          <Button
            size="sm"
            className="gap-1.5 rounded-full text-xs"
            onClick={() => router.navigate({ to: "/books/add" })}
          >
            <BookPlus size={14} />
            Add Book
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px] max-w-[340px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search title or author..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 h-9 rounded-lg border-border bg-muted/40 text-sm"
            />
          </div>

          <Select
            value={category}
            onValueChange={(v: string) => {
              setCategory(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-[150px] rounded-lg border-border bg-muted/40 text-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={status}
            onValueChange={(v: string) => {
              setStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-[140px] rounded-lg border-border bg-muted/40 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={language}
            onValueChange={(v: string) => {
              setLanguage(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-[130px] rounded-lg border-border bg-muted/40 text-sm">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {LANGUAGES.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(search || category !== "all" || status !== "all" || language !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch("");
                setCategory("all");
                setStatus("all");
                setLanguage("all");
                setPage(1);
              }}
              className="h-9 gap-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw size={13} />
              Reset
            </Button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground">
                <th className="py-2 text-left font-medium">Book ID</th>
                <th className="py-2 text-left font-medium">Title & Author</th>
                <th className="py-2 text-left font-medium hidden lg:table-cell">ISBN</th>
                <th className="py-2 text-left font-medium hidden md:table-cell">Category</th>
                <th className="py-2 text-left font-medium">Status</th>
                <th className="py-2 text-left font-medium hidden xl:table-cell">Location</th>
                <th className="py-2 text-left font-medium hidden sm:table-cell">Language</th>
                <th className="py-2 text-right font-medium">Borrowed</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((book) => (
                <tr key={book.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="py-3 text-xs font-mono text-muted-foreground">{book.id}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-8 shrink-0 rounded-md border border-border bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center text-[10px] font-bold text-primary">
                        {book.title.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold truncate max-w-[180px]">{book.title}</div>
                        <div className="text-xs text-muted-foreground">{book.author}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-xs font-mono text-muted-foreground hidden lg:table-cell">{book.isbn}</td>
                  <td className="py-3 hidden md:table-cell">
                    <span className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs font-medium">
                      {book.category}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge(book.status)}`}>
                      {book.status}
                    </span>
                  </td>
                  <td className="py-3 text-xs font-mono text-muted-foreground hidden xl:table-cell">{book.location}</td>
                  <td className="py-3 hidden sm:table-cell text-xs">{book.language}</td>
                  <td className="py-3 text-right text-sm font-semibold">{book.timesBorrowed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
          <p className="text-xs text-muted-foreground">
            Page {safePage} of {totalPages} ({filtered.length} records)
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8 rounded-lg"
              disabled={safePage <= 1}
              onClick={() => setPage(1)}
            >
              <ChevronsLeft size={14} />
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const start = Math.max(1, Math.min(safePage - 2, totalPages - 4));
              const p = start + i;
              if (p > totalPages) return null;
              return (
                <Button
                  key={p}
                  variant={p === safePage ? "default" : "outline"}
                  size="icon"
                  className="size-8 rounded-lg text-xs font-medium"
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="icon"
              className="size-8 rounded-lg"
              disabled={safePage >= totalPages}
              onClick={() => setPage(totalPages)}
            >
              <ChevronsRight size={14} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
