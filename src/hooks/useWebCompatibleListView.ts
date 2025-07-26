import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions } from "react-native";

interface UseResponsiveListViewOptions {
  key: string; // Unique identifier for this list view
  minItemWidth?: number; // Minimum width per item in pixels
  maxColumns?: number; // Maximum number of columns
  padding?: number; // Horizontal padding to account for
}

interface PersistedListViewState {
  orientation: "grid" | "list";
  columns?: number;
}

export function useResponsiveListView(options: UseResponsiveListViewOptions) {
  const {
    key,
    minItemWidth = 190, // Default minimum width for movie/show cards
    maxColumns = 6, // Reasonable max for readability
    padding = 32, // Default padding (16px on each side)
  } = options;

  const [orientation, setOrientation] = useState<"grid" | "list">("grid");
  const [columns, setColumns] = useState(2);
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // Use ref to avoid recreating storageKey on every render
  const storageKeyRef = useRef(`listview_${key}`);

  // Memoized persist function to avoid recreating on every render
  const persistState = useCallback(
    async (newOrientation: "grid" | "list", newColumns?: number) => {
      try {
        const state: PersistedListViewState = {
          orientation: newOrientation,
          columns: newOrientation === "grid" ? newColumns : undefined,
        };
        await AsyncStorage.setItem(
          storageKeyRef.current,
          JSON.stringify(state)
        );
      } catch (error) {
        console.warn(`Failed to persist list view state for ${key}:`, error);
      }
    },
    [key]
  );

  // Load persisted state on mount - only depends on key
  useEffect(() => {
    const loadPersistedState = async () => {
      try {
        const stored = await AsyncStorage.getItem(storageKeyRef.current);
        if (stored) {
          const parsed: PersistedListViewState = JSON.parse(stored);
          setOrientation(parsed.orientation);
          if (parsed.columns && parsed.orientation === "grid") {
            setColumns(parsed.columns);
          }
        }
      } catch (error) {
        console.warn(`Failed to load list view state for ${key}:`, error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadPersistedState();
  }, [key]);

  // Enhanced setOrientation that persists changes
  const setOrientationWithPersistence = useCallback(
    (newOrientation: "grid" | "list") => {
      setOrientation(newOrientation);
      if (newOrientation === "list") {
        setColumns(1);
        persistState(newOrientation, 1);
      } else {
        // For grid, persist with current columns (will be updated by column calculation effect)
        persistState(newOrientation, columns);
      }
    },
    [persistState, columns]
  );

  // Screen width listener - no dependencies needed
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenWidth(window.width);
    });

    return () => subscription?.remove();
  }, []);

  // Column calculation effect - separate from persistence to avoid loops
  useEffect(() => {
    // Only calculate columns after initial load to avoid overriding persisted values
    if (!isLoaded) return;

    if (orientation === "list") {
      if (columns !== 1) {
        setColumns(1);
      }
      return;
    }

    // Calculate optimal columns based on screen width
    const availableWidth = screenWidth - padding;
    const calculatedColumns = Math.floor(availableWidth / minItemWidth);

    // Ensure we have at least 2 columns on mobile, but respect maxColumns
    const optimalColumns = Math.max(2, Math.min(calculatedColumns, maxColumns));

    // Only update if columns actually changed to prevent unnecessary renders
    if (columns !== optimalColumns) {
      setColumns(optimalColumns);
    }
  }, [
    screenWidth,
    orientation,
    minItemWidth,
    maxColumns,
    padding,
    isLoaded,
    columns,
  ]);

  // Separate effect for persisting column changes - only when columns actually change
  useEffect(() => {
    if (!isLoaded || orientation !== "grid") return;

    // Debounce persistence to avoid excessive writes
    const timeoutId = setTimeout(() => {
      persistState(orientation, columns);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [columns, orientation, isLoaded, persistState]);

  return {
    orientation,
    setOrientation: setOrientationWithPersistence,
    columns,
    screenWidth,
    isTablet: screenWidth >= 768,
    isDesktop: screenWidth >= 1024,
    isLoaded, // Useful for preventing flash of default state
  };
}
