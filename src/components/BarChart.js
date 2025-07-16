import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BarChart({ data, barColor = '#A57C36' }) {
  return (
    <View style={styles.barChart}>
      {data.map(({ label, value }, index) => (
        <View key={index} style={styles.barContainer}>
          <View style={[styles.bar, { height: value, backgroundColor: barColor }]} />
          <Text style={styles.barLabel}>{label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    alignItems: 'flex-end',
    height: 160,
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderRadius: 12,
    elevation: 2,
  },
  barContainer: {
    alignItems: 'center',
  },
  bar: {
    width: 18,
    borderRadius: 4,
  },
  barLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#555',
  },
});