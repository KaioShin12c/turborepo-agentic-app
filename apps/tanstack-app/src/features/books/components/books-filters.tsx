import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";
import { RotateCcw, Search } from "lucide-react";
import { CATEGORIES, LANGUAGES, STATUSES } from "#/features/books/constants";

interface BooksFiltersProps {
  search: string;
  category: string;
  status: string;
  language: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onReset: () => void;
}

export function BooksFilters({
  search,
  category,
  status,
  language,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onLanguageChange,
  onReset,
}: BooksFiltersProps) {
  const hasFilters = search || category !== "all" || status !== "all" || language !== "all";

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <div className="relative flex-1 min-w-[200px] max-w-[340px]">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search title or author..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 rounded-lg border-border bg-muted/40 text-sm"
        />
      </div>

      <Select value={category} onValueChange={onCategoryChange}>
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

      <Select value={status} onValueChange={onStatusChange}>
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

      <Select value={language} onValueChange={onLanguageChange}>
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

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-9 gap-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw size={13} />
          Reset
        </Button>
      )}
    </div>
  );
}
