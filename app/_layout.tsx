import { Stack } from "expo-router";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getItemAsync } from "expo-secure-store";
import { useEffect, useState } from "react";
import "./globals.css";
import Constants from 'expo-constants';

const TOKEN_KEY = "userToken";

export default function RootLayout() {
  const [client, setClient] = useState<ApolloClient<any> | null>(null);

  useEffect(() => {
    const setupApollo = async () => {
      const httpLink = createHttpLink({
        uri: `http://${Constants.expoConfig?.extra?.localIP}:4000/graphql`, // Replace with your machine's actual local IP
      });

      const authLink = setContext(async (_, { headers }) => {
        const token = await getItemAsync(TOKEN_KEY);
        console.log("📤 Sending token in header:", token);

        return {
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
          },
        };
      });

      const apolloClient = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
      });

      setClient(apolloClient);
    };

    setupApollo();
  }, []);

  if (!client) return null;

  return (
    <ApolloProvider client={client}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </ApolloProvider>
  );
}