// Define a list of all available animations
export const AVAILABLE_ANIMATIONS = [
  "success",
] as const;

// Define AnimatedName type based on the available animations array
export type AnimatedName = typeof AVAILABLE_ANIMATIONS[number];

