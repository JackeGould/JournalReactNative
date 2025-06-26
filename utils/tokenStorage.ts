import {
  setItemAsync,
  getItemAsync,
  deleteItemAsync,
} from "expo-secure-store";

const TOKEN_KEY = "userToken";

// Basic JWT format checker: header.payload.signature
const isValidJWT = (token: string) => {
  return /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token);
};

export const saveToken = async (token: string) => {
  if (isValidJWT(token)) {
    await setItemAsync(TOKEN_KEY, token);
    console.log("✅ Token saved to SecureStore.");
  } else {
    console.warn("⚠️ Attempted to save invalid JWT:", token);
  }
};

export const getToken = async () => {
  const token = await getItemAsync(TOKEN_KEY);
  console.log("🔑 Retrieved token from SecureStore:", token);
  return token;
};

export const removeToken = async () => {
  await deleteItemAsync(TOKEN_KEY);
  console.log("🗑️ Token removed from SecureStore.");
};


