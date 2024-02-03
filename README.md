
# Chat App With Nest

This is a simple project from nestjs. This project is a Web API for chat applications using websocket and rabbitmq. This project is not intended for applications that will be used for production. only used for examples of using nestjs, rabbitmq, and websocket.


## Simple Architecture

![App Architecture](https://i.ibb.co/cttw0By/chat-nest-drawio.png)

## RabbitMQ Message Handler Flow

![RabbitMQ Message Handler Flow](https://i.ibb.co/2hPWYdK/chat-nest-rabbit-drawio.png)
## Requirement
Stack | Min. version |
--- | --- |
NodeJs | 18.0.0 |
MongoDB | 6.0.0 |
RabbitMq | 3.0.0 |

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGODB_URI`= your mongodb uri

`JWT_SECRET`= random jwt secret

`JWT_EXPIRATION`= jwt expiration duration

`RABBITMQ_URI`= your rabbitmq uri

## Installation

```bash
  # clone repository
  https://github.com/muhaliusman/chat-nest.git

  # go to the directory
  cd chat-nest

  # copy .env.example
  cp .env.example .env

  # adjust existing parameters
  vim .env

  # install dependency
  npm install

  # run the project (Development mode)
  npm run start:dev

  # access it via localhost:3000

  # for (Production mode)
  npm run build

  # run the project
  node dist/main.ts
```

Install with docker compose
```bash
  # clone repository
  https://github.com/muhaliusman/chat-nest.git

  # go to the directory
  cd chat-nest

  # run docker-compose
  docker-compose up
```
## API Reference

#### Get all users (no need auth)

```http
  GET /users
```

#### Store new user (no need auth)

```http
  POST /users
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. unique username |
| `password` | `string` | **Required**. password min 6 |

#### Login

```http
  POST /auth/login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. your username |
| `password`      | `string` | **Required**. your password |

#### Websocket

```ws
  ws://localhost:3000
```
*important: Websocket event to listen `conversation_${active_user_id}_${sender_message_id}`*
