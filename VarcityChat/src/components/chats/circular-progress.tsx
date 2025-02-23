import { StyleSheet } from "react-native";
import { View, TouchableOpacity, Text } from "@/ui";
import Svg, { Circle } from "react-native-svg";
import { memo } from "react";

const SIZE = 40; // Increased size for better visibility
const STROKE_WIDTH = 3; // Slightly thicker stroke
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCLE_LENGTH = 2 * Math.PI * RADIUS;

export const CircularProgressWithIcon = memo(
  ({
    progress,
    error,
    onCancel,
  }: {
    progress: number;
    error?: boolean;
    onCancel: () => void;
  }) => {
    const strokeDashoffset = CIRCLE_LENGTH * (1 - progress / 100);

    return (
      <View style={styles.container}>
        {/* Dark overlay */}
        <View style={styles.overlay} />

        {/* Progress circle container */}
        <View style={styles.progressContainer}>
          <View className="items-center justify-center">
            {error ? (
              <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
                <Text style={styles.errorText}>✕</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.svgContainer}>
                <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
                  {/* Background Circle */}
                  <Circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                  />

                  {/* Progress Circle */}
                  <Circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    stroke="#FFFFFF"
                    strokeWidth={STROKE_WIDTH}
                    strokeDasharray={CIRCLE_LENGTH}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="none"
                    transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
                  />
                </Svg>

                {/* Progress percentage */}
                <View style={styles.percentageContainer}>
                  <Text style={styles.percentageText}>
                    {Math.round(progress)}%
                  </Text>
                </View>

                {/* Cancel button overlay */}
                <TouchableOpacity
                  onPress={onCancel}
                  style={styles.cancelOverlay}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 8,
  },
  progressContainer: {
    width: SIZE,
    height: SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  successContainer: {
    width: SIZE,
    height: SIZE,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: SIZE / 2,
  },
  successText: {
    color: "#4ADE80",
    fontSize: 24,
    fontWeight: "bold",
  },
  cancelButton: {
    width: SIZE,
    height: SIZE,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: SIZE / 2,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 20,
    fontWeight: "bold",
  },
  svgContainer: {
    position: "relative",
    width: SIZE,
    height: SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  percentageContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  percentageText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  cancelOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});
