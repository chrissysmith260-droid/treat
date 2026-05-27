import React from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { theme } from './src/theme';

const VitalsChart = ({ data }) => {
  // Process data for the last 7 days and convert to numerical values
  const chartData = [...data]
    .reverse() // Sort chronologically
    .slice(-15) // Show last 15 entries for density
    .map(item => {
      const [sys, dia] = (item.bp || "").split('/').map(Number);
      return {
        name: new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
        HR: Number(item.hr) || null,
        Glucose: Number(item.glucose) || null,
        Oxygen: Number(item.o2) || null,
        BP_Range: (sys && dia) ? [dia, sys] : null,
      };
    });

  if (data.length === 0) return null;

  return (
    <div style={{ 
      background: 'white', 
      padding: '20px', 
      borderRadius: theme.borderRadius, 
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      marginBottom: '2rem'
    }}>
      <h3 style={{ color: theme.colors.accentBlue, marginBottom: '20px' }}>Vitals Trends (Last 7 Days)</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#888', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#888', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '10px', 
                border: 'none', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
              }} 
            />
            <Legend verticalAlign="top" height={36} />
            <Line 
              type="monotone" 
              dataKey="HR" 
              stroke={theme.colors.accentBlue} 
              strokeWidth={2} 
              dot={{ r: 4 }} 
              activeDot={{ r: 6 }} 
            />
            <Area
              name="BP Range (Sys/Dia)"
              type="monotone"
              dataKey="BP_Range"
              fill={theme.colors.accentBlue}
              stroke={theme.colors.accentBlue}
              fillOpacity={0.2}
            />
            <Line 
              type="monotone" 
              dataKey="HR" 
              stroke={theme.colors.accentBlue} 
              strokeWidth={2} 
              dot={{ r: 4 }} 
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="Glucose" 
              stroke={theme.colors.leafGreen} 
              strokeWidth={2} 
              dot={{ r: 4 }} 
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="Oxygen" 
              stroke="#BA68C8" 
              strokeWidth={2} 
              dot={{ r: 4 }} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VitalsChart;