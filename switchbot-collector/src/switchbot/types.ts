// SwitchBot API レスポンス型定義

export interface SwitchBotApiResponse<T> {
  statusCode: number;
  message: string;
  body: T;
}

export interface Device {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  enableCloudService: boolean;
  hubDeviceId: string;
}

export interface DeviceList {
  deviceList: Device[];
  infraredRemoteList: unknown[];
}

// Hub 2 ステータス
export interface Hub2Status {
  deviceId: string;
  deviceType: "Hub 2";
  hubDeviceId: string;
  humidity: number;
  temperature: number;
  lightLevel: number;
  version: string;
}

// 温湿度計 ステータス
export interface MeterStatus {
  deviceId: string;
  deviceType: "Meter" | "MeterPlus" | "WoIOSensor";
  hubDeviceId: string;
  humidity: number;
  temperature: number;
  battery: number;
  version: string;
}

export type DeviceStatus = Hub2Status | MeterStatus;

// 認証ヘッダー
export type AuthHeaders = {
  Authorization: string;
  t: string;
  sign: string;
  nonce: string;
  "Content-Type": string;
} & Record<string, string>;
