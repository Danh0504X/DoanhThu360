const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const USERS_ENDPOINT = `${API_URL}/users`;

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export const getUsers = () => request(USERS_ENDPOINT);

export const getUserById = (id) => request(`${USERS_ENDPOINT}/${id}`);

export const createUser = (payload) =>
  request(USERS_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateUser = (id, payload) =>
  request(`${USERS_ENDPOINT}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

export const deleteUser = (id) =>
  request(`${USERS_ENDPOINT}/${id}`, {
    method: 'DELETE',
  });
