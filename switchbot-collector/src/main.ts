import { config } from "./config";
import { InfluxDBClient } from "./influxdb/client";
import { SwitchBotClient } from "./switchbot/client";
import type { Device } from "./switchbot/types";

const switchbot = new SwitchBotClient(config.switchbot.token, config.switchbot.secret);
const influxdb = new InfluxDBClient(config.influxdb);

const collectData = async (targetDevices: Device[]) => {
  console.log(`[Collector] Collecting data from ${targetDevices.length} device(s)...`);

  for (const device of targetDevices) {
    try {
      const status = await switchbot.getDeviceStatus(device.deviceId);
      influxdb.writeDeviceStatus(status, device.deviceName);
    } catch (error) {
      console.error(`[Collector] Failed to collect data from ${device.deviceName}:`, error);
    }
  }

  await influxdb.flush();
  console.log("[Collector] Data collection completed");
};

const main = async () => {
  console.log("[Collector] Starting SwitchBot data collector...");
  console.log(`[Collector] Collection interval: ${config.collector.intervalMs}ms`);

  // デバイス一覧を取得
  const { deviceList } = await switchbot.getDevices();
  console.log(`[Collector] Found ${deviceList.length} device(s)`);

  // 対象デバイスをフィルタリング
  const targetDevices = deviceList.filter((device) =>
    config.collector.targetDeviceTypes.includes(
      device.deviceType as (typeof config.collector.targetDeviceTypes)[number],
    ),
  );

  if (targetDevices.length === 0) {
    console.error("[Collector] No target devices found. Exiting...");
    process.exit(1);
  }

  console.log("[Collector] Target devices:");
  for (const device of targetDevices) {
    console.log(`  - ${device.deviceName} (${device.deviceType})`);
  }

  // 初回収集
  await collectData(targetDevices);

  // 定期収集
  setInterval(() => {
    collectData(targetDevices).catch((error) => {
      console.error("[Collector] Collection error:", error);
    });
  }, config.collector.intervalMs);
};

// グレースフルシャットダウン
process.on("SIGINT", async () => {
  console.log("\n[Collector] Shutting down...");
  await influxdb.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n[Collector] Shutting down...");
  await influxdb.close();
  process.exit(0);
});

main().catch((error) => {
  console.error("[Collector] Fatal error:", error);
  process.exit(1);
});
