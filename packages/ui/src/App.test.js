import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const instructionElement = screen.getByText(/Generate a Discord Webhook for your channel and copy-paste the Webhook URL to the field below./i)
  expect(instructionElement).toBeInTheDocument();
})