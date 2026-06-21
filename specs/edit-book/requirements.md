# Requirements: Edit Book

## Summary

The current book management UI has an "Edit" action in the books table dropdown menu, but it's a no-op — the `onEdit` callback is defined in the `BooksTable` component interface but never wired up in `BooksPage`. This feature completes the edit flow by:

1. Creating an edit form component that reuses the existing book validation schema
2. Creating a dedicated edit page route at `/books/$id/edit`
3. Connecting the table's "Edit" action to navigate to the edit page

The edit flow is frontend-only — it uses the existing mock `BOOKS` data array and simulates a server submission with a delay, matching the pattern established by the existing `AddBookForm`.

## Goals

- Pre-populate a form with existing book data for editing
- Validate edits using the same Zod schema as the add form
- Show a success confirmation after mock submission
- Navigate back to the book list after edit completes
- Follow existing UI patterns (iconography, layout, spacing, color)

## Non-Goals

- Database persistence or server functions — this is a frontend-only feature
- Real-time validation or auto-save
- Inline editing (edit-in-place within the table)
- Adding a book detail/view page
- Updating the delete flow to use a server

## Acceptance Criteria

- [ ] Clicking "Edit" on a book row navigates to `/books/$id/edit` with the correct book ID
- [ ] The edit page loads the book data and pre-fills all form fields
- [ ] Changing fields and submitting triggers mock submission (loading spinner + 1.2s delay)
- [ ] Success alert displays after mock submission and auto-dismisses after 4s
- [ ] After success, user is redirected back to the books list
- [ ] "Back to Books" link on the edit page navigates to `/books`
- [ ] If a book ID is not found in the mock data, "Book not found" message is displayed
- [ ] Form validation works identically to the add book form (same field rules)

## Assumptions

- The existing `addBookSchema` is suitable for the edit form without modification
- The existing `BOOKS` mock data array (`data.ts`) is the single source of data
- TanStack Router file-based routing convention `$id.edit.tsx` maps to `/$id/edit` path
- All UI components from `@repo/ui` and `#/shared/components/form-fields/` remain available

## Technical Constraints

- Uses React Hook Form for form state management (same as `AddBookForm`)
- Uses Zod v3 `addBookSchema` for validation — no schema changes
- Uses the existing `#/` path alias (maps to `apps/tanstack-app/src/`)
- File-based routing via TanStack Router (file: `$id.edit.tsx`)
- Icon kit is Lucide React
- Styling: Tailwind CSS v4 utility classes
- No new dependencies required
