
# Book Review Platform

This project is a microservices-based application for searching books and managing user reviews. It consists of two primary services, a main gateway and a specialized reviews microservice, which communicate asynchronously via a message broker. The entire system is containerized using Docker for easy setup and deployment.

## Table of Contents

- [Book Review Platform](#book-review-platform)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Architecture](#architecture)
  - [Services](#services)
    - [Assessment Service (Gateway)](#assessment-service-gateway)
    - [Reviews Service](#reviews-service)
  - [Docker Compose Explained](#docker-compose-explained)
  - [Getting Started](#getting-started)

## Project Overview

The platform allows users to:
- Register and log in to an account.
- Search for books using an external API.
- Create, view, and manage reviews for books.

The system is designed with a decoupled architecture, where the main `Assessment` service acts as a gateway and the `Reviews` service handles all review-related logic.

## Architecture

The application is built on a microservice architecture, orchestrated with Docker Compose.

- **Assessment Service**: An Express.js application that serves as the main API gateway. It handles user authentication, book searching, and forwards review-related requests to the `Reviews` service.
- **Reviews Service**: A NestJS application responsible for all review-related operations. It listens for events and messages from the `Assessment` service.
- **RabbitMQ**: A message broker that facilitates asynchronous communication between the two services.
- **Databases**:
  - The **Assessment Service** uses **MongoDB** (as indicated in its setup, though not in the docker-compose) for storing user data.
  - The **Reviews Service** uses **PostgreSQL** (as indicated by its Prisma setup, though not in the docker-compose) for storing review data.

## Services

### Assessment Service (Gateway)

This is the primary entry point for the application.

- **Responsibilities**:
  - **User Authentication**: Manages user signup and login. It uses a JWT-based authentication system with both access and refresh tokens. The access token is sent as a Bearer token, and the refresh token is stored in an `httpOnly` cookie.
  - **Book Searching**: Queries the Open Library API to find books.
  - **API Gateway**: Forwards requests related to reviews to the `Reviews` service via RabbitMQ.
- **Technology**: Express.js, JWT, Passport, Mongoose.

### Reviews Service

This microservice handles all logic related to reviews.

- **Responsibilities**:
  - Manages the full lifecycle of reviews (create, read, update, delete).
  - Listens for events (e.g., `review.create`) and responds to messages (e.g., `reviews.getAll`) from the gateway service.
- **Technology**: NestJS, Prisma, RabbitMQ.

## Docker Compose Explained

The `docker-compose.yml` file orchestrates the different services required to run the application.

- **`gateway` (Assessment Service)**:
  - Builds from the `./Assesment` directory.
  - Maps port `8000` on the host to port `8000` in the container, making the API accessible.
  - Uses a volume to sync the local `./Assesment` code with the code inside the container, which is useful for development.
  - Loads environment variables from a top-level `.env` file.

- **`reviews_service` (Reviews Service)**:
  - Builds from the `./reviews` directory.
  - Also uses a volume to sync code for development.
  - Loads its environment variables from the same top-level `.env` file.
  - Note: This service is designed to be internal and does not expose any ports to the host machine. It communicates only with other services in the Docker network (like RabbitMQ).

This setup allows both services to run in isolated environments while still being able to communicate with each other through the message broker defined in the environment variables.

## Getting Started

To run the entire application, you need to have Docker and Docker Compose installed.

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Weab69/API-Gateway-Assessment.git
    cd API-Gateway-Assessment
    ```

2.  **Set up environment variables**
    Create a `.env` file in the root directory. This file should contain the connection strings for RabbitMQ and the databases, as used by the services in the `docker-compose.yml` file.
    ```
    # For Assessment Service
    PORT=8000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    JWT_REFRESH_SECRET=your_jwt_refresh_secret

    # For Reviews Service
    DATABASE_URL="your_postgresql_connection_string"

    # For RabbitMQ (used by both services)
    CLOUDAMQP_URL="your_rabbitmq_url"
    ```

3.  **Run the application**
    ```bash
    docker-compose up --build
    ```
This command will build the Docker images for both services and start the containers. The main API will be accessible at `http://localhost:8000`.
