import api from "./api";

export interface User {
  id: string | number;
  _id?: string;
  name: string;
  email: string;
  role: "professor" | "student";
}

export interface PaginatedUsers {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

export const getUsers = async (
  role?: string,
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedUsers> => {
  const params = new URLSearchParams();
  if (role) params.append("role", role);
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const response = await api.get<PaginatedUsers>(`/users?${params.toString()}`);
  console.log("Fetched users:", response.data);
  return response.data;
};

export const createUser = async (userData: any): Promise<User> => {
  const response = await api.post<User>("/users", userData);
  return response.data;
};

export const updateUser = async (
  id: string | number,
  userData: any,
): Promise<User> => {
  const response = await api.put<User>(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: string | number): Promise<void> => {
  await api.delete(`/users/${id}`);
};
