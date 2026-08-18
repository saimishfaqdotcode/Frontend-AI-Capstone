import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SettingsForm from './SettingsForm';

describe('SettingsForm', () => {
  it('shows validation errors and keeps the save button disabled until the form is valid', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    const saveButton = screen.getByRole('button', { name: /save/i });
    expect(saveButton).toBeDisabled();

    const fullNameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);

    await user.type(fullNameInput, 'Ada Lovelace');
    await user.click(emailInput);
    await user.tab();
    await user.type(emailInput, 'ada');
    await user.click(saveButton);

    expect(screen.getByText(/email must be in a valid format/i)).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('shows a success message after a valid save', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    const fullNameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const saveButton = screen.getByRole('button', { name: /save/i });

    await user.type(fullNameInput, 'Grace Hopper');
    await user.type(emailInput, 'grace@example.com');

    expect(saveButton).toBeEnabled();

    await user.click(saveButton);

    expect(screen.getByText(/settings saved successfully/i)).toBeInTheDocument();
  });
});
