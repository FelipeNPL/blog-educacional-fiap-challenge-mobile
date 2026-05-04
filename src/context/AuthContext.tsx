import React from "react";
import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { storage } from "../utils/storage";
import api from "../services/api";
import { getErrorMessage } from "../utils/errors";

interface User {
  id: string | number;
  name: string;
  email: string;
  role: "professor" | "student";
  token?: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  isProfessor: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const authDataSerialized = await storage.getItem("userData");
      if (authDataSerialized) {
        const authData: User = JSON.parse(authDataSerialized);
        setUser(authData);
      }
    } catch (error) {
      console.error("Failed to load storage data", error);
    } finally {
      setLoading(false);
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      console.log("Login response:", response.data);
      const { access_token, user: rawUser } = response.data;

      // The backend returns user data inside a _doc property for Mongoose objects
      const userData = rawUser._doc || rawUser;

      const userWithToken: User = {
        id: userData._id || userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        token: access_token,
      };

      await storage.setItem("userToken", access_token);
      await storage.setItem("userData", JSON.stringify(userWithToken));

      setUser(userWithToken);
      return { success: true };
    } catch (error) {
      console.error("Login error", error);
      return {
        success: false,
        message: getErrorMessage(
          error,
          "Login failed. Please check your credentials.",
        ),
      };
    }
  };

  const logout = async () => {
    await storage.deleteItem("userToken");
    await storage.deleteItem("userData");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isProfessor: user?.role === "professor",
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
