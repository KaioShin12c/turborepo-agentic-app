# Task 02: Wire Up onEdit in BooksPage

## Status

complete

## Wave

1

## Description

The `BooksTable` component already defines an `onEdit` callback in its interface (line 29 of `books-table.tsx`), and the dropdown menu already renders an "Edit" item with `Pencil` icon that calls `onEdit?.(book)` (line 108). However, `BooksPage` in `books/index.tsx` never passes an `onEdit` prop to `BooksTable` — only `onDelete` is wired (line 94). This task connects the "Edit" action to navigate to the new edit page route at `/books/$id/edit`.

## Dependencies

**Depends on:** None (Wave 1)
**Blocks:** None

**Context from dependencies:** This is a Wave 1 task with no dependencies. The `BooksTable` component is already built with the `onEdit` prop ready to use. Task 03 will create the edit page route that this navigation targets.

## Files to Create

None.

## Files to Modify

- `apps/tanstack-app/src/routes/_authenticated/books/index.tsx` — Add `onEdit` handler to `BooksTable` usage

## Technical Details

### Implementation Steps

1. Open `apps/tanstack-app/src/routes/_authenticated/books/index.tsx`
2. Create a `handleEdit` function inside `BooksPage` component that navigates to the edit page:

```typescript
const handleEdit = (book: Book) => {
  router.navigate({ to: "/books/$id/edit", params: { id: book.id } });
};
```

3. Pass `handleEdit` as the `onEdit` prop to `BooksTable`:

Change line 94 from:
```tsx
<BooksTable books={paged} onDelete={handleDelete} />
```
To:
```tsx
<BooksTable books={paged} onDelete={handleDelete} onEdit={handleEdit} />
```

4. `router` is already imported from `@tanstack/react-router` and used via `useRouter()` on line 16. No new imports needed.

5. `Book` type is already imported on line 9. No new type imports needed.

### Full Change

Only one line changes — add `onEdit={handleEdit}` to the `<BooksTable>` JSX element. Add the `handleEdit` function definition above the `return` statement, near `handleDelete`.

## Acceptance Criteria

- [ ] `handleEdit` function navigates to `/books/$id/edit` with the book's `id` as the route param
- [ ] `onEdit={handleEdit}` is passed to `BooksTable` component
- [ ] Clicking "Edit" in the table dropdown triggers navigation (will 404 until task-03 is complete)
- [ ] No type errors — `handleEdit` matches `(book: Book) => void` signature
- [ ] No lint errors introduced

## Notes

- This task modifies only one file. It's independent from task-01 and can run in parallel with it.
- The navigation will fail (404) until task-03 creates the route file. This is expected — the route won't exist yet during Wave 1.
- The `handleDelete` function (line 62-65) is a good reference for the placement and pattern of `handleEdit`.
