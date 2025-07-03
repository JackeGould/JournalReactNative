import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // ✅ Icon library
import { useAuth } from '../../context/authContext'; // ✅ Your AuthContext


const LogoutIcon = () => {
  const { logout } = useAuth();
  const router = useRouter();
 
  const handleLogout = async () => {
    await logout(); // Remove token + clear user
    router.replace("/(auth)");
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
      <Ionicons name="log-out-outline" size={24} color="black" />
    </TouchableOpacity>
  );
};

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerRight: () => <LogoutIcon />, // ✅ Show on all tabs
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="newEntry"
        options={{
          title: 'New Entry',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
};

export default _layout;
