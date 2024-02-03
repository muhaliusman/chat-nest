terraform {
  required_providers {
    docker = {
      source = "kreuzwerker/docker"
      version = ">= 2.0.0"
    }
  }
}

provider "docker" {
  alias   = "kreuzwerker"
}

resource "docker_image" "nestjs_app" {
  name         = "your-docker-image:latest"
  keep_locally = false
}

resource "docker_container" "nestjs_container" {
  name  = "nestjs-app"
  image = docker_image.nestjs_app.name

  ports {
    internal = 3000
    external = 3000
  }

  env = [
    "NODE_ENV=production",
  ]

  depends_on = [
    docker_container.mongodb,
    docker_container.rabbitmq,
  ]
}

resource "docker_container" "mongodb" {
  name  = "mongodb"
  image = "mongo:latest"  # Ganti dengan versi yang diinginkan jika diperlukan

  ports {
    internal = 27017
  }

  volumes {
    host_path      = abspath("${path.module}/mongodb-data")  # Menggunakan abspath
    container_path = "/data/db"
  }
}

resource "docker_container" "rabbitmq" {
  name  = "rabbitmq"
  image = "rabbitmq:3.8-management-alpine"  # Ganti dengan versi yang diinginkan jika diperlukan

  ports {
    internal = 5672
    external = 5672
  }

  volumes {
    host_path      = abspath("${path.module}/rabbitmq-data")  # Menggunakan abspath
    container_path = "/var/lib/rabbitmq"
  }
}