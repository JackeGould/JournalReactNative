import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Constants from "expo-constants";

const IP_ADDRESS = Constants.expoConfig?.extra?.IP_ADDRESS;

console.log("🌍 Using GraphQL URI:", `http://${IP_ADDRESS}:4000/graphql`);

export const createApolloClient = (token: string | null) => {
  const httpLink = createHttpLink({
    uri: `http://${IP_ADDRESS}:4000/graphql`,
    fetchOptions: {
      mode: "cors",
    },
  });

  const authLink = setContext((_, { headers }) => {
    if (token) {
      console.log("📤 Sending token in header:", token);
    }
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    credentials: 'include',
  });
};
