import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@repo/ui/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useMemo } from "react";

const PER_PAGE_OPTIONS = [8, 12, 16, 20] as const;

interface BooksPaginationProps {
  page: number;
  totalPages: number;
  totalRecords: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export function BooksPagination({
  page,
  totalPages,
  totalRecords,
  perPage,
  onPageChange,
  onPerPageChange,
}: BooksPaginationProps) {
  const safePage = Math.min(page, totalPages);

  const pages = useMemo(() => {
    const start = Math.max(1, Math.min(safePage - 2, totalPages - 4));
    return Array.from({ length: Math.min(totalPages, 5) }, (_, i) => start + i).filter((p) => p <= totalPages);
  }, [safePage, totalPages]);

  const linkProps = (onClick: () => void) => ({
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      onClick();
    },
  });

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <p className="text-xs text-muted-foreground">
          Page {safePage} of {totalPages} ({totalRecords} records)
        </p>
        <div className="flex items-center gap-1.5">
          <label htmlFor="per-page" className="text-xs text-muted-foreground whitespace-nowrap">
            Per page
          </label>
          <Select value={String(perPage)} onValueChange={(v) => onPerPageChange(Number(v))}>
            <SelectTrigger id="per-page" size="sm" className="h-8 w-[70px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PER_PAGE_OPTIONS.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationLink
              aria-label="Go to first page"
              size="icon"
              className={safePage <= 1 ? "pointer-events-none opacity-50" : ""}
              {...linkProps(() => onPageChange(1))}
            >
              <ChevronsLeft />
            </PaginationLink>
          </PaginationItem>
          {pages.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink isActive={p === safePage} size="icon" {...linkProps(() => onPageChange(p))}>
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationLink
              aria-label="Go to last page"
              size="icon"
              className={safePage >= totalPages ? "pointer-events-none opacity-50" : ""}
              {...linkProps(() => onPageChange(totalPages))}
            >
              <ChevronsRight />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
