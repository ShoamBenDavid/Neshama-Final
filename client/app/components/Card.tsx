import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import colors from '../config/colors';
import Text from './Text';

interface CardProps {
  title: any;
  subTitle: any;
  imageUrl: any;
  onPress: any;
}

export default function Card({
  title,
  subTitle,
  imageUrl,
  onPress,
}: CardProps) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.card}>
        {imageUrl ? (
          <Image style={styles.image} source={{ uri: imageUrl }} />
        ) : (
          <View style={[styles.image, { backgroundColor: colors.gray[200] }]} />
        )}
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subTitle}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    backgroundColor: colors.white,
    marginBottom: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    marginBottom: 7,
    fontWeight: '500',
  },
  subtitle: {
    color: colors.secondary,
    fontWeight: 'bold',
    fontSize: 20,
  },
});
