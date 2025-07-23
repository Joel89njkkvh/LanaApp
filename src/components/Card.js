import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../config/colors';

export default function Card({ title, value, change, wide, valueColor }) {
  return (
    <View style={[styles.card, wide && styles.cardWide]}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={[styles.cardValue, valueColor && { color: valueColor }]}>${value}</Text>
      {change !== undefined && change !== 0 && (
        <Text
          style={
            change >= 0 ? styles.cardChangePositive : styles.cardChangeNegative
          }
        >
          {change >= 0 ? `+${change}%` : `${change}%`}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  cardWide: {
    width: '100%',
  },
  cardTitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
  },
  cardChangePositive: {
    color: colors.positive,
    fontSize: 14,
    marginTop: 4,
  },
  cardChangeNegative: {
    color: colors.negative,
    fontSize: 14,
    marginTop: 4,
  },
});