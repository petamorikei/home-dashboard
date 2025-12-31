import { createAuthHeaders } from "./auth";
import type { DeviceList, DeviceStatus, SwitchBotApiResponse } from "./types";

const API_BASE_URL = "https://api.switch-bot.com/v1.1";

export class SwitchBotClient {
  constructor(
    private readonly token: string,
    private readonly secret: string,
  ) {}

  private async request<T>(endpoint: string): Promise<T> {
    const headers = createAuthHeaders(this.token, this.secret);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`SwitchBot API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as SwitchBotApiResponse<T>;

    if (data.statusCode !== 100) {
      throw new Error(`SwitchBot API error: ${data.statusCode} ${data.message}`);
    }

    return data.body;
  }

  async getDevices(): Promise<DeviceList> {
    return this.request<DeviceList>("/devices");
  }

  async getDeviceStatus(deviceId: string): Promise<DeviceStatus> {
    return this.request<DeviceStatus>(`/devices/${deviceId}/status`);
  }
}
