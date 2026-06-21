# Task 01: Create EditBookForm Component

## Status

complete

## Wave

1

## Description

Create a reusable `EditBookForm` component that renders a pre-populated form for editing a book's details. This component reuses the existing `addBookSchema` for validation and follows the same layout and interaction patterns as the existing `AddBookForm` component. On submit, it simulates a server request with a 1.2s delay (matching AddBookForm's mock behavior), shows a success alert, and invokes an `onSuccess` callback.

## Dependencies

**Depends on:** None (Wave 1)
**Blocks:** task-03-edit-page-route.md

**Context from dependencies:** This is a Wave 1 task with no dependencies. All imports it needs already exist in the codebase.

## Files to Create

- `apps/tanstack-app/src/features/books/components/edit-book-form.tsx` — The edit form component

## Files to Modify

None.

## Technical Details

### Implementation Steps

1. Create `apps/tanstack-app/src/features/books/components/edit-book-form.tsx`
2. Export a single named component: `EditBookForm`
3. The component accepts these props:

```typescript
interface EditBookFormProps {
  book: Book;           // existing book data to pre-populate the form
  onCancel: () => void;  // called when user clicks Cancel
  onSuccess?: () => void; // called after mock submission completes
}
```

4. Use React Hook Form's `useForm<AddBookFormValues>` with `defaultValues` populated from the `book` prop. Note: the `Book` type has `year` and `pages` as `number`, but the form schema expects `string`. Convert them with `String(book.year)` and `String(book.pages)`.

5. The form layout must exactly match `AddBookForm` — same grid (`grid gap-6 sm:grid-cols-2`), same field order, same `FormInput`/`FormSelect`/`FormTextarea` wrappers, same spacing.

6. Use `Pencil` icon from lucide-react (instead of `BookPlus`) for the edit context:
   - Icon next to the submit button text "Save Changes"
   - Icon size: 16

7. Submit button text: "Save Changes" (instead of "Add Book"). Loading state shows `Loader2` + "Saving..." text.

8. Mock submission: `await new Promise((r) => setTimeout(r, 1200))` — then set `success` state to true, call `onSuccess?.()`, auto-dismiss after 4s with `setTimeout(() => setSuccess(false), 4000)`.

9. Success alert uses the same styling as AddBookForm:
```
border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400
```
With `Check` icon and message: "Book updated successfully!"

10. Import from existing paths:
    - `import type { Book } from "#/features/books/types"`
    - `import type { AddBookFormValues } from "#/features/books/schemas/book-form.schema"`
    - `import { CATEGORIES, LANGUAGES } from "#/features/books/constants"`
    - `import { FormInput } from "#/shared/components/form-fields/form-input"`
    - `import { FormSelect } from "#/shared/components/form-fields/form-select"`
    - `import { FormTextarea } from "#/shared/components/form-fields/form-textarea"`

### Default Values Conversion

The `book` prop is type `Book` (numbers for year/pages). The form schema wants strings:

```typescript
defaultValues: {
  title: book.title,
  author: book.author,
  isbn: book.isbn,
  category: book.category,
  publisher: book.publisher,
  year: String(book.year),
  pages: String(book.pages),
  language: book.language,
  location: book.location,
  description: book.description ?? "",
}
```

Note: `description` is optional in the schema but `Book` type doesn't have it — default to empty string.

## Acceptance Criteria

- [ ] `EditBookForm` component exports from `edit-book-form.tsx`
- [ ] All form fields are pre-populated from the `book` prop
- [ ] Year and pages are correctly converted from number to string
- [ ] Form validates with the same rules as AddBookForm (via `addBookSchema`)
- [ ] Submit triggers 1.2s mock delay with loading spinner
- [ ] Success alert appears with "Book updated successfully!" message
- [ ] Success alert auto-dismisses after 4 seconds
- [ ] `onSuccess` callback fires after mock submission completes
- [ ] Cancel button calls `onCancel`
- [ ] Component uses `Pencil` icon (not `BookPlus`)
- [ ] Submit button text is "Save Changes" (not "Add Book")
- [ ] Form layout matches AddBookForm exactly (grid, field order, field wrappers)

## Notes

- The `Book` interface in `types.ts` does not have a `description` field — use empty string as default.
- This component is only used by the edit page route (task-03). It is not imported by any other task.
- Follow the existing code style: no comments, one component per file, `#/` path alias for all internal imports.
