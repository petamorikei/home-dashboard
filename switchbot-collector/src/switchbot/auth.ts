import { createHmac, randomUUID } from "node:crypto";
import type { AuthHeaders } from "./types";

/**
 * SwitchBot API v1.1 認証ヘッダーを生成
 * @see https://github.com/OpenWonderLabs/SwitchBotAPI
 */
export const createAuthHeaders = (token: string, secret: string): AuthHeaders => {
  const t = Date.now().toString();
  const nonce = randomUUID();
  const data = token + t + nonce;

  const sign = createHmac("sha256", secret).update(data).digest("base64");

  return {
    Authorization: token,
    t,
    sign,
    nonce,
    "Content-Type": "application/json",
  };
};
