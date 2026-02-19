import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import { useAppSelector, useAppDispatch } from '../store/hooks';
import { checkAuthStatus } from '../store/slices/authSlice';
import colors from '../config/colors';

// Auth Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// App Screens
import DashboardScreen from '../screens/DashboardScreen';
import JournalScreen from '../screens/JournalScreen';
import ForumScreen from '../screens/ForumScreen';
import SupportCenterScreen from '../screens/SupportCenterScreen';
import ContentLibraryScreen from '../screens/ContentLibraryScreen';
import ChatScreen from '../screens/ChatScreen';

export type RootStackParamList = {
  // Auth Screens
  Login: undefined;
  Register: undefined;
  // App Screens
  Dashboard: undefined;
  Journal: undefined;
  Forum: undefined;
  SupportCenter: undefined;
  ContentLibrary: undefined;
  Chat: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Loading screen while checking auth status
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

// Auth Navigator - screens for non-authenticated users
function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// App Navigator - screens for authenticated users
function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Journal" component={JournalScreen} />
      <Stack.Screen name="Forum" component={ForumScreen} />
      <Stack.Screen name="SupportCenter" component={SupportCenterScreen} />
      <Stack.Screen name="ContentLibrary" component={ContentLibraryScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}

export default function StackNavigator() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isCheckingAuth } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check if user is already logged in on app start
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // Show loading screen while checking auth status
  if (isCheckingAuth) {
    return <LoadingScreen />;
  }

  // Return appropriate navigator based on auth status
  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
