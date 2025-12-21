import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/DashboardScreen';
import JournalScreen from '../screens/JournalScreen';
import ForumScreen from '../screens/ForumScreen';
import SupportCenterScreen from '../screens/SupportCenterScreen';
import ContentLibraryScreen from '../screens/ContentLibraryScreen';

export type RootStackParamList = {
  Dashboard: undefined;
  Journal: undefined;
  Forum: undefined;
  SupportCenter: undefined;
  ContentLibrary: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
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
    </Stack.Navigator>
  );
}

