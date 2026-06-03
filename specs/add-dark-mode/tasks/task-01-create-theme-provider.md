# Task 01: Create Theme Provider

## Status

complete

## Wave

1

## Description

Create a TanStack Start-compatible theme provider for `apps/tanstack-app`. This provider is the core of dark mode: it persists a selected theme, resolves `system` against `prefers-color-scheme`, applies the resolved class to `document.documentElement`, and uses `ScriptOnce` to run a pre-hydration script that reduces flash of the wrong theme.

## Dependencies

**Depends on:** None (Wave 1)
**Blocks:** task-03-integrate-root-theme-toggle.md

**Context from dependencies:** This is a Wave 1 foundational task and has no prior task outputs. The root integration task will import the provider and `useTheme` hook created here.

## Files to Create

- `apps/tanstack-app/src/components/theme-provider.tsx` — TanStack Start shadcn-style provider, context, pre-hydration script, and `useTheme` hook.

## Files to Modify

- None.

## Technical Details

### Implementation Steps

1. Create `apps/tanstack-app/src/components/theme-provider.tsx`.
2. Import React context/effects/state helpers from `react` and `ScriptOnce` from `@tanstack/react-router`.
3. Define `type Theme = "dark" | "light" | "system"`.
4. Define `ThemeProviderProps` with `children: React.ReactNode`, optional `defaultTheme?: Theme`, and optional `storageKey?: string`.
5. Define provider state with `theme` and `setTheme`.
6. Implement `getThemeScript(storageKey, defaultTheme)` that returns an IIFE string. It must read `localStorage`, validate only `light`, `dark`, or `system`, fall back to `defaultTheme`, resolve `system` using `matchMedia('(prefers-color-scheme: dark)')`, add the resolved class to `document.documentElement`, and set `document.documentElement.style.colorScheme`.
7. Implement `applyTheme(theme)` that removes both `light` and `dark` from the root, resolves `system` using `window.matchMedia`, adds the resolved class, and sets `root.style.colorScheme`.
8. Implement `ThemeProvider` with defaults `defaultTheme = "system"` and `storageKey = "theme"`.
9. On mount, read `localStorage.getItem(storageKey)`, validate it, update state to stored value or default, and set a mounted flag.
10. After mounted, call `applyTheme(theme)` when theme changes.
11. When mounted and `theme === "system"`, subscribe to `prefers-color-scheme` changes and re-apply `system`; clean up the listener.
12. Implement `setTheme(next)` to store the next value in `localStorage` and update React state.
13. Render the context provider, include `<ScriptOnce>{getThemeScript(storageKey, defaultTheme)}</ScriptOnce>`, and then render children.
14. Export `ThemeProvider` and `useTheme`.

### Code Snippets

Use this shadcn TanStack Start pattern, adapted for the app path:

```tsx
import { createContext, useContext, useEffect, useState } from 'react'
import { ScriptOnce } from '@tanstack/react-router'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

function getThemeScript(storageKey: string, defaultTheme: Theme) {
  const key = JSON.stringify(storageKey)
  const fallback = JSON.stringify(defaultTheme)

  return `(function(){try{var t=localStorage.getItem(${key});if(t!=='light'&&t!=='dark'&&t!=='system'){t=${fallback}}var d=matchMedia('(prefers-color-scheme: dark)').matches;var r=t==='system'?(d?'dark':'light'):t;var e=document.documentElement;e.classList.add(r);e.style.colorScheme=r}catch(e){}})();`
}

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: 'system',
  setTheme: () => {},
})

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')

  const resolved =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme

  root.classList.add(resolved)
  root.style.colorScheme = resolved
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    setThemeState(
      stored === 'light' || stored === 'dark' || stored === 'system'
        ? stored
        : defaultTheme
    )
    setMounted(true)
  }, [defaultTheme, storageKey])

  useEffect(() => {
    if (!mounted) return
    applyTheme(theme)
  }, [theme, mounted])

  useEffect(() => {
    if (!mounted || theme !== 'system') return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme('system')
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [theme, mounted])

  const setTheme = (next: Theme) => {
    localStorage.setItem(storageKey, next)
    setThemeState(next)
  }

  return (
    <ThemeProviderContext value={{ theme, setTheme }}>
      <ScriptOnce>{getThemeScript(storageKey, defaultTheme)}</ScriptOnce>
      {children}
    </ThemeProviderContext>
  )
}

export function useTheme() {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
```

If project lint/format style requires double quotes, adjust formatting consistently with the existing app. Current app files use single quotes.

### Environment Variables

None.

### API Endpoints

None.

## Acceptance Criteria

- [ ] `apps/tanstack-app/src/components/theme-provider.tsx` exists and exports `ThemeProvider` and `useTheme`.
- [ ] Supported theme values are only `light`, `dark`, and `system`.
- [ ] Default theme is `system`; default storage key is `theme`.
- [ ] Provider injects a `ScriptOnce` pre-hydration script that reads `localStorage`, resolves system preference, adds the resolved class, and sets `colorScheme`.
- [ ] Provider updates document root classes and `colorScheme` after theme changes.
- [ ] Provider listens for system preference changes only while `theme === "system"` and cleans up the listener.
- [ ] No direct browser global access happens during server render outside the script string.
- [ ] `pnpm check-types` passes after this task is implemented.

## Notes

The shared CSS already supports dark mode through `packages/ui/src/styles/global.css`: it defines `@custom-variant dark (&:is(.dark *));`, `:root` variables, and `.dark` variables. Do not edit that CSS in this task.
