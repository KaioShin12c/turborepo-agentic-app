# Task 01: Create BookDetail Component

## Status

complete

## Wave

1

## Description

Create a reusable `BookDetail` read-only component that displays all book fields in a visual card layout. This is a display-only component (no forms, no inputs) that renders a book's complete information with proper labels, badges, and iconography. It also includes an optional "Edit" button so users can jump directly to the edit page from the detail view.

## Dependencies

**Depends on:** None (Wave 1 — independent)
**Blocks:** task-03-detail-page-route.md

**Context from dependencies:** This is a Wave 1 task with no dependencies. All imports it needs already exist in the codebase. The `Book` interface, badge styles, and UI patterns are all established.

## Files to Create

- `apps/tanstack-app/src/features/books/components/book-detail.tsx` — The read-only book detail display component

## Files to Modify

None.

## Technical Details

### Component Interface

```typescript
interface BookDetailProps {
  book: Book;               // The book data to display
  onEdit?: (book: Book) => void;  // Optional: called when user clicks "Edit Book" button
}
```

### Field Display Layout

Display all 15 fields from the `Book` interface in a two-column card grid:

| Left Column | Right Column |
|-------------|-------------|
| Title (full width) | |
| Author (full width) | |
| ISBN | Category |
| Publisher | Language |
| Year | Pages |
| Status (badge) | Location |
| Added Date | Times Borrowed |

### Visual Design

1. **Header area**: Book name initial in a colored circle (matching the `TitleCell` pattern from BooksTable), book title as `h1`, author as subtitle.

2. **Status badge**: Uses the same `statusBadge` color mapping found in `BooksTable`:
```typescript
const statusBadgeColors: Record<Book["status"], string> = {
  Available: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-medium",
  Borrowed: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-medium",
  Reserved: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30 font-medium",
  Lost: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 font-medium",
};
```

3. **Detail card**: A bordered card (`rounded-xl border border-border bg-card`) with two sections:
   - **Header**: Book name initial circle + title + author + status badge
   - **Grid**: `grid grid-cols-1 sm:grid-cols-2 gap-4 p-6` for field details

4. **Edit button** (if `onEdit` provided): A `Button` with `variant="outline"` containing `Pencil` icon (size 16) and text "Edit Book". Positioned in the header area.

5. **Field rows**: Each field is a label-value pair:
   - Label: `text-xs font-medium text-muted-foreground uppercase tracking-wider`
   - Value: appropriate styling depending on content type (mono for ISBN/codes, regular for text, badge for status)

### Implementation Steps

1. Create `apps/tanstack-app/src/features/books/components/book-detail.tsx`
2. Export a single named component: `BookDetail`
3. Include a local `statusBadgeClass` helper function that returns the color classes
4. Build the header with the letter-avatar circle (matching `TitleCell`):
```tsx
<div className="size-12 shrink-0 rounded-xl border border-border bg-gradient-to-br from-primary/25 to-muted flex items-center justify-center text-lg font-bold text-primary shadow-sm">
  {book.title.charAt(0)}
</div>
```
5. Render the status as a `Badge` component with `variant="outline"` and the appropriate color class
6. Format `addedDate` as-is (it's already a string like "2024-03-15")
7. Format `timesBorrowed` with `.toLocaleString()`
8. Render the "Edit Book" button only when `onEdit` prop is provided
9. Display ISBN in monospace font (`font-mono text-sm`)
10. No loading state needed — the component receives data synchronously via props

### Imports

```typescript
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { Pencil } from "lucide-react";
import type { Book } from "#/features/books/types";
```

### Structure Reference

Follow the general card pattern seen in the codebase. Key classes:
- Card wrapper: `rounded-xl border border-border bg-card shadow-sm`
- Inner padding: `p-6`
- Grid layout: `grid grid-cols-1 sm:grid-cols-2 gap-4`

## Acceptance Criteria

- [ ] `BookDetail` component exports from `book-detail.tsx`
- [ ] All 15 book fields are displayed with labels
- [ ] Title is displayed prominently with letter-avatar circle
- [ ] Status is shown as a color-coded badge matching the table's badge colors
- [ ] ISBN is displayed in monospace font
- [ ] Times borrowed is formatted with thousand separators
- [ ] Added date is displayed as-is
- [ ] "Edit Book" button appears when `onEdit` prop is provided
- [ ] "Edit Book" button does not appear when `onEdit` is not provided
- [ ] Layout uses a card with proper border, shadow, and padding
- [ ] Field labels use uppercase muted styling matching the codebase pattern
- [ ] Component follows existing code style: no comments, one component per file, `#/` path alias

## Notes

- The `Book` interface does not have a `description` field — do not try to render one.
- You may copy the `statusBadge` helper from `BooksTable` directly into this file (the function is local/private there, not exported).
- This component is only used by the detail page route (task-03). It is not imported by any other task.
- The component does NOT include a back button — that belongs to the route page (task-03).
