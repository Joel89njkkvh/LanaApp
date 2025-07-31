import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

const CircularChart = ({ data, size = 120, strokeWidth = 12, colors = ['#4CAF50', '#FF9800', '#F44336', '#2196F3'] }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  
  // Calcular total
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Calcular ángulos y crear segmentos
  let currentAngle = -90; // Empezar desde arriba
  
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
    const rotation = currentAngle;
    
    currentAngle += (percentage / 100) * 360;
    
    return {
      ...item,
      percentage,
      strokeDasharray,
      rotation,
      color: colors[index % colors.length]
    };
  });

  return (
    <View style={styles.container}>
      <View style={[styles.chartContainer, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          {/* Círculo de fondo */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#f0f0f0"
            strokeWidth={strokeWidth}
          />
          
          {/* Segmentos del gráfico */}
          {segments.map((segment, index) => (
            <Circle
              key={index}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={segment.strokeDasharray}
              strokeDashoffset={0}
              strokeLinecap="round"
              transform={`rotate(${segment.rotation} ${center} ${center})`}
            />
          ))}
          
          {/* Texto central con total */}
          <SvgText
            x={center}
            y={center - 5}
            textAnchor="middle"
            fontSize="14"
            fontWeight="600"
            fill="#333"
          >
            ${total > 999 ? `${(total/1000).toFixed(1)}k` : total}
          </SvgText>
          <SvgText
            x={center}
            y={center + 15}
            textAnchor="middle"
            fontSize="10"
            fill="#666"
          >
            Total
          </SvgText>
        </Svg>
      </View>
      
      {/* Leyenda */}
      <View style={styles.legend}>
        {segments.map((segment, index) => (
          <View key={index} style={styles.legendItem}>
            <View 
              style={[styles.legendColor, { backgroundColor: segment.color }]} 
            />
            <Text style={styles.legendText}>
              {segment.label}: ${segment.value.toLocaleString()} ({segment.percentage.toFixed(1)}%)
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
  },
  chartContainer: {
    marginBottom: 16,
  },
  legend: {
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
});

export default CircularChart;