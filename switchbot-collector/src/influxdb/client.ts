import { InfluxDB, Point } from "@influxdata/influxdb-client";
import type { DeviceStatus } from "../switchbot/types";

export interface InfluxDBConfig {
  url: string;
  token: string;
  org: string;
  bucket: string;
}

export class InfluxDBClient {
  private readonly writeApi;

  constructor(config: InfluxDBConfig) {
    const client = new InfluxDB({ url: config.url, token: config.token });
    this.writeApi = client.getWriteApi(config.org, config.bucket, "s");
  }

  writeDeviceStatus(status: DeviceStatus, deviceName: string): void {
    const point = new Point("switchbot")
      .tag("device_id", status.deviceId)
      .tag("device_type", status.deviceType)
      .tag("device_name", deviceName)
      .floatField("temperature", status.temperature)
      .intField("humidity", status.humidity);

    // Hub 2 の場合は照度も記録
    if (status.deviceType === "Hub 2" && "lightLevel" in status) {
      point.intField("light_level", status.lightLevel);
    }

    // バッテリー情報がある場合（温湿度計）
    if ("battery" in status) {
      point.intField("battery", status.battery);
    }

    this.writeApi.writePoint(point);
    console.log(`[InfluxDB] Wrote data for ${deviceName}: temp=${status.temperature}°C, humidity=${status.humidity}%`);
  }

  async flush(): Promise<void> {
    await this.writeApi.flush();
  }

  async close(): Promise<void> {
    await this.writeApi.close();
  }
}
