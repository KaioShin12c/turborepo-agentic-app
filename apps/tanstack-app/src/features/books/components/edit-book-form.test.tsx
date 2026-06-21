import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Book } from "#/features/books/types";
import { EditBookForm } from "./edit-book-form";

afterEach(() => {
  vi.useRealTimers();
});

function submitForm() {
  const form = document.querySelector("form");
  if (!form) throw new Error("Form not found");
  fireEvent.submit(form);
}

const book: Book = {
  id: "book-1",
  title: "The Great Gatsby",
  author: "F. Scott Fitzgerald",
  isbn: "978-0-7432-7356-5",
  category: "Fiction",
  publisher: "Scribner",
  year: 1925,
  pages: 180,
  language: "English",
  status: "Available",
  location: "A-01-03",
  addedDate: "2024-01-15",
  timesBorrowed: 12,
};

describe("EditBookForm", () => {
  describe("pre-filled fields", () => {
    it("pre-fills title input with book title", () => {
      render(<EditBookForm book={book} onCancel={vi.fn()} />);

      expect(screen.getByPlaceholderText("Enter book title")).toHaveValue("The Great Gatsby");
    });

    it("pre-fills author input", () => {
      render(<EditBookForm book={book} onCancel={vi.fn()} />);

      expect(screen.getByPlaceholderText("Author full name")).toHaveValue("F. Scott Fitzgerald");
    });

    it("pre-fills ISBN input", () => {
      render(<EditBookForm book={book} onCancel={vi.fn()} />);

      expect(screen.getByPlaceholderText("978-0-7475-3274-3")).toHaveValue("978-0-7432-7356-5");
    });

    it("pre-fills publisher input", () => {
      render(<EditBookForm book={book} onCancel={vi.fn()} />);

      expect(screen.getByPlaceholderText("Publishing house")).toHaveValue("Scribner");
    });

    it("pre-fills year as string", () => {
      render(<EditBookForm book={book} onCancel={vi.fn()} />);

      expect(screen.getByPlaceholderText("2024")).toHaveValue("1925");
    });

    it("pre-fills pages as string", () => {
      render(<EditBookForm book={book} onCancel={vi.fn()} />);

      expect(screen.getByPlaceholderText("350")).toHaveValue("180");
    });

    it("pre-fills location input", () => {
      render(<EditBookForm book={book} onCancel={vi.fn()} />);

      expect(screen.getByPlaceholderText("A-03-12")).toHaveValue("A-01-03");
    });

    it("pre-fills description as empty string", () => {
      render(<EditBookForm book={book} onCancel={vi.fn()} />);

      expect(screen.getByPlaceholderText("Brief description of the book...")).toHaveValue("");
    });

    it("renders category select with book category", () => {
      render(<EditBookForm book={book} onCancel={vi.fn()} />);

      const categoryEls = screen.getAllByText("Fiction");
      const badge = categoryEls.find((el) => el.getAttribute("data-slot") === "select-value")!;
      expect(badge).toBeDefined();
    });

    it("renders language select with book language", () => {
      render(<EditBookForm book={book} onCancel={vi.fn()} />);

      const langEls = screen.getAllByText("English");
      const badge = langEls.find((el) => el.getAttribute("data-slot") === "select-value")!;
      expect(badge).toBeDefined();
    });
  });

  describe("cancel button", () => {
    it("calls onCancel when cancel button is clicked", () => {
      const onCancel = vi.fn();
      render(<EditBookForm book={book} onCancel={onCancel} />);

      fireEvent.click(screen.getByText("Cancel"));

      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe("submit button", () => {
    it("shows Save Changes text in idle state", () => {
      render(<EditBookForm book={book} onCancel={vi.fn()} />);

      expect(screen.getByText("Save Changes")).toBeInTheDocument();
    });
  });

  describe("submission flow", () => {
    it("shows success alert after submission completes", async () => {
      vi.useFakeTimers();
      render(<EditBookForm book={book} onCancel={vi.fn()} />);

      submitForm();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(1200);
      });

      expect(screen.getByText(/Book updated successfully!/)).toBeInTheDocument();
    });

    it("calls onSuccess callback after submission", async () => {
      vi.useFakeTimers();
      const onSuccess = vi.fn();
      render(<EditBookForm book={book} onCancel={vi.fn()} onSuccess={onSuccess} />);

      submitForm();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(1200);
      });

      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    it("hides success alert after 4 seconds", async () => {
      vi.useFakeTimers();
      render(<EditBookForm book={book} onCancel={vi.fn()} />);

      submitForm();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(1200);
      });

      expect(screen.getByText(/Book updated successfully!/)).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(4000);
      });

      expect(screen.queryByText(/Book updated successfully!/)).not.toBeInTheDocument();
    });

    it("success alert is not visible before submission", () => {
      render(<EditBookForm book={book} onCancel={vi.fn()} />);

      expect(screen.queryByText(/Book updated successfully!/)).not.toBeInTheDocument();
    });
  });
});
