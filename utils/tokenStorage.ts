import {
  setItemAsync,
  getItemAsync,
  deleteItemAsync,
} from "expo-secure-store";

const TOKEN_KEY = "userToken";

// Optional: Add back basic JWT validation
const isValidJWT = (token: string) => {
  return typeof token === "string" && token.split(".").length === 3;
};

export const saveToken = async (token: string) => {
  if (isValidJWT(token)) {
    await setItemAsync(TOKEN_KEY, token);
    console.log("✅ Token saved to SecureStore:", token);
  } else {
    console.warn("⚠️ Invalid token format, not saving:", token);
  }
};

export const getToken = async () => {
  const token = await getItemAsync(TOKEN_KEY);
  if (token) {
    console.log("🔑 Retrieved token from SecureStore:", token);
  } else {
    console.log("🔑 No token found in SecureStore.");
  }
  return token;
};

export const removeToken = async () => {
  await deleteItemAsync(TOKEN_KEY);
  console.log("🗑️ Token removed from SecureStore.");
};



