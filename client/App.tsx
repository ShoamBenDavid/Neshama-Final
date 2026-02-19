import { I18nManager } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import './global.css';
import StackNavigator from './app/navigation/StackNavigator';
import { store } from './app/store/store';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </Provider>
  );
}
