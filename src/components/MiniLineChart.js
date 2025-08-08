import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const MiniLineChart = ({ 
  data, 
  width = Dimensions.get('window').width - 32, 
  height = 120, 
  color = '#4CAF50'
}) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const valueRange = maxValue - minValue || 1;

  return (
    <View style={[styles.container, { width }]}>
      {/* Gráfico de barras simple */}
      <View style={styles.chartArea}>
        <View style={styles.barsContainer}>
          {data.map((item, index) => {
            const barHeight = ((item.value - minValue) / valueRange) * 60; // Max 60px de altura
            return (
              <View key={index} style={styles.barColumn}>
                <View style={styles.barWrapper}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: Math.max(barHeight, 4), // Mínimo 4px
                        backgroundColor: color,
                        opacity: 0.8 + (barHeight / 60) * 0.2 // Más opacidad para valores más altos
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.barLabel}>{item.label}</Text>
                <Text style={styles.barValue}>${item.value > 999 ? `${(item.value/1000).toFixed(1)}k` : item.value}</Text>
              </View>
            );
          })}
        </View>
      </View>
      
      {/* Información adicional */}
      <View style={styles.info}>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Máximo</Text>
            <Text style={[styles.statValue, { color: '#4CAF50' }]}>
              ${maxValue.toLocaleString()}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Mínimo</Text>
            <Text style={[styles.statValue, { color: '#FF5722' }]}>
              ${minValue.toLocaleString()}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Promedio</Text>
            <Text style={styles.statValue}>
              ${Math.round(data.reduce((sum, item) => sum + item.value, 0) / data.length).toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  chartArea: {
    marginBottom: 16,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 80,
    paddingHorizontal: 8,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  barWrapper: {
    height: 60,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  bar: {
    width: '70%',
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  barValue: {
    fontSize: 9,
    color: '#999',
    marginTop: 2,
    textAlign: 'center',
  },
  info: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
});

export default MiniLineChart;