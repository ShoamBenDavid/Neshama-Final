import React from 'react';
import { Text, TextProps as RNTextProps } from 'react-native';

import defaultStyles from '../config/styles';

interface TextProps extends RNTextProps {
  children?: React.ReactNode;
}

export default function AppText({ children, style, ...otherProps }: TextProps) {
  return (
    <Text style={[defaultStyles.text, style]} {...otherProps}>
      {children}
    </Text>
  );
}
