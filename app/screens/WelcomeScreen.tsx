import React from 'react';
import { View, ImageBackground, Image, StyleSheet } from 'react-native';

import Text from '../components/Text';
import Button from '../components/Button';

interface WelcomeScreenProps {
  navigaton: any;
}

export default function WelcomeScreen({ navigaton }: WelcomeScreenProps) {
  return (
    <ImageBackground
      blurRadius={10}
      source={require('***')}
      style={styles.background}
    >
      <View style={styles.logoContainer}>
        <Image source={require('***')} style={styles.logo} />
        <Text style={styles.tagline}>סלוגן על נשמה או משהו אחר אופציה ? </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={() => console.log('Login Pressed')} />
        <Button
          title="Register"
          onPress={() => console.log('Register Pressed')}
          color="secondary"
        />
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonContainer: {
    padding: 20,
    width: '100%',
  },
  logo: {
    height: 100,
    width: 100,
  },
  logoContainer: {
    position: 'absolute',
    top: 70,
    alignItems: 'center',
  },
  tagline: {
    fontSize: 25,
    fontWeight: '600',
    paddingVertical: 20,
  },
});
