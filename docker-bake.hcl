variable "TAG" {
  default = "latest"
}

variable "REGISTRY" {
  default = "ghcr.io/petamorikei/home-dashboard/"
}

group "default" {
  targets = ["collector"]
}

target "collector" {
  context    = "./switchbot-collector"
  dockerfile = "Dockerfile"
  platforms  = ["linux/amd64", "linux/arm64"]
  tags = [
    "${REGISTRY}switchbot-collector:${TAG}",
    "${REGISTRY}switchbot-collector:latest"
  ]
}

target "collector-local" {
  inherits = ["collector"]
  platforms = ["linux/arm64"]
  output   = ["type=docker"]
}
