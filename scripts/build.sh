#!/bin/bash
set -euo pipefail

# デフォルト値
BUILDER="multiarch"
PLATFORMS="linux/amd64,linux/arm64"
IMAGE_NAME="switchbot-collector"
TAG="latest"
PUSH=false
LOAD=false

# 使用方法
usage() {
  cat <<EOF
Usage: $0 [OPTIONS]

Options:
  -t, --tag TAG        イメージタグ (default: latest)
  -p, --push           レジストリにプッシュ
  -l, --load           ローカルにロード (単一アーキテクチャのみ)
  --platform PLATFORM  ビルド対象プラットフォーム (default: linux/amd64,linux/arm64)
  -h, --help           このヘルプを表示

Examples:
  $0                          # ビルドのみ (キャッシュに保存)
  $0 --push                   # ビルドしてレジストリにプッシュ
  $0 --load --platform linux/amd64  # amd64のみローカルにロード
EOF
  exit 0
}

# 引数パース
while [[ $# -gt 0 ]]; do
  case $1 in
    -t|--tag)
      TAG="$2"
      shift 2
      ;;
    -p|--push)
      PUSH=true
      shift
      ;;
    -l|--load)
      LOAD=true
      shift
      ;;
    --platform)
      PLATFORMS="$2"
      shift 2
      ;;
    -h|--help)
      usage
      ;;
    *)
      echo "Unknown option: $1"
      usage
      ;;
  esac
done

# --load と複数プラットフォームの組み合わせチェック
if [[ "$LOAD" == true ]] && [[ "$PLATFORMS" == *","* ]]; then
  echo "Error: --load は単一プラットフォームでのみ使用可能です"
  echo "例: $0 --load --platform linux/amd64"
  exit 1
fi

# ビルドコマンド構築
BUILD_ARGS=(
  "--builder" "$BUILDER"
  "--platform" "$PLATFORMS"
  "-t" "$IMAGE_NAME:$TAG"
  "-f" "switchbot-collector/Dockerfile"
  "switchbot-collector"
)

if [[ "$PUSH" == true ]]; then
  BUILD_ARGS+=("--push")
elif [[ "$LOAD" == true ]]; then
  BUILD_ARGS+=("--load")
fi

echo "Building $IMAGE_NAME:$TAG for $PLATFORMS..."
docker buildx build "${BUILD_ARGS[@]}"

echo "Build completed!"
