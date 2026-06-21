import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AddBookForm } from "./add-book-form";

afterEach(() => {
  vi.useRealTimers();
});

function submitForm() {
  const form = document.querySelector("form");
  if (!form) throw new Error("Form not found");
  fireEvent.submit(form);
}

describe("AddBookForm", () => {
  describe("form fields", () => {
    it("renders all required field labels", () => {
      render(<AddBookForm onCancel={vi.fn()} />);

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Author")).toBeInTheDocument();
      expect(screen.getByText("ISBN")).toBeInTheDocument();
      expect(screen.getByText("Publisher")).toBeInTheDocument();
      expect(screen.getByText("Category")).toBeInTheDocument();
      expect(screen.getByText("Language")).toBeInTheDocument();
      expect(screen.getByText("Year")).toBeInTheDocument();
      expect(screen.getByText("Pages")).toBeInTheDocument();
      expect(screen.getByText("Shelf Location")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
    });

    it("renders input placeholders", () => {
      render(<AddBookForm onCancel={vi.fn()} />);

      expect(screen.getByPlaceholderText("Enter book title")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Author full name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("978-0-7475-3274-3")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Publishing house")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("2024")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("350")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("A-03-12")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Brief description of the book...")).toBeInTheDocument();
    });

    it("shows optional indicator for description field", () => {
      render(<AddBookForm onCancel={vi.fn()} />);

      expect(screen.getByText("Description")).toBeInTheDocument();
      expect(screen.getByText("(optional)")).toBeInTheDocument();
    });

    it("renders category select with placeholder", () => {
      render(<AddBookForm onCancel={vi.fn()} />);

      expect(screen.getByText("Select category")).toBeInTheDocument();
    });

    it("renders language select with placeholder", () => {
      render(<AddBookForm onCancel={vi.fn()} />);

      expect(screen.getByText("Select language")).toBeInTheDocument();
    });
  });

  describe("cancel button", () => {
    it("calls onCancel when cancel button is clicked", () => {
      const onCancel = vi.fn();
      render(<AddBookForm onCancel={onCancel} />);

      fireEvent.click(screen.getByText("Cancel"));

      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe("submit button", () => {
    it("shows Add Book text in idle state", () => {
      render(<AddBookForm onCancel={vi.fn()} />);

      expect(screen.getByText("Add Book")).toBeInTheDocument();
    });

    it("submit button is of type submit", () => {
      render(<AddBookForm onCancel={vi.fn()} />);

      const submitBtn = screen.getByRole("button", { name: "Add Book" });
      expect(submitBtn).toHaveAttribute("type", "submit");
    });
  });

  describe("submission flow", () => {
    it("shows success alert after submission completes", async () => {
      vi.useFakeTimers();
      render(<AddBookForm onCancel={vi.fn()} />);

      submitForm();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(1200);
      });

      expect(screen.getByText(/Book added successfully!/)).toBeInTheDocument();
    });

    it("calls onSuccess callback after submission", async () => {
      vi.useFakeTimers();
      const onSuccess = vi.fn();
      render(<AddBookForm onCancel={vi.fn()} onSuccess={onSuccess} />);

      submitForm();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(1200);
      });

      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    it("hides success alert after 4 seconds", async () => {
      vi.useFakeTimers();
      render(<AddBookForm onCancel={vi.fn()} />);

      submitForm();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(1200);
      });

      expect(screen.getByText(/Book added successfully!/)).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(4000);
      });

      expect(screen.queryByText(/Book added successfully!/)).not.toBeInTheDocument();
    });

    it("success alert is not visible before submission", () => {
      render(<AddBookForm onCancel={vi.fn()} />);

      expect(screen.queryByText(/Book added successfully!/)).not.toBeInTheDocument();
    });
  });
});
