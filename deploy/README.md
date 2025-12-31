# Home Dashboard デプロイ

リポジトリをクローンせずにホームダッシュボードをデプロイするための構成ファイルです。

## 必要なファイル

```
home-dashboard/
├── docker-compose.yml
└── .env
```

## セットアップ

### 1. ファイルをダウンロード

```bash
mkdir home-dashboard && cd home-dashboard
curl -fsSL https://raw.githubusercontent.com/petamorikei/home-dashboard/main/deploy/docker-compose.yml -o docker-compose.yml
curl -fsSL https://raw.githubusercontent.com/petamorikei/home-dashboard/main/deploy/.env.example -o .env
```

### 2. 環境変数を設定

`.env` を編集：

```env
SWITCHBOT_TOKEN=your_switchbot_token
SWITCHBOT_SECRET=your_switchbot_secret
INFLUXDB_TOKEN=your_influxdb_admin_token
```

### 3. 起動

```bash
docker compose up -d
```

## アクセス

| サービス | URL                     |
| -------- | ----------------------- |
| Grafana  | http://<server-ip>:3000 |
| InfluxDB | http://<server-ip>:8086 |

## 環境変数

| 変数名                | 必須 | デフォルト      | 説明                       |
| --------------------- | ---- | --------------- | -------------------------- |
| `SWITCHBOT_TOKEN`     | ✓    | -               | SwitchBot API トークン     |
| `SWITCHBOT_SECRET`    | ✓    | -               | SwitchBot API シークレット |
| `INFLUXDB_TOKEN`      | ✓    | -               | InfluxDB 管理トークン      |
| `INFLUXDB_PASSWORD`   |      | `adminpassword` | InfluxDB 管理者パスワード  |
| `GRAFANA_USER`        |      | `admin`         | Grafana 管理者ユーザー名   |
| `GRAFANA_PASSWORD`    |      | `admin`         | Grafana 管理者パスワード   |
| `VERSION`             |      | `latest`        | イメージのタグ             |
| `COLLECT_INTERVAL_MS` |      | `300000`        | データ収集間隔（ミリ秒）   |

## アップデート

```bash
docker compose pull
docker compose up -d
```
