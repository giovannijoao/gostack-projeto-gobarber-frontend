import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import SignUp from '../../pages/SignUp';
import api from '../../services/apiClient';

const mockedHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockedHistoryPush,
  }),
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

const mockedAddToast = jest.fn();
jest.mock('../../hooks/toast', () => ({
  useToast: () => ({
    addToast: mockedAddToast,
  }),
}));

jest.mock('../../services/apiClient', () => ({
  post: jest.fn(),
}));

let nameField: HTMLElement,
  emailField: HTMLElement,
  passwordField: HTMLElement,
  buttonElement: HTMLElement;
describe('Page - SignUp', () => {
  beforeEach(() => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);
    nameField = getByPlaceholderText('Nome');
    emailField = getByPlaceholderText('E-mail');
    passwordField = getByPlaceholderText('Senha');
    buttonElement = getByText('Cadastrar');
    mockedHistoryPush.mockReset();
    mockedAddToast.mockReset();
  });
  it('should be able to sign up', async () => {
    fireEvent.change(nameField, {
      target: {
        value: 'John Doe',
      },
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
    await waitFor(() => expect(mockedHistoryPush).toBeCalledWith('/'));
  });
  it('should not be able to sign up with invalid credentials', async () => {
    fireEvent.change(emailField, {
      target: {
        value: 'john-doe',
      },
    });
    fireEvent.click(buttonElement);
    await waitFor(() => expect(mockedHistoryPush).not.toHaveBeenCalled());
  });
  it('should display an error if sign up', async () => {
    jest.spyOn(api, 'post').mockImplementation(() => {
      throw new Error();
    });

    fireEvent.change(nameField, {
      target: {
        value: 'John Doe',
      },
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
