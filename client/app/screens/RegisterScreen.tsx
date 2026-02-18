import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import Text from '../components/Text';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import colors from '../config/colors';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { registerUser, clearError } from '../store/slices/authSlice';
import { RootStackParamList } from '../navigation/StackNavigator';

interface RegisterScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const validateForm = (): boolean => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!password) {
      Alert.alert('Error', 'Please enter a password');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    const result = await dispatch(
      registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
      })
    );

    if (registerUser.fulfilled.match(result)) {
      // Navigation will be handled by the auth state change
    }
  };

  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary, colors.lightPurple]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>הרשמה</Text>
            <Text style={styles.subtitle}>צרו חשבון חדש</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <FormInput
              label="שם מלא"
              placeholder="הכניסו את השם שלכם"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <FormInput
              label="אימייל"
              placeholder="הכניסו את האימייל שלכם"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <FormInput
              label="טלפון (אופציונלי)"
              placeholder="הכניסו את מספר הטלפון"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <FormInput
              label="סיסמה"
              placeholder="בחרו סיסמה (לפחות 6 תווים)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <FormInput
              label="אימות סיסמה"
              placeholder="הכניסו את הסיסמה שוב"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <Button
              title={isLoading ? '' : 'הרשמה'}
              onPress={handleRegister}
              color="primary"
            />

            {isLoading && (
              <ActivityIndicator
                size="small"
                color={colors.primary}
                style={styles.loader}
              />
            )}

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>או</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginLinkText}>
                יש לכם כבר חשבון?{' '}
                <Text style={styles.loginLinkHighlight}>התחברו</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: colors.white,
    opacity: 0.9,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  loader: {
    marginTop: 10,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray[200],
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.text.secondary,
    fontSize: 14,
  },
  loginLink: {
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  loginLinkHighlight: {
    color: colors.primary,
    fontWeight: '600',
  },
});

