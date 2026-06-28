import { getAccessToken, setAccessToken, setRefreshToken, clearTokens, setRememberMe } from '../utils/tokenStorage.js';

const USER_KEY = 'authUser';

const getStorage = () => {
  const rememberMe = localStorage.getItem('rememberMe') === 'true';
  return rememberMe ? localStorage : sessionStorage;
};

const readStoredUser = () => {
  const rawUser = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  if (!rawUser) return null;
  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
};

let state = {
  token: getAccessToken(),
  user: readStoredUser(),
  isAuthLoading: true, // initial loading state
};

const listeners = new Set();

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

const setState = (nextState) => {
  state = {
    ...state,
    ...nextState,
  };
  emitChange();
};

export const authStore = {
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return state;
  },
  getToken() {
    return state.token;
  },
  getUser() {
    return state.user;
  },
  getIsAuthLoading() {
    return state.isAuthLoading;
  },
  setAuthLoading(isLoading) {
    setState({ isAuthLoading: isLoading });
  },
  setSession({ accessToken, refreshToken, user, rememberMe = false }) {
    authStore.clearSession(false);

    setRememberMe(rememberMe);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    if (user) {
      const storage = getStorage();
      storage.setItem(USER_KEY, JSON.stringify(user));
    }

    setState({ token: accessToken || null, user: user || null });
  },
  setToken(accessToken) {
    setState({ token: accessToken || null });
  },
  setUser(user) {
    if (user) {
      const storage = getStorage();
      storage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(USER_KEY);
    }
    setState({ user: user || null });
  },
  clearSession(emit = true) {
    clearTokens();
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);

    state = { token: null, user: null, isAuthLoading: false };
    if (emit) emitChange();
  },
};
