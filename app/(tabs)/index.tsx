import { Text, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center space-y-4">
      <Text className="text-5xl text-accent font-bold">Pineapple</Text>

      <TouchableOpacity onPress={() => router.push("/newEntry")}>
        <Text className="text-black text-lg">New Entry</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/profile")}>
        <Text className="text-black text-lg">Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/offline")}>
        <Text className="text-black text-lg">Offline</Text>
      </TouchableOpacity>
    </View>
  );
}



