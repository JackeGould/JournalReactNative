
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-5xl text-accent font-bold">Pineapple</Text>
      <Link href="/_signUp">Sign Up</Link>
      <Link href="/_login">Log In</Link>
      <Link href="/newEntry">New Entry</Link>
      <Link href="/profile">Profile</Link>
      <Link href="/offline">Offline</Link>
    </View>
  );
}
