import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import SignIn from '../../pages/SignIn';

const mockedHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockedHistoryPush,
  }),
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../../hooks/auth', () => ({
  useAuth: () => ({
    signIn: jest.fn(),
  }),
}));

describe('Page - SignIn', () => {
  it('should be able to sign in', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, {
      target: {
        value: 'john-doe@example.com',
      },
    });
    fireEvent.change(passwordField, {
      target: {
        value: 'my-strong-password',
      },
    });
    fireEvent.click(buttonElement);
    await waitFor(() => expect(mockedHistoryPush).toBeCalledWith('/dashboard'));
  });
});
