import type { ConfigContext, ExpoConfig } from "@expo/config";
import { ClientEnv } from "./env";

export default ({ config }: ConfigContext) => ({
  ...config,
  extra: {
    ...ClientEnv,
    eas: {
      projectId: "cbc0cdda-cb4c-4de3-9baa-ccf4b51b0ee8",
    },
  },
});
