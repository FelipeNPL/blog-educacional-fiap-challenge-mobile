import api from "./api";

export interface Post {
  id?: string | number;
  _id?: string;
  title: string;
  content: string;
  author: string;
  createdAt?: string;
}

export const getPosts = async (search: string = ""): Promise<Post[]> => {
  const url = search ? `/posts/search?keyword=${search}` : "/posts";
  const response = await api.get<Post[]>(url);
  console.log("Fetched posts:", response.data);
  return response.data;
};

export const getPostById = async (id: string | number): Promise<Post> => {
  const response = await api.get<Post>(`/posts/${id}`);
  return response.data;
};

export const createPost = async (postData: Omit<Post, "id" | "_id">): Promise<Post> => {
  const response = await api.post<Post>("/posts", postData);
  return response.data;
};

export const updatePost = async (
  id: string | number,
  postData: Partial<Post>,
): Promise<Post> => {
  const response = await api.put<Post>(`/posts/${id}`, postData);
  return response.data;
};

export const deletePost = async (id: string | number): Promise<void> => {
  await api.delete(`/posts/${id}`);
};
