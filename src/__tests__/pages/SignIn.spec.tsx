import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import SignIn from '../../pages/SignIn';

const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockedHistoryPush,
  }),
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../../hooks/auth', () => ({
  useAuth: () => ({
    signIn: mockedSignIn,
  }),
}));

const mockedAddToast = jest.fn();
jest.mock('../../hooks/toast', () => ({
  useToast: () => ({
    addToast: mockedAddToast,
  }),
}));

let emailField: HTMLElement,
  passwordField: HTMLElement,
  buttonElement: HTMLElement;
describe('Page - SignIn', () => {
  beforeEach(() => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);
    emailField = getByPlaceholderText('E-mail');
    passwordField = getByPlaceholderText('Senha');
    buttonElement = getByText('Entrar');
    mockedHistoryPush.mockReset();
  });
  it('should be able to sign in', async () => {
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
  it('should not be able to sign in with invalid credentials', async () => {
    fireEvent.change(emailField, {
      target: {
        value: 'john-doe',
      },
    });
    fireEvent.click(buttonElement);
    await waitFor(() => expect(mockedHistoryPush).not.toHaveBeenCalled());
  });
  it('should display an error with login fails', async () => {
    mockedSignIn.mockImplementation(() => {
      throw new Error();
    });

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
    await waitFor(() =>
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      ),
    );
  });
});
