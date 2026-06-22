import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Book } from "#/features/books/types";
import { BooksTable } from "./books-table";

const makeBook = (overrides: Partial<Book> = {}): Book => ({
  id: "book-1",
  title: "Test Book",
  author: "Test Author",
  isbn: "978-0-123-45678-9",
  category: "Fiction",
  publisher: "Test Publisher",
  year: 2024,
  pages: 350,
  language: "English",
  status: "Available",
  location: "A-03-12",
  addedDate: "2024-01-15",
  timesBorrowed: 42,
  ...overrides,
});

const book1 = makeBook();
const book2 = makeBook({
  id: "book-2",
  title: "Second Book",
  author: "Jane Doe",
  isbn: "978-0-987-65432-1",
  category: "Science",
  status: "Borrowed",
  language: "Vietnamese",
  timesBorrowed: 1500,
});

function openDropdown(rowIndex: number) {
  const triggers = document.querySelectorAll('button[aria-haspopup="menu"]');
  const trigger = triggers[rowIndex];
  if (trigger) fireEvent.pointerDown(trigger);
}

describe("BooksTable", () => {
  describe("empty state", () => {
    it("renders empty message when no books provided", () => {
      render(<BooksTable books={[]} />);

      expect(screen.getByText("No books found")).toBeInTheDocument();
      expect(screen.getByText("Add a new book to get started.")).toBeInTheDocument();
    });
  });

  describe("with data", () => {
    it("renders table headers", () => {
      render(<BooksTable books={[book1]} />);

      expect(screen.getByText("Title & Author")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getByText("Borrowed")).toBeInTheDocument();
    });

    it("renders book data in cells", () => {
      render(<BooksTable books={[book1]} />);

      expect(screen.getByText("Test Book")).toBeInTheDocument();
      expect(screen.getByText("Test Author")).toBeInTheDocument();
      expect(screen.getByText("978-0-123-45678-9")).toBeInTheDocument();
      expect(screen.getByText("Fiction")).toBeInTheDocument();
      expect(screen.getByText("Available")).toBeInTheDocument();
      expect(screen.getByText("A-03-12")).toBeInTheDocument();
      expect(screen.getByText("English")).toBeInTheDocument();
      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("renders multiple rows", () => {
      render(<BooksTable books={[book1, book2]} />);

      expect(screen.getByText("Test Book")).toBeInTheDocument();
      expect(screen.getByText("Second Book")).toBeInTheDocument();
    });

    it("renders title first character in avatar cell", () => {
      render(<BooksTable books={[book1]} />);

      // TitleCell renders the first char in a box
      expect(screen.getByText("T")).toBeInTheDocument();
    });

    it("applies correct status badge class for each status", () => {
      render(<BooksTable books={[book2]} />);

      const borrowedElements = screen.getAllByText("Borrowed");
      const badge = borrowedElements.find((el) => el.tagName === "SPAN" && el.getAttribute("data-slot") === "badge")!;
      expect(badge).toBeDefined();
      expect(badge.className).toContain("bg-amber-500/15");
      expect(badge.className).toContain("text-amber-600");
    });

    it("formats timesBorrowed with locale", () => {
      render(<BooksTable books={[book2]} />);

      expect(screen.getByText("1,500")).toBeInTheDocument();
    });

    it("renders book id in monospace font", () => {
      render(<BooksTable books={[book1]} />);

      expect(screen.getByText("book-1")).toBeInTheDocument();
    });
  });

  describe("dropdown actions", () => {
    it("calls onView with the correct book when View Details is clicked", () => {
      const onView = vi.fn();
      render(<BooksTable books={[book1]} onView={onView} />);

      openDropdown(0);
      fireEvent.click(screen.getByText("View Details"));

      expect(onView).toHaveBeenCalledTimes(1);
      expect(onView).toHaveBeenCalledWith(book1);
    });

    it("calls onEdit with the correct book when Edit is clicked", () => {
      const onEdit = vi.fn();
      render(<BooksTable books={[book1]} onEdit={onEdit} />);

      openDropdown(0);
      fireEvent.click(screen.getByText("Edit"));

      expect(onEdit).toHaveBeenCalledTimes(1);
      expect(onEdit).toHaveBeenCalledWith(book1);
    });

    it("calls the correct onView for each row", () => {
      const onView = vi.fn();
      render(<BooksTable books={[book1, book2]} onView={onView} />);

      // First row
      openDropdown(0);
      fireEvent.click(screen.getByText("View Details"));
      expect(onView).toHaveBeenCalledWith(book1);

      // Second row — need to reopen dropdown for the second row
      openDropdown(1);
      // After first click closes the dropdown and opens a new one,
      // "View Details" text appears again
      fireEvent.click(screen.getByText("View Details"));
      expect(onView).toHaveBeenCalledWith(book2);
    });

    it("does not throw when onView is not provided", () => {
      render(<BooksTable books={[book1]} />);

      openDropdown(0);
      expect(() => fireEvent.click(screen.getByText("View Details"))).not.toThrow();
    });

    it("does not throw when onEdit is not provided", () => {
      render(<BooksTable books={[book1]} />);

      openDropdown(0);
      expect(() => fireEvent.click(screen.getByText("Edit"))).not.toThrow();
    });
  });

  describe("checkbox selection", () => {
    it("renders a checkbox for each row", () => {
      render(<BooksTable books={[book1, book2]} />);

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes.length).toBe(3); // select-all + 2 rows
    });

    it("renders select-all checkbox with aria-label", () => {
      render(<BooksTable books={[book1]} />);

      expect(screen.getByLabelText("Select all")).toBeInTheDocument();
    });

    it("renders row checkbox with aria-label", () => {
      render(<BooksTable books={[book1]} />);

      expect(screen.getByLabelText("Select Test Book")).toBeInTheDocument();
    });

    it("calls onToggleSelect with book id when row checkbox is clicked", () => {
      const onToggleSelect = vi.fn();
      render(<BooksTable books={[book1]} onToggleSelect={onToggleSelect} />);

      const rowCheckbox = screen.getByLabelText("Select Test Book");
      fireEvent.click(rowCheckbox);

      expect(onToggleSelect).toHaveBeenCalledTimes(1);
      expect(onToggleSelect).toHaveBeenCalledWith("book-1");
    });

    it("calls onToggleSelectAll when select-all checkbox is clicked", () => {
      const onToggleSelectAll = vi.fn();
      render(<BooksTable books={[book1]} onToggleSelectAll={onToggleSelectAll} />);

      const selectAll = screen.getByLabelText("Select all");
      fireEvent.click(selectAll);

      expect(onToggleSelectAll).toHaveBeenCalledTimes(1);
    });

    it("shows select-all as checked when all rows are selected", () => {
      const selectedIds = new Set(["book-1", "book-2"]);
      render(<BooksTable books={[book1, book2]} selectedIds={selectedIds} />);

      const selectAll = screen.getByLabelText("Select all");
      expect(selectAll).toHaveAttribute("data-state", "checked");
    });

    it("shows select-all as unchecked when no rows are selected", () => {
      render(<BooksTable books={[book1, book2]} selectedIds={new Set()} />);

      const selectAll = screen.getByLabelText("Select all");
      expect(selectAll).toHaveAttribute("data-state", "unchecked");
    });

    it("calls onToggleSelect for the correct row when multiple rows exist", () => {
      const onToggleSelect = vi.fn();
      render(<BooksTable books={[book1, book2]} onToggleSelect={onToggleSelect} />);

      fireEvent.click(screen.getByLabelText("Select Second Book"));

      expect(onToggleSelect).toHaveBeenCalledWith("book-2");
    });
  });

  describe("delete confirmation dialog", () => {
    it("opens delete dialog when Delete is clicked", () => {
      render(<BooksTable books={[book1]} />);

      openDropdown(0);
      fireEvent.click(screen.getByText("Delete"));

      expect(screen.getByText("Delete Book")).toBeInTheDocument();
      expect(
        screen.getByText('Are you sure you want to delete "Test Book"? This action cannot be undone.'),
      ).toBeInTheDocument();
    });

    it("shows correct book title in delete confirmation", () => {
      render(<BooksTable books={[book2]} />);

      openDropdown(0);
      fireEvent.click(screen.getByText("Delete"));

      expect(
        screen.getByText('Are you sure you want to delete "Second Book"? This action cannot be undone.'),
      ).toBeInTheDocument();
    });

    it("calls onDelete with correct book when confirm is clicked", () => {
      const onDelete = vi.fn();
      render(<BooksTable books={[book1]} onDelete={onDelete} />);

      openDropdown(0);
      fireEvent.click(screen.getByText("Delete"));

      // Click the "Delete" confirm button in the dialog
      const confirmBtn = screen.getByRole("button", { name: "Delete" });
      fireEvent.click(confirmBtn);

      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onDelete).toHaveBeenCalledWith(book1);
    });

    it("closes dialog without calling onDelete when cancel is clicked", () => {
      const onDelete = vi.fn();
      render(<BooksTable books={[book1]} onDelete={onDelete} />);

      openDropdown(0);
      fireEvent.click(screen.getByText("Delete"));

      // Click the "Cancel" button in the dialog
      fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

      expect(onDelete).not.toHaveBeenCalled();
      // Dialog should be closed
      expect(screen.queryByText("Delete Book")).not.toBeInTheDocument();
    });

    it("resets deleteTarget state after confirming", () => {
      const onDelete = vi.fn();
      render(<BooksTable books={[book1]} onDelete={onDelete} />);

      openDropdown(0);
      fireEvent.click(screen.getByText("Delete"));

      fireEvent.click(screen.getByRole("button", { name: "Delete" }));

      // Dialog should be closed after confirm
      expect(screen.queryByText("Delete Book")).not.toBeInTheDocument();
    });

    it("does not throw when onDelete is not provided", () => {
      render(<BooksTable books={[book1]} />);

      openDropdown(0);
      fireEvent.click(screen.getByText("Delete"));

      expect(() => {
        fireEvent.click(screen.getByRole("button", { name: "Delete" }));
      }).not.toThrow();
    });
  });
});
