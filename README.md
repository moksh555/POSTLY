# POSTLY - Blog Posting Platform

A full-stack blog application built with Node.js, Express, and EJS, backed by PostgreSQL. POSTLY features a two-server architecture: a frontend Express server that renders EJS templates and a separate internal REST API server that handles all database operations. Users can register, log in, create posts, edit their own posts, delete them, and browse a global feed of all posts.

## Key Features

- **User Authentication** - Register and login with username/password stored in PostgreSQL; active session tracked via a server-side variable
- **Global Feed** - Browse all published blog posts from all users at the /feed route
- **Personal Post Management** - View, create, edit, and delete your own posts from the /home dashboard
- **Two-Server Architecture** - Frontend server (port 3000) communicates with an internal REST API server (port 4000) via Axios for a clean separation of concerns
- **Full CRUD REST API** - Internal API exposes GET, POST, PATCH, and DELETE endpoints for blog posts, all persisted in PostgreSQL
- **EJS Server-side Rendering** - Templated views for login, registration, feed, post creation, and editing (modify.ejs is reused for both new and edit flows)

## Tech Stack

| Layer | Technologies |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Templating | EJS |
| Database | PostgreSQL (via pg client) |
| HTTP Client | Axios |
| Middleware | body-parser |

## Setup and Installation

Prerequisites: Node.js 18+ and PostgreSQL installed and running locally.

1. Clone the repository:
   ```bash
   git clone https://github.com/moksh555/POSTLY.git
   cd POSTLY
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create the PostgreSQL database and tables:
   ```sql
   CREATE DATABASE blog;
   \c blog
   CREATE TABLE users (id SERIAL PRIMARY KEY, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL);
   CREATE TABLE blogs (id SERIAL PRIMARY KEY, title TEXT, content TEXT, author TEXT);
   ```
4. Update the database credentials in both server.js and index.js to match your local PostgreSQL setup.
5. Start the internal API server (runs on port 4000):
   ```bash
   node index.js
   ```
6. In a separate terminal, start the frontend server (runs on port 3000):
   ```bash
   node server.js
   ```
7. Open http://localhost:3000 in your browser.

## Usage

- Navigate to http://localhost:3000 to reach the login page
- Register a new account at /api/register
- After logging in, go to /feed to read all posts from all users
- Go to /home to manage your own posts
- Create a new post at /new; edit existing posts via /edit/:id
