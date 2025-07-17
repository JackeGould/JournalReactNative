import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Pressable,
  TextInput,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { gql, useQuery, useMutation } from '@apollo/client';
import { uploadImageToServer } from "../../utils/uploadImageToServer";
import { Picker } from '@react-native-picker/picker'; // Native mobile dropdown

// Mood options the user can choose from daily
export const moods = [
  { label: "Happy", value: "happy", color: "#FFC107", emoji: "😊" },          // Amber / Golden Yellow
  { label: "Excited", value: "excited", color: "#FFB347", emoji: "🤩" },      // Warm Peach / Orange
  { label: "Loved", value: "loved", color: "#FF8FAB", emoji: "🥰" },          // Soft Pink / Rose
  { label: "Grateful", value: "grateful", color: "#A3D977", emoji: "🙏" },    // Spring Green / Light Olive
  { label: "Calm", value: "calm", color: "#81D4FA", emoji: "😌" },            // Sky Blue / Light Blue
  { label: "Content", value: "content", color: "#9FE2BF", emoji: "🙂" },      // Mint Green / Seafoam
  { label: "Motivated", value: "motivated", color: "#A5D6A7", emoji: "💪" },  // Soft Green / Sage
  { label: "Neutral", value: "neutral", color: "#B0BEC5", emoji: "😐" },      // Cool Gray / Blue Gray
  { label: "Tired", value: "tired", color: "#D1C4E9", emoji: "🥱" },          // Lavender / Soft Purple
  { label: "Stressed", value: "stressed", color: "#EF9A9A", emoji: "😫" },    // Coral / Pale Red
  { label: "Anxious", value: "anxious", color: "#FFCA28", emoji: "😰" },      // Yellow Gold / Bright Mustard
  { label: "Sad", value: "sad", color: "#90CAF9", emoji: "😢" },              // Soft Blue / Powder Blue
  { label: "Lonely", value: "lonely", color: "#B0BEC5", emoji: "😔" },        // Cool Gray / Blue Gray (shared with Neutral)
  { label: "Angry", value: "angry", color: "#E57373", emoji: "😡" },          // Muted Red / Dusty Red
  { label: "Overwhelmed", value: "overwhelmed", color: "#CE93D8", emoji: "😵‍💫" }, // Soft Purple / Orchid
];

// GraphQL queries and mutations
const UPDATE_MOOD = gql`mutation UpdateMood($mood: String!, $moodDate: String!) { updateMood(mood: $mood, moodDate: $moodDate) { mood moodDate } }`;
const UPDATE_BIO = gql`mutation UpdateBio($bio: String!) { updateBio(bio: $bio) { bio } }`;
const UPDATE_PROFILE_IMAGE = gql`mutation UpdateProfileImage($imageUrl: String!) { updateProfileImage(imageUrl: $imageUrl) { profileImage } }`;
const GET_ME = gql`query GetMe { me { username email profileImage bio mood moodDate } }`;

