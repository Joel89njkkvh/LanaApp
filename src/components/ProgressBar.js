// components/ProgressBar.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '../config/colors';

export default function ProgressBar({ 
  progress, 
  color = colors.primary, 
  height = 8, 
  backgroundColor = '#E0E0E0' 
}) {
  const progressPercentage = Math.max(0, Math.min(progress * 100, 100));

  return (
    <View style={[styles.container, { height, backgroundColor }]}>
      <View 
        style={[
          styles.progress, 
          { 
            width: `${progressPercentage}%`, 
            backgroundColor: color,
            height: height 
          }
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: 10,
    transition: 'width 0.3s ease',
  },
});