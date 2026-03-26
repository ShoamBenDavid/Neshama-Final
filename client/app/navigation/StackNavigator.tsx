import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import { useAppSelector, useAppDispatch } from '../store/hooks';
import { checkAuthStatus } from '../store/slices/authSlice';
import { colors } from '../theme/colors';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

import BottomTabNavigator from './BottomTabNavigator';

import ChatScreen from '../screens/ChatScreen';
import ContentLibraryScreen from '../screens/ContentLibraryScreen';
import JournalEntryScreen from '../screens/JournalEntryScreen';
import CreateJournalScreen from '../screens/CreateJournalScreen';
import ForumPostScreen from '../screens/ForumPostScreen';
import CreateForumPostScreen from '../screens/CreateForumPostScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ForumScreen from '../screens/ForumScreen'; 
import BreathingExercisesScreen from '../screens/BreathingExercisesScreen';
import BreathingSessionScreen from '../screens/BreathingSessionScreen';
import MeditationLibraryScreen from '../screens/MeditationLibraryScreen';
import MeditationSessionScreen from '../screens/MeditationSessionScreen';
import YogaSessionsScreen from '../screens/YogaSessionsScreen';
import YogaDetailScreen from '../screens/YogaDetailScreen';
import ArticlesScreen from '../screens/ArticlesScreen';
import ArticleDetailScreen from '../screens/ArticleDetailScreen';
import AudioRelaxationScreen from '../screens/AudioRelaxationScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  Forum: undefined;
  Chat: undefined;
  ContentLibrary: undefined;
  JournalEntry: { entryId: string };
  CreateJournal: { initialMood?: number };
  ForumPost: { postId: string };
  CreateForumPost: undefined;
  Profile: undefined;
  Settings: undefined;
  BreathingExercises: undefined;
  BreathingSession: { exerciseId: string };
  MeditationLibrary: undefined;
  MeditationSession: { sessionId: string };
  YogaSessions: undefined;
  YogaDetail: { sessionId: string };
  Articles: undefined;
  ArticleDetail: { articleId: string };
  AudioRelaxation: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function MainAppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Forum" component={ForumScreen} />
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="ContentLibrary" component={ContentLibraryScreen} />
      <Stack.Screen name="JournalEntry" component={JournalEntryScreen} />
      <Stack.Screen name="CreateJournal" component={CreateJournalScreen} />
      <Stack.Screen name="ForumPost" component={ForumPostScreen} />
      <Stack.Screen name="CreateForumPost" component={CreateForumPostScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="BreathingExercises" component={BreathingExercisesScreen} />
      <Stack.Screen name="BreathingSession" component={BreathingSessionScreen} />
      <Stack.Screen name="MeditationLibrary" component={MeditationLibraryScreen} />
      <Stack.Screen name="MeditationSession" component={MeditationSessionScreen} />
      <Stack.Screen name="YogaSessions" component={YogaSessionsScreen} />
      <Stack.Screen name="YogaDetail" component={YogaDetailScreen} />
      <Stack.Screen name="Articles" component={ArticlesScreen} />
      <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} />
      <Stack.Screen name="AudioRelaxation" component={AudioRelaxationScreen} />
    </Stack.Navigator>
  );
}

export default function StackNavigator() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isCheckingAuth } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  if (isCheckingAuth) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <MainAppNavigator /> : <AuthNavigator />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
