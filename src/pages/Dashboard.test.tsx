import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

describe('Dashboard', () => {
  it('renders the dashboard', () => {
    render(<Dashboard />);
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });
});