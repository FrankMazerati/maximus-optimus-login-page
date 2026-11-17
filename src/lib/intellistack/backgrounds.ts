import commandCenterRobots from "@/assets/command-center-robots.jpg";
import operationsCenter from "@/assets/operations-center.jpg";

export type BackgroundPreset = { id: string; name: string; src: string };

/** Add a new preset here to make it selectable in the Background picker. The first one is the default. */
export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  { id: "command-center-robots", name: "Command center with robots", src: commandCenterRobots },
  { id: "global-operations", name: "Global operations center", src: operationsCenter },
];

export const CUSTOM_BACKGROUND_ID = "custom";
export const BACKGROUND_STORAGE_KEY = "intellistack:background";
export const CUSTOM_BACKGROUND_STORAGE_KEY = "intellistack:background-custom";
export const MAX_CUSTOM_BACKGROUND_BYTES = 3 * 1024 * 1024;
