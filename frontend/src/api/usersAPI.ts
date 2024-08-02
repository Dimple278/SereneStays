import axios from "axios";
import { IUser } from "../interfaces/users";

const token = localStorage.getItem("token");

export async function fetchUserById(userId: string) {
  const response = await axios.get(`/api/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function updateUser(userId: string, formData: FormData) {
  await axios.put(`/api/users/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function fetchUsers(
  page: number,
  limit: number
): Promise<{ users: IUser[]; totalCount: number }> {
  const response = await axios.get(`/api/users?page=${page}&limit=${limit}`);
  return response.data;
}
