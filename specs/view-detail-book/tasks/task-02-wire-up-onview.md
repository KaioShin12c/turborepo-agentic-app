# Task 02: Wire Up onView in BooksPage

## Status

complete

## Wave

1

## Description

Wire up the `onView` callback in `BooksPage` (`books/index.tsx`) so that clicking "View Details" on a book row navigates to the detail page at `/books/$id`. The `BooksTable` component already accepts an `onView` prop and renders a "View Details" dropdown item with an `Eye` icon — it's just never connected in the parent page.

## Dependencies

**Depends on:** None (Wave 1 — independent)
**Blocks:** None (task-03 is only blocked by task-01)

**Context from dependencies:** This is a Wave 1 task with no dependencies. The `BooksTable` component already defines `onView?: (book: Book) => void` in its props interface. The router is already imported and used in `BooksPage` for `handleEdit` and the "Add Book" button.

## Files to Modify

- `apps/tanstack-app/src/routes/_authenticated/books/index.tsx` — Add the `onView` handler and pass it to `BooksTable`

## Files to Create

None.

## Technical Details

### Current State

In `books/index.tsx`, line 98:
```tsx
<BooksTable books={paged} onDelete={handleDelete} onEdit={handleEdit} />
```

The `onView` prop exists on `BooksTable` but is not passed here. The `handleEdit` callback already demonstrates the navigation pattern:

```tsx
const handleEdit = (book: Book) => {
  router.navigate({ to: "/books/$id/edit", params: { id: book.id } });
};
```

### Implementation Steps

1. Open `apps/tanstack-app/src/routes/_authenticated/books/index.tsx`
2. Add a `handleView` callback following the same pattern as `handleEdit`:

```typescript
const handleView = (book: Book) => {
  router.navigate({ to: "/books/$id", params: { id: book.id } });
};
```

3. Pass `onView={handleView}` to the `BooksTable` component. Change line 98 from:
```tsx
<BooksTable books={paged} onDelete={handleDelete} onEdit={handleEdit} />
```
To:
```tsx
<BooksTable books={paged} onDelete={handleDelete} onEdit={handleEdit} onView={handleView} />
```

### Route Path

The target route is `/books/$id` (without `/edit`). This corresponds to the route file `routes/_authenticated/books/$id.tsx` which will be created in task-03. Until that route exists, clicking "View Details" will result in a 404 — this is expected and will be resolved after task-03 is implemented.

## Acceptance Criteria

- [ ] `handleView` callback is defined in `BooksPage` component
- [ ] `handleView` navigates to `/books/$id` with the book's ID as a route param
- [ ] `onView={handleView}` is passed to the `BooksTable` component
- [ ] The function follows the same code style as `handleEdit` (same parameter type, same arrow function pattern)
- [ ] No other lines in the file are modified
- [ ] The file still compiles without type errors

## Notes

- This is a minimal change — exactly 2 lines added (1 function definition + 1 prop).
- The `router` is already imported and destructured from `useRouter()` at the top of `BooksPage`.
- The `Book` type is already imported at the top of the file.
- Do NOT change any other behavior, imports, or exports.
