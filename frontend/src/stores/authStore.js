const TOKEN_KEY = 'accessToken';
const USER_KEY = 'authUser';
const REMEMBER_KEY = 'rememberMe';

const getStorage = (rememberMe) => (rememberMe ? localStorage : sessionStorage);

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
  token: localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY),
  user: readStoredUser(),
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
  setSession({ accessToken, user, rememberMe = false }) {
    authStore.clearSession(false);

    const storage = getStorage(rememberMe);

    if (accessToken) {
      storage.setItem(TOKEN_KEY, accessToken);
    }

    if (user) {
      storage.setItem(USER_KEY, JSON.stringify(user));
    }

    localStorage.setItem(REMEMBER_KEY, String(rememberMe));
    setState({ token: accessToken || null, user: user || null });
  },
  setUser(user) {
    const rememberMe = localStorage.getItem(REMEMBER_KEY) === 'true';
    const storage = getStorage(rememberMe);

    if (user) {
      storage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      storage.removeItem(USER_KEY);
    }

    setState({ user: user || null });
  },
  clearSession(emit = true) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(REMEMBER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);

    state = { token: null, user: null };
    if (emit) emitChange();
  },
};
