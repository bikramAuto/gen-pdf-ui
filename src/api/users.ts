import { apiClient, RequestOptions } from './client';

export interface CreateUserDTO {
  name: string;
  email: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  message?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export const createUser = async (data: CreateUserDTO & { publicKey?: JsonWebKey }, options: RequestOptions = {}): Promise<UserResponse> => {
  return apiClient<UserResponse>('/users/create', {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const setPassword = async (id: string, token: string, password: string): Promise<any> => {
  return apiClient(`/users/set-password?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify({ password }),
    headers: { Authorization: `${token}` }
  });
};

export const loginUser = async (data: { email: string; password: string; publicKey?: JsonWebKey }, options: RequestOptions = {}): Promise<any> => {
  return apiClient('/users/login', {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
};
