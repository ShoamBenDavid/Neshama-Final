import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import './global.css';
import StackNavigator from './app/navigation/StackNavigator';
import { store } from './app/store/store';
import { LanguageProvider } from './app/i18n';

export default function App() {
  return (
    <Provider store={store}>
      <LanguageProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </LanguageProvider>
    </Provider>
  );
}
