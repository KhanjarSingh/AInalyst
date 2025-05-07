import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const ComparisonGraphs = ({ companyData, competitorsData }) => {
  const marketShareData = [
    { name: companyData.name, value: companyData.marketShare },
    ...competitorsData.map(comp => ({
      name: comp.name,
      value: comp.marketShare
    }))
  ];

  const revenueData = [
    { name: companyData.name, value: companyData.revenue },
    ...competitorsData.map(comp => ({
      name: comp.name,
      value: comp.revenue
    }))
  ];

  const totalMarketShare = marketShareData.reduce((sum, item) => sum + item.value, 0);
  const marketDominanceData = [
    { name: companyData.name, value: (companyData.marketShare / totalMarketShare) * 100 },
    { name: 'Others', value: 100 - (companyData.marketShare / totalMarketShare) * 100 }
  ];

  const revenueGrowthData = [
    { name: companyData.name, value: (companyData.revenue / companyData.marketShare) },
    ...competitorsData.map(comp => ({
      name: comp.name,
      value: (comp.revenue / comp.marketShare)
    }))
  ];

  const colors = {
    primary: '#007bff',
    secondary: '#28a745',
    tertiary: '#ffc107',
    quaternary: '#dc3545',
    others: '#6c757d'
  };

  const COLORS = [colors.primary, colors.others];

  return (
    <div className="comparison-section">
      <h2>Market Analysis</h2>
      
      <div className="graphs-grid">
        <div className="graph-container">
          <h3>Market Share Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={marketDominanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {marketDominanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="graph-container">
          <h3>Revenue Comparison (Millions)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Revenue (Millions)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}M`} />
              <Legend />
              <Bar dataKey="value" fill={colors.primary} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="graph-container">
          <h3>Revenue per Market Share</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Revenue/Market Share', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}M`} />
              <Legend />
              <Bar dataKey="value" fill={colors.secondary} name="Revenue Efficiency" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="graph-container">
          <h3>Market Share Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={marketShareData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Market Share (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
              <Legend />
              <Bar dataKey="value" fill={colors.tertiary} name="Market Share" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ComparisonGraphs; 