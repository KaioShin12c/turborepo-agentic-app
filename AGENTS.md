# CRITICAL RULES - MUST FOLLOW

## RESPONSES

- Keep responses concise and to the point - unless the user asks otherwise

## PLANNING MODE

- Ask clarifying questions whenever requirements are ambiguous.
- Do not ask unnecessary questions when the task is already well-defined.
- Never assume design, tech stack or features
- Use deep-dive sub-agents to assist with research
- Use deep-dive sub-agents to review the different aspects of your plan before presenting to the user

## CHANGE / EDIT MODE

- Prefer sub-agents for implementation whenever available. Act primarily as a coordinator and delegate work whenever possible.
- Identify changes from the plan that can be implemented in parallel, and use sub-agents to implement the features efficiently
- Use the best model for the task - premium models for complex tasks (like coding) and mid-tier models for simpler tasks, like documentation
- After completing features (large or small), always run commands like lint, type check and next build to check code quality

## DATABASE SCHEMA CHANGES

- Whenever you make changes to the database schema, ALWAYS run the drizzle generate and migrate commands
- NEVER run drizzle push!
- For all ID columns NOT related to BetterAuth, use UUID for the ID columns and be randomly generated

## TESTING

- Use any testing tools, libraries available to the project for testing your changes
- Never assume your changes simply work, always test!
- If the project does not have any testing tools, scripts, MCP tools, skills, etc. available for testing, ask the user whether testing should be skipped.

## UI DESIGN

### Component Strategy

- Always use existing `shadcn/ui` components before creating custom components.
- Prefer composition and extension over modifying or rewriting existing components.
- Only create a custom component when no suitable `shadcn/ui` component exists.

### Styling Rules

- Never use inline styles (`style={{ ... }}`) unless absolutely required for dynamic runtime values.
- Use existing shadcn/ui design tokens, CSS variables, and semantic theme tokens whenever possible.
- Do not create new color variables when an existing semantic token can be used.
- Do not hardcode colors, spacing, border radius, shadows, or z-index values in components.
- Prefer design-system values over arbitrary Tailwind values.
- Avoid arbitrary Tailwind values (`w-[347px]`, `text-[#123456]`, etc.) unless required by a documented design requirement.
- Reuse existing spacing, typography, and color scales.
- All new UI must work correctly in both light and dark themes using existing shadcn/ui theme tokens.

### Responsiveness

- Mobile-first by default.
- Ensure all new UI works across mobile, tablet, and desktop breakpoints.
- Avoid fixed widths and heights unless required by the design.

### Consistency

- Follow existing patterns in the codebase before introducing new ones.
- Reuse existing layouts, form patterns, dialogs, tables, and navigation components whenever possible.
- Match existing spacing, typography, and interaction patterns.
