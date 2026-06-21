import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BooksFilters } from "./books-filters";

function openSelectByTriggerWidth(width: string) {
  const triggers = document.querySelectorAll('[data-slot="select-trigger"]');
  const trigger = [...triggers].find((t) => t.className.includes(width)) ?? triggers[0];
  if (trigger) fireEvent.click(trigger);
}

function renderFilters(
  overrides: {
    search?: string;
    category?: string;
    status?: string;
    language?: string;
    onSearchChange?: (value: string) => void;
    onCategoryChange?: (value: string) => void;
    onStatusChange?: (value: string) => void;
    onLanguageChange?: (value: string) => void;
    onReset?: () => void;
  } = {},
) {
  return render(
    <BooksFilters
      search={overrides.search ?? ""}
      category={overrides.category ?? "all"}
      status={overrides.status ?? "all"}
      language={overrides.language ?? "all"}
      onSearchChange={overrides.onSearchChange ?? vi.fn()}
      onCategoryChange={overrides.onCategoryChange ?? vi.fn()}
      onStatusChange={overrides.onStatusChange ?? vi.fn()}
      onLanguageChange={overrides.onLanguageChange ?? vi.fn()}
      onReset={overrides.onReset ?? vi.fn()}
    />,
  );
}

describe("BooksFilters", () => {
  describe("search input", () => {
    it("renders search input with placeholder", () => {
      renderFilters();

      const input = screen.getByPlaceholderText("Search title or author...");
      expect(input).toBeInTheDocument();
    });

    it("renders with initial search value", () => {
      renderFilters({ search: "react" });

      const input = screen.getByPlaceholderText("Search title or author...");
      expect(input).toHaveValue("react");
    });

    it("calls onSearchChange when typing", () => {
      const onSearchChange = vi.fn();
      renderFilters({ onSearchChange });

      const input = screen.getByPlaceholderText("Search title or author...");
      fireEvent.change(input, { target: { value: "typescript" } });

      expect(onSearchChange).toHaveBeenCalledTimes(1);
      expect(onSearchChange).toHaveBeenCalledWith("typescript");
    });
  });

  describe("category select", () => {
    it("renders category select", () => {
      renderFilters();

      expect(screen.getByText("All Categories")).toBeInTheDocument();
    });

    it("shows selected category value", () => {
      renderFilters({ category: "Fiction" });

      expect(screen.getByText("Fiction")).toBeInTheDocument();
    });

    it("calls onCategoryChange when selecting a category", () => {
      const onCategoryChange = vi.fn();
      renderFilters({ onCategoryChange });

      openSelectByTriggerWidth("w-[150px]");
      fireEvent.click(screen.getByText("Fiction"));

      expect(onCategoryChange).toHaveBeenCalledWith("Fiction");
    });
  });

  describe("status select", () => {
    it("renders status select", () => {
      renderFilters();

      expect(screen.getByText("All Statuses")).toBeInTheDocument();
    });

    it("calls onStatusChange when selecting a status", () => {
      const onStatusChange = vi.fn();
      renderFilters({ onStatusChange });

      openSelectByTriggerWidth("w-[140px]");
      fireEvent.click(screen.getByText("Borrowed"));

      expect(onStatusChange).toHaveBeenCalledWith("Borrowed");
    });
  });

  describe("language select", () => {
    it("renders language select", () => {
      renderFilters();

      expect(screen.getByText("All Languages")).toBeInTheDocument();
    });

    it("calls onLanguageChange when selecting a language", () => {
      const onLanguageChange = vi.fn();
      renderFilters({ onLanguageChange });

      openSelectByTriggerWidth("w-[130px]");
      fireEvent.click(screen.getByText("Vietnamese"));

      expect(onLanguageChange).toHaveBeenCalledWith("Vietnamese");
    });
  });

  describe("reset button", () => {
    it("is hidden when no filters are active", () => {
      renderFilters();

      expect(screen.queryByText("Reset")).not.toBeInTheDocument();
    });

    it("is visible when search is not empty", () => {
      renderFilters({ search: "test" });

      expect(screen.getByText("Reset")).toBeInTheDocument();
    });

    it("is visible when category is not 'all'", () => {
      renderFilters({ category: "Fiction" });

      expect(screen.getByText("Reset")).toBeInTheDocument();
    });

    it("is visible when status is not 'all'", () => {
      renderFilters({ status: "Borrowed" });

      expect(screen.getByText("Reset")).toBeInTheDocument();
    });

    it("is visible when language is not 'all'", () => {
      renderFilters({ language: "Vietnamese" });

      expect(screen.getByText("Reset")).toBeInTheDocument();
    });

    it("is hidden when all filters are back to default", () => {
      renderFilters({
        search: "",
        category: "all",
        status: "all",
        language: "all",
      });

      expect(screen.queryByText("Reset")).not.toBeInTheDocument();
    });

    it("calls onReset when clicked", () => {
      const onReset = vi.fn();
      renderFilters({ search: "test", onReset });

      fireEvent.click(screen.getByText("Reset"));

      expect(onReset).toHaveBeenCalledTimes(1);
    });
  });
});
