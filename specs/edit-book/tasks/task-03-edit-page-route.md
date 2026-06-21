# Task 03: Create Edit Page Route

## Status

complete

## Wave

2

## Description

Create the edit book page route at `/books/$id/edit`. This page receives a book ID from the URL parameter, looks up the book in the mock `BOOKS` array, and renders the `EditBookForm` pre-populated with the book's data. It follows the same page layout pattern as the existing Add Book page (`add.tsx`). If the book ID is not found, it displays a "Book not found" state.

## Dependencies

**Depends on:** task-01-edit-book-form.md
**Blocks:** None

**Context from dependencies:** Task 01 creates the `EditBookForm` component at `#/features/books/components/edit-book-form`. This page imports and renders that component. The form accepts `book`, `onCancel`, and `onSuccess` props.

## Files to Create

- `apps/tanstack-app/src/routes/_authenticated/books/$id.edit.tsx` — The edit page route

## Files to Modify

None.

## Technical Details

### Implementation Steps

1. Create the file: `apps/tanstack-app/src/routes/_authenticated/books/$id.edit.tsx`

2. The route path uses TanStack Router's file-based convention: `$id.edit.tsx` maps to `/_authenticated/books/$id/edit`. The `createFileRoute` call:

```typescript
export const Route = createFileRoute("/_authenticated/books/$id/edit")({
  component: EditBookPage,
});
```

3. Inside the component, extract the `id` param and look up the book:

```typescript
function EditBookPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const book = BOOKS.find((b) => b.id === id);
  // ...
}
```

Where `BOOKS` is imported from `#/features/books/data`.

4. **Book not found state**: If `book` is `undefined`, show:
   - Back button (same style as add page)
   - Title: "Book Not Found" with `Pencil` icon
   - Description: "The book you're trying to edit does not exist."
   - No form rendered

5. **Normal state**: When book is found, render the page with:
   - Back button: Navigates to `/books`
   - Title: "Edit Book" with `Pencil` icon (size 22, `text-primary`)
   - Subtitle/description: `"Edit the details of \"{book.title}\""` (use the book title in the description)
   - `EditBookForm` component with:
     - `book={book}` — the found book data
     - `onCancel={() => router.navigate({ to: "/books" })}`
     - `onSuccess={() => router.navigate({ to: "/books" })}`

6. Follow the exact same page layout pattern as `add.tsx`:
   - Outer `div` with `className="space-y-6"`
   - Back button with `ArrowLeft` icon
   - Inner `div` with `className="space-y-4"` containing title + description + form

### Imports Needed

```typescript
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Pencil } from "lucide-react";
import { EditBookForm } from "#/features/books/components/edit-book-form";
import { BOOKS } from "#/features/books/data";
```

### Route Registration

No additional route registration needed — TanStack Router's file-based routing picks up `$id.edit.tsx` automatically. The `_authenticated` layout (auth guard + sidebar + topbar) is inherited from the directory structure.

## Acceptance Criteria

- [ ] Navigating to `/books/$id/edit` (e.g., `/books/BOK-1001/edit`) renders the edit page
- [ ] The page title is "Edit Book" with `Pencil` icon
- [ ] The subtitle shows the book title: `Edit the details of "The Great Gatsby"`
- [ ] All form fields are pre-populated with the correct book data
- [ ] The back button navigates to `/books`
- [ ] Cancel button in the form navigates to `/books`
- [ ] On successful submit, navigates to `/books`
- [ ] Navigating to a non-existent book ID (e.g., `/books/NONEXIST/edit`) shows "Book Not Found" with back button
- [ ] The page is wrapped in the authenticated layout (sidebar + topbar visible)
- [ ] No console errors or TypeScript errors
- [ ] Page matches the visual layout of the Add Book page (`add.tsx`)

## Notes

- The `Book` type's `id` field is a string like `"BOK-1001"`. The URL parameter `$id` will be a string, so `book.id === id` comparison works directly.
- This task depends on task-01 for the `EditBookForm` component. Ensure task-01 is complete before implementing.
- The page is inside `_authenticated/` so auth is already enforced by the parent `route.tsx`'s `beforeLoad` hook.
