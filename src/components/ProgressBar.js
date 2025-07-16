import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function ProgressBar({ progress }) {
  const percentage = Math.min(Math.max(progress, 0), 1) * 100;
  return (
    <View style={styles.background}>
      <View style={[styles.fill, { width: `${percentage}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#A57C36',
  },
});