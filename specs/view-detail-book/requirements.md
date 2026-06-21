# Requirements: View Detail Book

## Summary

The current book management UI has a "View Details" action in the books table dropdown menu, but it's a no-op — the `onView` callback is defined in the `BooksTable` component interface but never wired up in `BooksPage`, and no detail page route exists. This feature completes the view flow by:

1. Creating a `BookDetail` read-only display component that shows all book fields in a visual card layout
2. Creating a dedicated detail page route at `/books/$id`
3. Connecting the table's "View Details" action to navigate to the detail page

The view flow is frontend-only — it reads from the existing mock `BOOKS` data array. No server functions or database queries are involved.

## Goals

- Display all book fields in a clean, read-only card layout
- Show book status with the same color-coded badges used in the table
- Include a back button to return to the book list
- Include an "Edit" button on the detail page for quick navigation to the edit form
- Handle the "book not found" case gracefully
- Follow existing UI patterns (iconography, layout, spacing, color scheme)

## Non-Goals

- Database persistence or server functions — this is a frontend-only feature
- Book checkout/borrow functionality
- Book deletion from the detail page (deletion is done from the table)
- Adding new fields to the `Book` interface
- Real-time updates or WebSocket integration

## Acceptance Criteria

- [ ] Clicking "View Details" on a book row in the table navigates to `/books/$id` with the correct book ID
- [ ] The detail page displays all book fields: title, author, ISBN, category, publisher, year, pages, language, status (color-coded badge), location, added date, times borrowed
- [ ] The detail page shows the book title prominently with an appropriate icon (BookOpen or similar)
- [ ] A "Back to Books" button navigates back to `/books`
- [ ] An "Edit Book" button is present and navigates to `/books/$id/edit`
- [ ] If a book ID is not found in the mock data, a "Book not found" message with a back button is displayed
- [ ] The layout matches existing page patterns (space-y-6 outer, space-y-4 inner)

## Assumptions

- The existing `BOOKS` mock data array (`data.ts`) is the single source of data
- TanStack Router file-based routing convention: `$id.tsx` maps to `/books/$id`
- The existing `Book` interface in `types.ts` has all needed fields (15 fields)
- All UI components from `@repo/ui` and shared components remain available
- The `onView` prop already exists on `BooksTable` — it just needs to be wired up

## Technical Constraints

- Uses TanStack Router for navigation (`useRouter`, `useParams`)
- Uses the existing `#/` path alias (maps to `apps/tanstack-app/src/`)
- File-based routing: `routes/_authenticated/books/$id.tsx`
- Icon kit is Lucide React
- Styling: Tailwind CSS v4 utility classes
- Uses `Badge` component from `@repo/ui` for status display
- No new dependencies required
- No database migration required (frontend-only)
