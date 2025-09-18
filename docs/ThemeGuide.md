# Theme Guide

This guide explains how to use the theming system in the `happy-paisa-frontend` application.

## Themes

The application includes two themes: `light` and `dark`. The themes are defined in the `src/themes.ts` file. Each theme is an object that maps CSS custom property names to color values.

### Example

```ts
export const themes = {
  dark: {
    '--color-primary': '#03a9f4',
    '--color-accent': '#ff9800',
    '--color-background': '#1a1a1a',
    '--color-surface': '#2c2c2c',
    '--color-text': '#ffffff',
    '--color-text-secondary': '#a3a3a3',
  },
  light: {
    // ...
  },
};
```

## Switching Themes

The theme can be changed using the `ThemeSwitcher` component. This component is located in the `src/components/ThemeSwitcher.tsx` file. It uses the `useTheme` hook to toggle the theme.

### Example

```tsx
import { useTheme } from '../contexts/ThemeContext';

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'dark' : 'light'} mode
    </button>
  );
}
```
