import React from 'react';
import { render, screen } from '@testing-library/react-native';
import App from '../App';

describe('Navigation', () => {
  it('renders key tabs', () => {
    render(<App />);
    // ensure a couple of tabs exist
    expect(screen.getAllByText('Feed').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Search').length).toBeGreaterThan(0);
  });
});


