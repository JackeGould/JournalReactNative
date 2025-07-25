import React, { useCallback, useMemo, useState } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useQuery, gql } from "@apollo/client";
import dayjs from "dayjs";
import { Calendar } from "react-native-calendars";

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

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [showCalendar, setShowCalendar] = useState<boolean>(true);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const posts = useMemo(() => data?.postsByMe || [], [data]);

  const markedDates = useMemo(() => {
    const marks: { [key: string]: any } = {};

    posts.forEach((post) => {
      const dateKey = dayjs(post.createdAt).format("YYYY-MM-DD");
      marks[dateKey] = {
        ...(marks[dateKey] || {}),
        marked: true,
        dotColor: "#007aff", // can be replaced later
      };
    });

    if (selectedDate) {
      marks[selectedDate] = {
        ...(marks[selectedDate] || {}),
        selected: true,
        selectedColor: "#007aff",
      };
    }

    return marks;
  }, [posts, selectedDate]);

  const hasPostToday = posts.some(
    (post) =>
      dayjs(post.createdAt).format("YYYY-MM-DD") ===
      dayjs().format("YYYY-MM-DD")
  );

  const filteredPosts = useMemo(() => {
    if (!selectedDate) {
      return [...posts].sort(
        (a, b) =>
          dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
      );
    }

    return posts.filter(
      (post) =>
        dayjs(post.createdAt).format("YYYY-MM-DD") === selectedDate
    );
  }, [posts, selectedDate]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text>Your Posts</Text>
      </View>

      {!hasPostToday && !selectedDate && (
        <View style={styles.reminderBox}>
          <Text>Don&apos;t forget to write your post for today!</Text>
        </View>
      )}

      <TouchableOpacity
        onPress={() => setShowCalendar((prev) => !prev)}
        style={styles.toggleButton}
      >
        <Text>{showCalendar ? "Hide Calendar ▲" : "Show Calendar ▼"}</Text>
      </TouchableOpacity>

      {showCalendar && (
        <Calendar
          markedDates={markedDates}
          onDayPress={(day) => {
            setSelectedDate((prev) =>
              prev === day.dateString ? null : day.dateString
            );
            setSelectedPost(null);
          }}
          style={styles.calendar}
        />
      )}

      <View style={styles.postList}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : selectedPost ? (
          <View style={styles.selectedPost}>
            <Text>{selectedPost.title}</Text>
            <Text>{dayjs(selectedPost.createdAt).format("MMMM D, YYYY")}</Text>
            <Text>{selectedPost.message}</Text>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.editButton} onPress={() => {}}>
                <Text>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => {}}>
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setSelectedPost(null)}>
              <Text>← Back to list</Text>
            </TouchableOpacity>
          </View>
        ) : filteredPosts.length === 0 ? (
          <Text>No posts found for {selectedDate}.</Text>
        ) : (
          filteredPosts.map((item) => (
            <Pressable
              key={item._id}
              onPress={() => setSelectedPost(item)}
              style={styles.postItem}
            >
              <Text>{item.title}</Text>
              <Text>{dayjs(item.createdAt).format("MMM D, YYYY")}</Text>
              <Text numberOfLines={2} ellipsizeMode="tail">
                {item.message}
              </Text>
            </Pressable>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  reminderBox: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  toggleButton: {
    alignSelf: "flex-end",
    marginBottom: 8,
  },
  calendar: {
    borderRadius: 10,
    marginBottom: 16,
  },
  postList: {
    marginTop: 16,
  },
  postItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedPost: {
    padding: 16,
    borderRadius: 8,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
    gap: 12,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
});

