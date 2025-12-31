# Home Dashboard

SwitchBot デバイスからデータを収集し、Grafana で可視化するホームダッシュボードシステム。

## 概要

- SwitchBot API v1.1 を使用してデバイスデータを取得
- 5分間隔でデータを収集（設定変更可）
- InfluxDB v2 に時系列データとして保存
- Grafana でダッシュボード表示

## 対応デバイス

| デバイス | 取得データ |
|---------|-----------|
| Hub 2 | 温度、湿度、照度レベル |
| Meter / MeterPlus | 温度、湿度、バッテリー |

## セットアップ

### 1. SwitchBot API トークンの取得

1. SwitchBot アプリを開く
2. プロフィール > 設定 > アプリバージョンを10回タップ
3. 開発者オプション > トークンを取得

### 2. InfluxDB トークンの生成

InfluxDB のトークンは任意の文字列を自分で設定します。初回起動時にこの値が管理者トークンとして自動設定されます。

```bash
# ランダムな文字列を生成（推奨）
openssl rand -hex 32
```

> **注意**: トークンは初回起動時のみ設定されます。変更する場合はボリュームの削除が必要です。

### 3. 環境変数の設定

```bash
cp .env.example .env
```

`.env` を編集:

```env
SWITCHBOT_TOKEN=your_switchbot_token
SWITCHBOT_SECRET=your_switchbot_secret
INFLUXDB_TOKEN=your_influxdb_admin_token
```

### 4. 起動

```bash
docker compose up -d
```

## Docker イメージ

ビルド済みイメージは GitHub Container Registry から取得できます。

```bash
docker pull ghcr.io/petamorikei/home-dashboard/switchbot-collector:latest
```

| タグ | 説明 |
|-----|------|
| `latest` | 最新の安定版 |
| `v1.0.0` | セマンティックバージョン |
| `main` | main ブランチ最新 |

## マルチアーキテクチャビルド

arm64/amd64 両方のイメージをビルドするには buildx を使用します。

### ビルドスクリプト

```bash
# マルチアーキテクチャでビルド（キャッシュのみ）
./scripts/build.sh

# レジストリにプッシュ
./scripts/build.sh --push

# ローカルにロード（単一アーキテクチャのみ）
./scripts/build.sh --load --platform linux/amd64
```

### Docker Bake（推奨）

```bash
# マルチアーキテクチャでビルド
docker buildx bake --builder multiarch

# レジストリにプッシュ
docker buildx bake --builder multiarch --push

# ローカル用（現在のアーキテクチャ）
docker buildx bake --builder multiarch collector-local
```

## アクセス

| サービス | URL | 認証情報 |
|---------|-----|---------|
| Grafana | http://localhost:3000 | admin / admin |
| InfluxDB | http://localhost:8086 | admin / adminpassword |

## 環境変数

| 変数名 | 必須 | デフォルト | 説明 |
|-------|------|-----------|------|
| `SWITCHBOT_TOKEN` | ✓ | - | SwitchBot API トークン |
| `SWITCHBOT_SECRET` | ✓ | - | SwitchBot API シークレット |
| `INFLUXDB_TOKEN` | ✓ | - | InfluxDB 管理トークン |
| `COLLECT_INTERVAL_MS` | | `300000` | 収集間隔（ミリ秒） |

## ディレクトリ構成

```
home-dashboard/
├── docker-compose.yml
├── docker-bake.hcl
├── .env.example
├── .github/
│   └── workflows/
│       └── build-and-push.yml
├── scripts/
│   └── build.sh
├── grafana/
│   └── provisioning/
│       ├── dashboards/
│       │   ├── dashboard.yml
│       │   └── home.json
│       └── datasources/
│           └── influxdb.yml
└── switchbot-collector/
    ├── Dockerfile
    └── src/
        ├── main.ts
        ├── config.ts
        ├── switchbot/
        └── influxdb/
```

## 技術スタック

- **Runtime**: Bun
- **Language**: TypeScript
- **Database**: InfluxDB v2
- **Visualization**: Grafana
- **Container**: Docker Compose
