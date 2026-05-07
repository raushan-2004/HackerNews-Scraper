# HackerNews Scraper (MERN Stack)

A powerful, full-stack web application designed to scrape, store, and display stories from HackerNews. Built using the **MERN** stack (MongoDB, Express, React, Node.js), this project demonstrates a modern approach to web scraping and full-stack integration.

## 🚀 Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Tailwind CSS
- **Scraping**: Axios + Cheerio

## 📂 Project Structure

```text
root/
├── client/          # React frontend (Vite)
└── server/          # Node.js/Express backend
```

## 🛠️ Features

- **Automated Scraping**: Fetches the latest news from HackerNews using Cheerio.
- **Data Persistence**: Stores scraped data in MongoDB for fast retrieval.
- **Secure Authentication**: User registration and login powered by JWT and Bcrypt.
- **Premium UI**: Sleek, responsive design built with Tailwind CSS.

## 🏁 Getting Started

### Prerequisites

- Node.js installed
- MongoDB instance (local or Atlas)

### Setup

1. **Clone the repository**
2. **Install Server Dependencies**
   ```bash
   cd server
   npm install
   ```
3. **Install Client Dependencies**
   ```bash
   cd client
   npm install
   ```
4. **Configure Environment Variables**
   Create a `.env` file in the `server` directory with the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   ```
5. **Run the Application**
   - Start Server: `npm run dev` (in /server)
   - Start Client: `npm run dev` (in /client)

---
Built with ❤️ for advanced web development.
