import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.voidtools.app",
  appName: "VOIDTOOLS",
  webDir: "out",
  backgroundColor: "#090a0f",
  android: {
    allowMixedContent: false,
  },
};

export default config;
