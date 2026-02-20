# Google Translate Clone

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A full-stack Google Translate clone built with React and Express, powered by the Google Cloud Translation API. Features real-time translation across 100+ languages with auto-detection, debounced input, and a responsive UI that mirrors the look and feel of Google Translate.

![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)

## Features

- **Real-time translation** with 400ms debounce for smooth typing
- **100+ languages** supported via Google Cloud Translation API
- **Auto-detect** source language with detected language display
- **Swap languages** instantly with one click
- **Copy to clipboard** translated text
- **Character counter** with 5,000 character limit
- **Rate limiting** at 60 requests per minute
- **Input validation** and error handling
- **Responsive design** optimized for desktop, tablet, and mobile

## Tech Stack

| Layer    | Technology                                  |
| -------- | ------------------------------------------- |
| Frontend | React 19, TypeScript, Vite                  |
| Backend  | Express.js, TypeScript, Google Cloud Translate |
| Styling  | Vanilla CSS (Google Translate-inspired)      |

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- A [Google Cloud](https://cloud.google.com/) project with the Translation API enabled
- A Google Cloud API key

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ddex3/Google-Translate-Clone.git
cd Google-Translate-Clone
```

### 2. Configure environment variables

Copy the example environment file and fill in your Google Cloud credentials:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
GOOGLE_PROJECT_ID=your-google-cloud-project-id
GOOGLE_API_KEY=your-google-cloud-api-key
```

### 3. Install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Start the development servers

Open two terminal windows:

```bash
# Terminal 1 - Start the backend (port 3001)
cd server
npm run dev

# Terminal 2 - Start the frontend (port 5173)
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
Google-Translate-Clone/
├── client/                  # React frontend
│   ├── src/
│   │   ├── api/             # API client
│   │   ├── components/      # React components
│   │   ├── config/          # Language configuration
│   │   ├── styles/          # CSS stylesheets
│   │   ├── types/           # TypeScript interfaces
│   │   ├── App.tsx          # Main application component
│   │   └── main.tsx         # Entry point
│   ├── package.json
│   └── vite.config.ts
├── server/                  # Express backend
│   ├── src/
│   │   ├── config/          # Environment config
│   │   ├── middleware/       # Rate limiting, validation
│   │   ├── routes/          # API routes
│   │   ├── services/        # Google Translate service
│   │   ├── types/           # TypeScript interfaces
│   │   └── server.ts        # Server entry point
│   └── package.json
├── .env.example             # Environment variable template
└── LICENSE
```

## API Endpoints

| Method | Endpoint      | Description                          |
| ------ | ------------- | ------------------------------------ |
| POST   | `/translate`  | Translate text between languages     |
| GET    | `/api/status` | Health check with uptime and metrics |

### Translation request example

```bash
curl -X POST http://localhost:3001/translate \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, world!", "source": "auto", "target": "es"}'
```

Response:

```json
{
  "translatedText": "¡Hola, mundo!",
  "detectedSourceLanguage": "en"
}
```

## Building for Production

```bash
# Build the server
cd server
npm run build
npm start

# Build the client
cd client
npm run build
npm run preview
```

## Help and Support

- **Bug reports and feature requests**: [Open an issue](https://github.com/ddex3/Google-Translate-Clone/issues)
- **Google Cloud Translation API docs**: [cloud.google.com/translate/docs](https://cloud.google.com/translate/docs)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by **[@ddex3](https://github.com/ddex3)**
