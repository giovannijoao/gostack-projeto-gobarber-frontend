import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import Input from '../../components/Input';

jest.mock('@unform/core', () => ({
  useField: () => ({
    fieldName: 'email',
    defaultValue: '',
    error: '',
    registerField: jest.fn(),
  }),
}));

let inputElement: HTMLElement, containerElement: HTMLElement;

describe('Component - Input', () => {
  beforeEach(() => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    );
    inputElement = getByPlaceholderText('E-mail');
    containerElement = getByTestId('input-container');
  });
  it('should able to render an input', () => {
    expect(inputElement).toBeTruthy();
  });
  it('should render highlight on input focus', async () => {
    fireEvent.focus(inputElement);
    await waitFor(() => {
      expect(containerElement).toHaveStyle('border-color: #ff9000');
      expect(containerElement).toHaveStyle('color: #ff9000');
    });
    fireEvent.blur(inputElement);
    await waitFor(() => {
      expect(containerElement).not.toHaveStyle('border-color: #ff9000');
      expect(containerElement).not.toHaveStyle('color: #ff9000');
    });
  });
  it('should keep input border highlight when input is filled', async () => {
    fireEvent.change(inputElement, {
      target: {
        value: 'test',
      },
    });
    fireEvent.blur(inputElement);
    await waitFor(() => expect(containerElement).toHaveStyle('color: #ff9000'));
  });
});
