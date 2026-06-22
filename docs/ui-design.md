# UI Design Guidelines

## Component Strategy

- Always use existing `shadcn/ui` components before creating custom components.
- Prefer composition and extension over modifying or rewriting existing components.
- Only create a custom component when no suitable `shadcn/ui` component exists.

## Styling Rules

- Never use inline styles (`style={{ ... }}`) unless absolutely required for dynamic runtime values.
- Use existing shadcn/ui design tokens, CSS variables, and semantic theme tokens whenever possible.
- Do not create new color variables when an existing semantic token can be used.
- Do not hardcode colors, spacing, border radius, shadows, or z-index values in components.
- Prefer design-system values over arbitrary Tailwind values.
- Avoid arbitrary Tailwind values (`w-[347px]`, `text-[#123456]`, etc.) unless required by a documented design requirement.
- Never concatenate class strings manually (string templates, `+`, or conditional ternaries in template literals). Always use `cn()` from `@repo/ui/lib/utils` for conditional class merging. This ensures `tailwind-merge` resolves conflicting Tailwind classes correctly.
- Reuse existing spacing, typography, and color scales.
- All new UI must work correctly in both light and dark themes using existing shadcn/ui theme tokens.

## Responsiveness

- Mobile-first by default.
- Ensure all new UI works across mobile, tablet, and desktop breakpoints.
- Avoid fixed widths and heights unless required by the design.

## Consistency

- Follow existing patterns in the codebase before introducing new ones.
- Reuse existing layouts, form patterns, dialogs, tables, and navigation components whenever possible.
- Match existing spacing, typography, and interaction patterns.
