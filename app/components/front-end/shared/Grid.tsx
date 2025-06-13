import React from "react";

// Props interface for the Grid component
interface GridProps {
  children: React.ReactNode; // Child components to be displayed in the grid
  className?: string; // Optional additional CSS classes
  columns?: 1 | 2 | 3 | 4 | 5; // Number of columns (1-5)
  gap?: "sm" | "md" | "lg"; // Gap size between grid items
}

/**
 * Grid component for displaying items in a responsive grid layout
 * - Uses CSS Grid for layout
 * - Responsive breakpoints: 1 column (mobile), 2 columns (tablet), 3-5 columns (desktop)
 * - Maintains consistent gap spacing between items
 */
export const Grid: React.FC<GridProps> = ({
  children,
  className = "",
  columns = 4,
  gap = "md",
}) => {
  const gapClass = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  }[gap];

  const columnsClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-5",
  }[columns];

  return (
    <div className={`grid ${columnsClass} ${gapClass} ${className}`}>
      {children}
    </div>
  );
};

export default Grid;
