import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { ThemeSwitcher } from './ThemeSwitcher';

describe('ThemeSwitcher', () => {
  it('toggles the theme', () => {
    const TestComponent = () => {
      const { theme } = useTheme();
      return <div data-testid="theme-display">{theme}</div>;
    };

    render(
      <ThemeProvider>
        <TestComponent />
        <ThemeSwitcher />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-display')).toHaveTextContent('dark');

    fireEvent.click(screen.getByText('Switch to light mode'));

    expect(screen.getByTestId('theme-display')).toHaveTextContent('light');
  });
});