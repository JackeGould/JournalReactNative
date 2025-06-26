// app/(auth)/_layout.tsx
import { Stack, Link } from "expo-router";
import { Text } from "react-native";



export const unstable_settings = {
  // 👇 This hides (auth) from the header trail
  initialRouteName: "login",
};

export default function AuthLayout() {
  return (
    <Stack>
        <Stack.Screen
        name="login"
        options={{
            title: "Login",
            headerLeft: () => (
            <Link href="/" style={{ marginLeft: 10 }}>
                <Text style={{ color: "#007aff" }}>Home</Text>
            </Link>
            ),
        }}
        />
      <Stack.Screen
        name="signUp"
        options={{
          title: "Sign Up",
          headerLeft: () => (
            <Link href="/" style={{ marginLeft: 10 }}>
                <Text style={{ color: "#007aff" }}>Home</Text>
            </Link>
            ),
        }}
      />
    </Stack>
  );
}

