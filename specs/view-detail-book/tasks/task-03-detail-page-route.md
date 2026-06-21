# Task 03: Create Detail Page Route

## Status

complete

## Wave

2

## Description

Create the book detail page route at `/books/$id`. This is a file-based route that:
1. Looks up the book from the mock `BOOKS` data array using the route parameter
2. Renders the `BookDetail` component (created in task-01) with the book data
3. Handles the "book not found" case with an appropriate message
4. Provides back navigation to the book list
5. Wires the "Edit" button on the detail view to navigate to `/books/$id/edit`

## Dependencies

**Depends on:** task-01-book-detail-component.md (provides the `BookDetail` component)
**Blocks:** None (this is the final task)

**Context from dependencies:** Task 01 creates `apps/tanstack-app/src/features/books/components/book-detail.tsx` which exports a `BookDetail` component with this interface:

```typescript
interface BookDetailProps {
  book: Book;
  onEdit?: (book: Book) => void;
}
```

## Files to Create

- `apps/tanstack-app/src/routes/_authenticated/books/$id.tsx` — The detail page route

## Files to Modify

None.

## Technical Details

### Route Setup

The route file must follow TanStack Router's file-based routing convention. Create a directory-based route file (NOT flat naming):

**File path**: `apps/tanstack-app/src/routes/_authenticated/books/$id.tsx`

### Route Definition

```typescript
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft, BookOpen } from "lucide-react";
import { BookDetail } from "#/features/books/components/book-detail";
import { BOOKS } from "#/features/books/data";

export const Route = createFileRoute("/_authenticated/books/$id")({
  component: BookDetailPage,
});
```

The full route path is `/_authenticated/books/$id` (including the pathless `_authenticated` layout prefix).

### Component Structure

The `BookDetailPage` component should follow the exact pattern of the existing edit page (`$id.edit.tsx`) for consistency:

1. Extract the `id` param: `const { id } = Route.useParams();`
2. Look up the book: `const book = BOOKS.find((b) => b.id === id);`
3. Get the router: `const router = useRouter();`

**Not-found state** (when `book` is undefined):
```tsx
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
        <p className="text-sm text-muted-foreground">The book you&apos;re looking for does not exist or has been removed.</p>
      </div>
    </div>
  );
}
```

**Normal render** (when book is found):
```tsx
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
        <h1 className="text-xl font-semibold tracking-tight">Book Details</h1>
      </div>
      <p className="text-sm text-muted-foreground">View detailed information about &quot;{book.title}&quot;</p>
      <BookDetail
        book={book}
        onEdit={(b) => router.navigate({ to: "/books/$id/edit", params: { id: b.id } })}
      />
    </div>
  </div>
);
```

### Key Details

- Use `ArrowLeft` icon (size 16) for the back button — same as the edit page
- Use `BookOpen` icon (size 22, `text-primary`) for the page header — this is the icon already used in the sidebar nav for Books
- The subtitle text should include the book title in quotes, matching the edit page pattern
- Pass `onEdit` to `BookDetail` so the "Edit Book" button navigates to the edit route
- The back button uses `router.navigate({ to: "/books" })` — same pattern as the edit page
- Use `&apos;` for apostrophes in JSX (matching the edit page style)

### Layout Structure

Follow the same outer/inner spacing pattern used by all pages:
- Outer: `space-y-6`
- Content area: `space-y-4`
- Back button: above the content area
- Header: icon + h1 + subtitle p

## Acceptance Criteria

- [ ] Route file exists at `apps/tanstack-app/src/routes/_authenticated/books/$id.tsx`
- [ ] Route is defined with path `/_authenticated/books/$id`
- [ ] `BookDetailPage` component extracts `id` from params and looks up the book
- [ ] Not-found state shows "Book Not Found" with `BookOpen` icon and back button
- [ ] Normal state shows "Book Details" header with `BookOpen` icon
- [ ] Subtitle includes the book title in quotes
- [ ] Back button navigates to `/books`
- [ ] `BookDetail` component is rendered with the found book
- [ ] `onEdit` callback navigates to `/books/$id/edit`
- [ ] All imports use the `#/` path alias
- [ ] Layout spacing matches existing page patterns (space-y-6 / space-y-4)
- [ ] Component follows existing code style: no comments, `#/` path alias

## Notes

- The `BooksTable` parent layout (`_authenticated/route.tsx`) provides the sidebar and top bar — this route inherits that layout automatically.
- The route will be type-safe: TanStack Router registers routes from the file tree.
- This is a completely new file — no existing code to preserve.
- After this task is complete and task-02 is also complete, clicking "View Details" in the table will navigate to a fully functional detail page.
