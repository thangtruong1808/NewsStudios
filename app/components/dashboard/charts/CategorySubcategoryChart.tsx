"use client";

// Component Info
// Description: Chart component displaying article statistics by categories and subcategories.
// Date created: 2025-01-27
// Author: thangtruong

import { useEffect, useRef } from "react";
import { Chart as ChartJS } from "chart.js/auto";

interface CategorySubcategoryStats {
  name: string;
  articles_count: number;
  type: "category" | "subcategory";
}

interface CategorySubcategoryChartProps {
  data: CategorySubcategoryStats[];
}

export default function CategorySubcategoryChart({ data }: CategorySubcategoryChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chart = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (chartRef.current && data.length > 0) {
      // Destroy existing chart if it exists
      if (chart.current) {
        chart.current.destroy();
      }

      // Prepare chart data
      const labels = data.map((item) => item.name);
      const articlesData = data.map((item) => item.articles_count);
      const categoryColors = data.map((item) =>
        item.type === "category" ? "rgba(59, 130, 246, 0.8)" : "rgba(16, 185, 129, 0.8)"
      );

      // Create new chart
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        chart.current = new ChartJS(ctx, {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                label: "Articles",
                data: articlesData,
                backgroundColor: categoryColors,
                borderColor: categoryColors.map((color) => color.replace("0.8", "1")),
                borderWidth: 1,
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
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                titleColor: "#1f2937",
                bodyColor: "#1f2937",
                borderColor: "#e5e7eb",
                borderWidth: 1,
                padding: 8,
                callbacks: {
                  label: function (context) {
                    const item = data[context.dataIndex];
                    return `${item.type === "category" ? "Category" : "Subcategory"}: ${context.parsed.y} articles`;
                  },
                },
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: "#6b7280",
                  font: {
                    size: 10,
                  },
                  maxRotation: 45,
                  minRotation: 45,
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: "#f3f4f6",
                },
                ticks: {
                  color: "#6b7280",
                  precision: 0,
                  font: {
                    size: 11,
                  },
                },
              },
            },
          },
        });
      }
    }

    return () => {
      if (chart.current) {
        chart.current.destroy();
      }
    };
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-bold mb-3">Articles by Categories & Subcategories</h2>
        <div className="h-[200px] flex items-center justify-center text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="text-lg font-bold mb-3">Articles by Categories & Subcategories</h2>
      <div className="h-[200px]">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
}

