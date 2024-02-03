
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
## Unit Test
This project has implemented unit tests in it. To run it, just run
```bash
npm t
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

#### Send Message
```http
  POST /conversations
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `string` | **Required**. receiver user |
| `message`      | `string` | **Required**. your message |

| Headers | value  |
| :-------- | :------- |
| `Authorization`      | **Required**. Bearer ${token from login response} |

#### Websocket

```ws
  ws://localhost:3000
```
*important: Websocket event to listen `conversation_${active_user_id}_${sender_message_id}`*

## How To Test
1. create new user via `Store new user endpoint`
2. create another user
3. login via `login endpoint`
4. first user open postman and connect to websocket (don't forget to attach jwt token into header)
5. for event name use this: `conversation_${active_user_id}_${sender_message_id}`
5. second user send message to first user via Send Message endpoint

#### Postman testing to subscribe and listen websocket
![Postman](https://i.ibb.co/8sDKZ1J/Screen-Shot-2024-02-03-at-14-39-29.png)