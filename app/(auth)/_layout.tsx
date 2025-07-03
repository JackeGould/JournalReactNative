// app/(auth)/_layout.tsx
import { Stack } from "expo-router";

export const unstable_settings = {
  // This hides the (auth) folder name from header titles
  initialRouteName: "index",
};

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Welcome",
          headerShown: false, // You can set to true if you want a header
        }}
      />
    </Stack>
  );
}


