import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "userToken";

// Fallback for web using localStorage
const webStorage = {
  async setItemAsync(key: string, value: string) {
    localStorage.setItem(key, value);
  },
  async getItemAsync(key: string) {
    return localStorage.getItem(key);
  },
  async deleteItemAsync(key: string) {
    localStorage.removeItem(key);
  },
};

// Pick the correct storage depending on platform
const Storage = Platform.OS === "web" ? webStorage : SecureStore;

const isValidJWT = (token: string) => {
  return typeof token === "string" && token.split(".").length === 3;
};

export const saveToken = async (token: string) => {
  if (isValidJWT(token)) {
    await Storage.setItemAsync(TOKEN_KEY, token);
    console.log("✅ Token saved:", token);
  } else {
    console.warn("⚠️ Invalid token format, not saving:", token);
  }
};

export const getToken = async () => {
  const token = await Storage.getItemAsync(TOKEN_KEY);
  console.log(token ? "🔑 Retrieved token:" : "🔑 No token found.");
  return token;
};

export const removeToken = async () => {
  await Storage.deleteItemAsync(TOKEN_KEY);
  console.log("🗑️ Token removed.");
};