import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const instructionElement = getByText(/Generate a Discord Webhook for your channel and copy-paste the Webhook URL to the field below./i);
  expect(instructionElement).toBeInTheDocument();
});
