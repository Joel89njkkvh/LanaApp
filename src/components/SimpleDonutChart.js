import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SimpleDonutChart = ({ 
  data, 
  size = 140, 
  colors = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C', '#FF6B6B', '#34495E'] 
}) => {
  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2;
  const innerRadius = radius * 0.55;

  // Calcular datos con porcentajes
  const dataWithPercentages = data.map((item, index) => ({
    ...item,
    percentage: (item.value / total) * 100,
    color: colors[index % colors.length]
  }));

  return (
    <View style={styles.container}>
      {/* Gráfico usando círculos de colores superpuestos */}
      <View style={styles.chartContainer}>
        <View style={[styles.chartBase, { width: size, height: size, borderRadius: radius }]}>
          {/* Crear anillos de colores basados en los porcentajes */}
          {dataWithPercentages.map((item, index) => {
            // Calcular el tamaño del anillo basado en el porcentaje acumulativo
            const cumulativePercentage = dataWithPercentages
              .slice(0, index + 1)
              .reduce((sum, d) => sum + d.percentage, 0);
            
            const ringSize = (cumulativePercentage / 100) * (radius - innerRadius) + innerRadius * 2;
            const borderWidth = Math.max(8, (item.percentage / 100) * 25);
            
            return (
              <View
                key={index}
                style={[
                  styles.colorRing,
                  {
                    width: ringSize,
                    height: ringSize,
                    borderRadius: ringSize / 2,
                    borderWidth: borderWidth,
                    borderColor: item.color,
                    borderTopColor: item.color,
                    borderRightColor: index === 0 ? item.color : 'transparent',
                    borderBottomColor: cumulativePercentage > 50 ? item.color : 'transparent',
                    borderLeftColor: cumulativePercentage > 75 ? item.color : 'transparent',
                  }
                ]}
              />
            );
          })}
          
          {/* Centro del gráfico */}
          <View style={[
            styles.centerCircle, 
            { 
              width: innerRadius * 2, 
              height: innerRadius * 2, 
              borderRadius: innerRadius 
            }
          ]}>
            <Text style={styles.totalValue}>
              ${total > 999 ? `${(total/1000).toFixed(1)}k` : total.toLocaleString()}
            </Text>
            <Text style={styles.totalLabel}>Total</Text>
          </View>
        </View>
      </View>

      {/* Barras de progreso coloridas */}
      <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>Distribución</Text>
        <View style={styles.progressContainer}>
          {dataWithPercentages.map((item, index) => (
            <View key={index} style={styles.progressItem}>
              <View 
                style={[styles.colorDot, { backgroundColor: item.color }]} 
              />
              <View style={styles.progressInfo}>
                <Text style={styles.categoryName}>{item.label}</Text>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          width: `${item.percentage}%`,
                          backgroundColor: item.color 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.percentageText}>{item.percentage.toFixed(1)}%</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
      
      {/* Leyenda con valores */}
      <View style={styles.legend}>
        <Text style={styles.sectionTitle}>Detalles</Text>
        {dataWithPercentages.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View 
              style={[styles.legendColor, { backgroundColor: item.color }]} 
            />
            <Text style={styles.legendText} numberOfLines={1}>
              {item.label}
            </Text>
            <Text style={styles.legendValue}>
              ${item.value.toLocaleString()}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  chartBase: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  colorRing: {
    position: 'absolute',
    borderStyle: 'solid',
  },
  centerCircle: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  totalLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  progressSection: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  progressInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    width: 45,
    textAlign: 'right',
  },
  legend: {
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  legendColor: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 12,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
});

export default SimpleDonutChart;