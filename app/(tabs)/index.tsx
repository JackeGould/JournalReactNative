import React, { useCallback } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useQuery, gql } from "@apollo/client";
import dayjs from "dayjs";

const READ_ALL_POSTS = gql`
  query PostsByMe {
    postsByMe {
      _id
      title
      message
      createdAt
    }
  }
`;

type PostItem = {
  _id: string;
  title: string;
  message: string;
  createdAt: string; 
};

type QueryData = {
  postsByMe: PostItem[];
};

export default function Index() {
  const { loading, data, refetch } = useQuery<QueryData>(READ_ALL_POSTS, {
    fetchPolicy: "network-only",
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const posts = data?.postsByMe || [];

  // ✅ Only log after loading completes
  if (!loading) {
    console.log("Today:", dayjs().format("YYYY-MM-DD"));
    console.log("🔍 Raw post createdAt values:", posts.map((p) => p.createdAt));
    console.log(
      "📝 Formatted post dates:",
      posts.map((p) => dayjs(p.createdAt).format("YYYY-MM-DD"))
    );
  }

  const hasPostToday = posts.some(
    (post) =>
      dayjs(post.createdAt).format("YYYY-MM-DD") ===
      dayjs().format("YYYY-MM-DD")
  );

  return (
    <ScrollView className="flex-1 px-6 pt-12 space-y-6">
      <View className="items-center space-y-4">
        <Text className="text-3xl text-accent font-bold">Your Posts</Text>
      </View>

      {!hasPostToday && (
        <View className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mt-6 rounded-md">
          <Text className="text-yellow-900 font-medium text-base">
            Don&apos;t forget to write your post for today!
          </Text>
        </View>
      )}

      <View className="mt-8">
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : posts.length === 0 ? (
          <Text className="text-center text-gray-500">No posts found.</Text>
        ) : (
          posts.map((item) => (
            <View key={item._id} className="bg-gray-100 p-4 rounded-lg mb-4">
              <Text className="text-lg font-bold mb-1">{item.title}</Text>
              <Text className="text-gray-500 text-sm mb-2">
                {dayjs(item.createdAt).format("MMM D, YYYY")}
              </Text>
              <Text className="text-gray-700">{item.message}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}





