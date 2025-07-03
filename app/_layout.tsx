// app/_layout.tsx
import { Stack } from "expo-router";
import { ApolloProvider } from "@apollo/client";
import { useAuth } from "../context/authContext";
import { View, ActivityIndicator } from "react-native";
import "./globals.css";

function RootLayoutNav() {
  const { user, authLoading, apolloClient } = useAuth();

  // 🔐 Wait until both auth and Apollo are ready
  if (authLoading || !apolloClient) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ApolloProvider client={apolloClient}>
      <Stack screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="(tabs)" />
        ) : (
          <Stack.Screen name="(auth)" />
        )}
      </Stack>
    </ApolloProvider>
  );
}

export default function RootLayout() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { AuthProvider } = require("../context/authContext");
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}





