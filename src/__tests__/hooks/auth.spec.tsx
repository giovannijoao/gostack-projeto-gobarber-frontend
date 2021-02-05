import { renderHook, RenderHookResult } from '@testing-library/react-hooks';
import { AuthProvider, useAuth, AuthContextData } from '../../hooks/auth';
import MockAdapter from 'axios-mock-adapter';
import api from '../../services/apiClient';
import { act } from 'react-dom/test-utils';

const apiMock = new MockAdapter(api);
let hook: RenderHookResult<{}, AuthContextData>;

const doSessionRestore = () =>
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
    if (key === '@GoBarber:token') return 'token-123';
    if (key === '@GoBarber:user') return JSON.stringify(testUser);
    return null;
  });
const testUser = {
  id: 'userId',
  name: 'John Doe',
  email: 'john-doe@example.com',
};

describe('Hook - Auth', () => {
  beforeEach(() => {
    hook = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });
  });
  it('should be able to sign in', async () => {
    const apiResponse = {
      user: testUser,
      token: 'token-123',
    };
    apiMock.onPost('sessions').replyOnce(200, apiResponse);

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result, waitForNextUpdate } = hook;
    result.current.signIn({
      email: testUser.email,
      password: 'my-strong-password',
    });
    await waitForNextUpdate();
    expect(result.current.user.email).toEqual(testUser.email);
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:token',
      apiResponse.token,
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(apiResponse.user),
    );
  });
  it('should restore saved data from storage when auth inits', () => {
    doSessionRestore();
    expect(hook.result.current.user.email).toEqual(testUser.email);
  });

  it('should be able to sign out', async () => {
    doSessionRestore();
    const { result } = hook;
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');
    act(() => result.current.signOut());
    expect(result.current.user).toBeUndefined();
    expect(removeItemSpy).toHaveBeenCalledTimes(2);
  });
  it('should be able to update user data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    const { result } = hook;

    const updateUserData = {
      ...testUser,
      name: 'John',
      avatar_url: 'image.jpg',
    };

    await act(() => result.current.updateUser(updateUserData));
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(updateUserData),
    );
    expect(result.current.user).toEqual(updateUserData);
  });
});
