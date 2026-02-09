# Form Validation App
## Overview
Form Validation App is a full-stack web application that demonstrates form validation, user interaction, and backend communication using a real database.
The project combines a clean Bootstrap-based UI with a Node.js backend and PostgreSQL database, showcasing a complete request–validation–persistence flow.

## Tech Stack

## Frontend
- HTML5
- CSS3
- Bootstrap (layout, components, responsive UI)
- Vanilla JavaScript

## Backend
- Node.js
- Express.js
- REST API architecture

# Database
PostgreSQL

# Infrastructure
- Render — production deployment
- Docker — local development environment

# Features
- Client-side form validation
- Server-side validation
- Clear validation error messages
- Successful and failed submission handling
- Persistent data storage in PostgreSQL
- Responsive UI built with Bootstrap
- No authentication required

# Form Validation Logic
Validation is implemented on two levels:
## Client-side
- Required fields
- Format validation (e.g. email)
- Instant feedback without page reload
- Prevents invalid submissions early
## Server-side
- Re-validation of incoming data
- Protection against malformed requests
- Clean API error responses
- This mirrors real-world production standards where frontend validation improves UX, but backend validation guarantees data integrity.

# Backend API
The backend exposes REST endpoints that:
Receive validated form data
Store data in PostgreSQL
Return structured JSON responses
Handle error cases gracefully

# Database (PostgreSQL)
PostgreSQL is used as the primary data store
Data is persisted between requests
Schema is initialized via migrations
No mock or in-memory storage is used

# Local Development (Docker)
For local development, the project runs using Docker:
Backend service (Node.js + Express)
PostgreSQL service
Environment variables configured via .env
This ensures:
Environment parity with production
Easy setup without manual DB installation
Reproducible local runs

# Deployment
The application is deployed on Render:
Backend API hosted as a web service
PostgreSQL hosted as a managed database
Frontend served via the backend

# Getting Started (Local)

docker-compose up --build

## After startup:
Backend API becomes available locally
PostgreSQL runs inside Docker
The app is ready for testing and development

# Purpose of the Project
- This project was created as part of a technical task to demonstrate:
- Understanding of full-stack architecture
- Proper form validation practices
- Clean separation between frontend and backend
- Real database integration
- Deployment-ready application setup
The app is ready for testing and development

# Purpose of the Project
This project was created as part of a technical task to demonstrate:
Understanding of full-stack architecture
Proper form validation practices
Clean separation between frontend and backend
Real database integration
Deployment-ready application setup
