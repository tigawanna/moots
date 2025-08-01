import * as React from "react";
import { useTheme } from "react-native-paper";
import Svg, { Path } from "react-native-svg";

export function EmptyRoadSVG(props: React.ComponentProps<typeof Svg>) {
    const { colors } = useTheme();
  return (
    <Svg width="256px" height="256px" viewBox="0 0 512 512" {...props}>
      <Path d="M149.9 27.2L34.25 56.74v76.76L157.8 93.85l46.7-44.67-54.6-21.98zm132.8 57c-7.4.18-10.1 1.88.9 7.13C346.9 121.6 441.7 206.8 391.3 216.9 232.2 249 130.4 292.3 48.51 390.8 25.42 418.6 18 494.8 18 494.8h432.6s-139-21.1-147.8-75.7c-14.9-92.2 194.5-102.7 196.5-199.9.9-43.2-88.3-124.99-184.4-132.52-5.6-.44-22.7-2.71-32.2-2.48zm-163.5 40.9l-32.69 10.5v122.2l35.99-10-3.3-122.7z" 
      fill={colors.primary}
      />
    </Svg>
  );
}
