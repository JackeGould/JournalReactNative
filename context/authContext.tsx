import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { ApolloClient } from "@apollo/client";
import { getToken, saveToken, removeToken } from "../utils/tokenStorage";
import { createApolloClient } from "../lib/apolloClient";

interface AuthContextType {
  user: { token: string } | null;
  userToken: string | null;
  apolloClient: ApolloClient<any> | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  resetClient: () => Promise<void>; // ✅ NEW
  authLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<{ token: string } | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [apolloClient, setApolloClient] = useState<ApolloClient<any> | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const initClient = async () => {
    const token = await getToken();
    setUserToken(token);

    if (token) {
      setUser({ token });
    } else {
      setUser(null);
    }

    const client = createApolloClient(token);
    setApolloClient(client);

    console.log("🔄 Apollo client (re)initialized.");
  };

  useEffect(() => {
    (async () => {
      await initClient();
      setAuthLoading(false);
    })();
  }, []);

  const login = async (token: string) => {
    await saveToken(token);
    setUserToken(token);
    setUser({ token });

    const client = createApolloClient(token);
    setApolloClient(client);

    console.log("✅ Logged in and Apollo client rebuilt.");
  };

  const logout = async () => {
    await removeToken();
    setUserToken(null);
    setUser(null);

    const client = createApolloClient(null);
    setApolloClient(client);

    console.log("🗑️ Logged out and Apollo client rebuilt.");
  };

  const resetClient = initClient; // ✅ expose client reinit

  return (
    <AuthContext.Provider
      value={{ user, userToken, apolloClient, login, logout, resetClient, authLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

