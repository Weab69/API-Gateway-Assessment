# Reviews Microservice

This NestJS-based microservice is responsible for managing all operations related to book reviews, including creating, retrieving, updating, and deleting them. It is designed to work within a larger microservice architecture, communicating with other services via a message broker.

## Table of Contents

- [Reviews Microservice](#reviews-microservice)
  - [Table of Contents](#table-of-contents)
  - [Architecture](#architecture)
  - [Communication Patterns](#communication-patterns)
    - [Event Patterns](#event-patterns)
    - [Message Patterns](#message-patterns)
  - [Getting Started](#getting-started)

## Architecture

This microservice is built with the [NestJS](https://nestjs.com/) framework and uses [Prisma](https://www.prisma.io/) as its Object-Relational Mapper (ORM) to interact with the database. It is designed to be a standalone service that handles all business logic related to reviews.

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Prisma**: A next-generation ORM that makes database access easy with an auto-generated and type-safe query builder.
- **RabbitMQ**: The service connects to a RabbitMQ instance to receive events and messages from other services, such as the main `Assessment` service.

## Communication Patterns

The service listens for specific patterns from the message broker to perform its operations. It uses two main types of patterns:

-   **Event Pattern**: Used for write operations where the sender does not expect a response. This is ideal for commands like creating, updating, or deleting a review.
-   **Message Pattern**: Used for read operations where the sender expects a response. This is used for querying review data.

### Event Patterns

| Event Pattern           | Description         | Payload                                            |
| :---------------------- | :------------------ | :------------------------------------------------- |
| `review.create`         | Creates a new review| `{ "bookId", "userId", "rating", "comment" }`      |

### Message Patterns

| Message Pattern         | Description                  | Payload                | Returns                               |
| :---------------------- | :--------------------------- | :--------------------- | :------------------------------------ |
| `reviews.getAll`        | Fetches all reviews          | -                      | A list of all reviews.                |
| `reviews.getByBookId`   | Fetches all reviews for a specific book | `{ "bookId": "..." }`  | A list of reviews for the given book. |

## Getting Started

To get the project running locally, follow these steps:

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Weab69/API-Gateway-Assessment.git
    cd API-Gateway-Assessment/reviews
    ```

2.  **Install dependencies**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables**
    Create a `.env` file in the `reviews` directory and add the following variables:
    ```
    DATABASE_URL="postgresql://neondb_owner:npg_IG8yB7DkMazt@ep-blue-waterfall-aemmk5bx-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    RABBITMQ_URL="amqps://svpkllma:rLNbRH3y_6Js59VqQryY9IEzPwOtjc6m@possum.lmq.cloudamqp.com/svpkllma"
    ```

4.  **Run database migrations**
    ```bash
    npx prisma migrate dev
    ```

5.  **Start the server**
    ```bash
    npm run start:dev
    ```

The microservice will start and connect to the RabbitMQ server, ready to process incoming events and messages.
