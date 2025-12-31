// 環境変数から設定を読み込み（Bunは自動で.envを読み込む）

const getEnvOrThrow = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const getEnvOrDefault = (key: string, defaultValue: string) => process.env[key] ?? defaultValue;

export const config = {
  switchbot: {
    token: getEnvOrThrow("SWITCHBOT_TOKEN"),
    secret: getEnvOrThrow("SWITCHBOT_SECRET"),
  },
  influxdb: {
    url: getEnvOrDefault("INFLUXDB_URL", "http://localhost:8086"),
    token: getEnvOrThrow("INFLUXDB_TOKEN"),
    org: getEnvOrDefault("INFLUXDB_ORG", "home"),
    bucket: getEnvOrDefault("INFLUXDB_BUCKET", "switchbot"),
  },
  collector: {
    intervalMs: Number.parseInt(getEnvOrDefault("COLLECT_INTERVAL_MS", "300000"), 10), // 5分
    targetDeviceTypes: ["Hub 2", "Meter", "MeterPlus", "WoIOSensor"] as const,
  },
} as const;

export type Config = typeof config;