const Profile = () => {
  // GraphQL data
  const { loading, error, data, refetch } = useQuery(GET_ME, {
    fetchPolicy: 'network-only',
    context: { credentials: 'include' },
  });

  // State for user profile
  const [image, setImage] = useState<string | null>(null);
  const [bio, setBio] = useState('');
  const [editingBio, setEditingBio] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null); // saved mood
  const [tempMood, setTempMood] = useState<string | null>(null); // unsaved mood

  // Get today's date
  const today = new Date().toISOString().split("T")[0];

  // GraphQL mutations
  const [updateProfileImage] = useMutation(UPDATE_PROFILE_IMAGE);
  const [updateBio] = useMutation(UPDATE_BIO);
  const [updateMood] = useMutation(UPDATE_MOOD);

  // Load initial user data into local state
  useEffect(() => {
    if (data?.me?.profileImage) setImage(data.me.profileImage);
    if (data?.me?.bio) setBio(data.me.bio);
    if (data?.me?.mood && data?.me?.moodDate === today) {
      setSelectedMood(data.me.mood);
      setTempMood(data.me.mood);
    }
  }, [data, today]);

  // Image selection and upload
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Permission is required to access photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      try {
        const uploadedUrl = await uploadImageToServer(uri);
        await updateProfileImage({ variables: { imageUrl: uploadedUrl } });
        refetch();
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }
  };

  // Save updated bio
  const handleBioSave = async () => {
    try {
      await updateBio({ variables: { bio } });
      setEditingBio(false);
      refetch();
    } catch (err) {
      console.error("Failed to update bio:", err);
    }
  };

  // Save selected mood
  const handleMoodChange = async (moodValue: string) => {
    setSelectedMood(moodValue);
    try {
      await updateMood({ variables: { mood: moodValue, moodDate: today } });
      refetch();
    } catch (err) {
      console.error("Failed to update mood:", err);
    }
  };

  const moodDetails = moods.find((mood) => mood.value === selectedMood);
  const { username } = data?.me || {};

  if (loading) return <ActivityIndicator style={styles.loading} />;
  if (error) return <Text style={styles.error}>Failed to load profile 😞</Text>;

  return (
    <View style={styles.container}>
      {/* Profile Image Picker */}
      <Pressable onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.plus}>＋</Text>
          </View>
        )}
      </Pressable>
      <Text style={styles.changePhoto}>Tap to add photo</Text>

      {/* Username */}
      <Text style={[styles.title, selectedMood && { color: '#1a1a1a' }]}>
        {username?.charAt(0).toUpperCase() + username?.slice(1)}&apos;s Journal
      </Text>

      {/* Bio Editor */}
      {editingBio ? (
        <>
          <TextInput
            style={styles.bioInput}
            value={bio}
            onChangeText={setBio}
            placeholder="Enter your bio"
            multiline
          />
          <Pressable onPress={handleBioSave}>
            <Text style={styles.saveButton}>Save</Text>
          </Pressable>
        </>
      ) : (
        <Pressable onPress={() => setEditingBio(true)}>
          <Text style={styles.bio}>{bio || "Tap to add a bio"}</Text>
        </Pressable>
      )}

      {/* Mood Picker */}
      <View style={styles.moodTrackerContainer}>
        {!selectedMood && (
          <>
            <Text style={styles.moodPrompt}>How are you feeling today?</Text>
            <View style={{ borderWidth: 1, borderRadius: 8, marginBottom: 12, overflow: 'hidden' }}>
              <Picker
                selectedValue={tempMood}
                onValueChange={(value) => setTempMood(value)}
              >
                <Picker.Item label="Select your mood" value="" color="#555" />
                  {moods.map((mood) => (
                    <Picker.Item
                      key={mood.value}
                      label={`${mood.label} ${mood.emoji}`}
                      value={mood.value}
                      color="#000" 
                    />
                  ))}
              </Picker>
            </View>
            <Pressable onPress={() => tempMood && handleMoodChange(tempMood)}>
              <Text style={styles.saveButton}>Confirm Mood</Text>
            </Pressable>
          </>
        )}

        {selectedMood && (
          <>
            <Text style={styles.moodReflectionText}>
              You&apos;re feeling{' '}
              <Text style={{ fontWeight: 'bold', color: moodDetails?.color || '#333' }}>
                {moodDetails?.label} <Text style={{ color: '#000' }}>{moodDetails?.emoji}</Text>
              </Text>{' '}
              today.
            </Text>
            <Pressable onPress={() => setSelectedMood(null)}>
              <Text style={styles.changeMoodButton}>Change Mood</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};

export default Profile;


const styles = StyleSheet.create({
  // Main screen layout
  container: {
    flex: 1,                        // Fill entire screen vertically
    alignItems: 'center',           // Center children horizontally
    paddingTop: 80,                 // Top spacing for profile content
    paddingHorizontal: 20,          // Left/right spacing for consistent margin
  },

  // Loading indicator alignment
  loading: {
    flex: 1,
    justifyContent: 'center',       // Vertically center the spinner
  },

  // Error message styling
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 40,
  },

  // Profile image styling
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,               // Circular image
    marginBottom: 8,
  },

  // Placeholder circle when no image is set
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',        // Light gray placeholder
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  // "+" icon for avatar placeholder
  plus: {
    fontSize: 32,
    color: '#888',                  // Medium gray
  },

  // Caption under avatar for changing photo
  changePhoto: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },

  // Profile title / username
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Bio display (non-edit mode)
  bio: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 8,
    fontStyle: 'italic',
  },

  // Bio input field (edit mode)
  bioInput: {
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    width: '100%',                  // Full width input
    marginVertical: 8,
    minHeight: 60,                  // Ensures enough space for multi-line input
    textAlignVertical: 'top',       // Align text to top when multiline
  },

  // Save button under bio input
  saveButton: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },

  // Wrapper for mood section
  moodTrackerContainer: {
    marginTop: 20,
    width: '100%',
    zIndex: 10,              // <--- important!
    position: 'relative',    // <--- needed on iOS
  },

  // Prompt asking user how they're feeling
  moodPrompt: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },

  // Mood selection dropdown (picker input)
  dropdown: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 8,
    paddingRight: 30,               // Space for dropdown arrow
    marginBottom: 12,
    color: '#888',
  },

  // Mood summary ("You're feeling X today")
  moodReflection: {
    fontSize: 16,
    textAlign: 'center',
  },

  // "Change Mood" button under reflection text
  changeMoodButton: {
    marginTop: 8,
    textAlign: 'center',
    textDecorationLine: 'underline', // Underlined to suggest interactivity
  },

  // Wrapper for the mood reflection sentence
  moodReflectionText: {
    fontSize: 16,
    textAlign: 'center',
  },
});