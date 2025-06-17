"use client";

import { useEffect, useRef } from 'react';
import { Chart as ChartJS } from "chart.js/auto";

interface DashboardChartsProps {
  activeUsers: number;
}

export default function DashboardCharts({ activeUsers }: DashboardChartsProps) {
  const userActivityChartRef = useRef<HTMLCanvasElement>(null);
  const userActivityChart = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (userActivityChartRef.current) {
      // Destroy existing chart if it exists
      if (userActivityChart.current) {
        userActivityChart.current.destroy();
      }

      // Create new chart
      const ctx = userActivityChartRef.current.getContext('2d');
      if (ctx) {
        userActivityChart.current = new ChartJS(ctx, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
              {
                label: 'Active Users',
                data: [5, 7, 6, 8, 7, activeUsers],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1f2937',
                bodyColor: '#1f2937',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 8,
                boxPadding: 4,
                usePointStyle: true,
                callbacks: {
                  label: function (context) {
                    return `Users: ${context.parsed.y}`;
                  }
                }
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: '#6b7280',
                  font: {
                    size: 11
                  }
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: '#f3f4f6',
                },
                ticks: {
                  color: '#6b7280',
                  precision: 0,
                  font: {
                    size: 11
                  }
                },
              },
            },
            interaction: {
              mode: 'nearest',
              axis: 'x',
              intersect: false,
            },
          },
        });
      }
    }

    return () => {
      if (userActivityChart.current) {
        userActivityChart.current.destroy();
      }
    };
  }, [activeUsers]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold">User Activity</h2>
        <div className="text-xs text-gray-500">Last 6 months</div>
      </div>
      <div className="h-[200px]">
        <canvas ref={userActivityChartRef} />
      </div>
    </div>
  );
} 