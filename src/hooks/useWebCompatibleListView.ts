import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

interface UseResponsiveListViewOptions {
  minItemWidth?: number; // Minimum width per item in pixels
  maxColumns?: number; // Maximum number of columns
  padding?: number; // Horizontal padding to account for
}

export function useResponsiveListView(
  options: UseResponsiveListViewOptions = {}
) {
  const {
    minItemWidth = 160, // Default minimum width for movie/show cards
    maxColumns = 6, // Reasonable max for readability
    padding = 32, // Default padding (16px on each side)
  } = options;

  const [orientation, setOrientation] = useState<"grid" | "list">("grid");
  const [columns, setColumns] = useState(2);
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenWidth(window.width);
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    if (orientation === "list") {
      setColumns(1);
      return;
    }

    // Calculate optimal columns based on screen width
    const availableWidth = screenWidth - padding;
    const calculatedColumns = Math.floor(availableWidth / minItemWidth);

    // Ensure we have at least 2 columns on mobile, but respect maxColumns
    const optimalColumns = Math.max(2, Math.min(calculatedColumns, maxColumns));

    setColumns(optimalColumns);
  }, [screenWidth, orientation, minItemWidth, maxColumns, padding]);

  return {
    orientation,
    setOrientation,
    columns,
    screenWidth,
    isTablet: screenWidth >= 768,
    isDesktop: screenWidth >= 1024,
  };
}
