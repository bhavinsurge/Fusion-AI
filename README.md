# Fusion AI

**Fusion AI** is a state-of-the-art Multi-LLM Chatbot application that leverages AI-based decision-making to provide intelligent responses. It features a modern, responsive frontend built with Next.js and a robust backend service powered by NestJS.

---

## 🚀 Features

- **Multi-LLM Support**: Interaction with various Large Language Models.
- **AI Decision Making**: Intelligent routing and response generation.
- **Auth (JWT)**: Register / login with bcrypt-hashed passwords.
- **Per-user chats**: Conversations and messages stored in PostgreSQL (UUID + timestamps).
- **Modern UI**: Sleek, responsive chat interface designed with Tailwind CSS v4.
- **Modular Architecture**: Clean separation of concerns between client and server.

---

## � How It Works

The Fusion AI system follows a sophisticated pipeline to deliver the highest quality response:

1.  **User Input**: The user sends a prompt via the frontend chat interface.
2.  **Multi-Model Query**: The backend (`AppController`) receives the request and simultaneously queries multiple LLMs (e.g., `mistral`, `gemma`) using the `LlmService`.
3.  **Response Aggregation**: The system collects all responses from the queried models.
4.  **Filtering**: Invalid or empty responses are filtered out to ensure quality.
5.  **AI Judge Evaluation**: The aggregated responses + the original prompt are sent to a specialized **Judge Model** (`llama3:8b`). The judge evaluates the answers based on factual correctness and hallucination penalties.
6.  **Decision Making**: The judge enters a specific JSON format selecting the "Best" answer index.
7.  **Final Output**: The backend returns the winning response and the name of the model that generated it to the user.

---

## �🛠 Tech Stack

### Frontend (`/frontend`)
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Package Manager**: NPM

### Backend (`/backend`)
- **Framework**: [NestJS 11](https://nestjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **ORM / DB**: Prisma + PostgreSQL
- **Auth**: JWT (`passport-jwt`) + bcrypt
- **HTTP Client**: Axios
- **Package Manager**: Yarn (recommended) or NPM

### Infra
- **Docker Compose**: local PostgreSQL (`docker-compose.yml`)
- **Ollama**: local LLM runtime

---

## 📂 Project Structure

The project is organized into two main distinct directories:

```
fusion-ai/
├── frontend/           # Next.js Frontend Application
├── backend/            # NestJS Backend Service
└── docker-compose.yml  # PostgreSQL
```

---

## 🦙 Ollama & Model Setup

This project relies on **Ollama** to run local LLMs. You must have Ollama installed and the specific models pulled for the application to function correctly.

### 1. Install Ollama
Download and install Ollama from [ollama.com](https://ollama.com/).

### 2. Pull Required Models
The application is configured to use the following models. Open your terminal and run:

```bash
# Pull the Judge model
ollama pull llama3:8b

# Pull the responder models
ollama pull mistral
ollama pull gemma
```
> **Note**: You can customize the models used by modifying `backend/src/llm/llm.service.ts` and `backend/src/judge/judge.service.ts`.

---

## 🐘 PostgreSQL Setup

From the project root, create a `.env` (see `backend/.env.example` for `POSTGRES_*` keys), then:

```bash
docker compose up -d
```

This starts **PostgreSQL 18** on `localhost:5432`. Default local values (override via root `.env`):
- user: `postgres`
- database: `Fusion_AI` (underscore form of “Fusion AI”; spaces break connection URLs)
- Set `POSTGRES_PASSWORD` in the root `.env` and matching URL-encoded password in `backend/.env` `DATABASE_URL`

---

## ⚡ Setup & Installation

To run the Fusion AI project locally, you will need Postgres, Ollama, backend, and frontend.

### 1. Prerequisites
- **Node.js**: v18 or higher
- **Docker** (for PostgreSQL)
- **Ollama** with models pulled
- **Yarn** (backend) and **NPM** or Yarn (frontend)

### 2. Backend Setup
The backend runs on port `3333`.

```bash
cd backend
cp .env.example .env
yarn install
npx prisma migrate dev
yarn run start:dev
```
*The backend server will start at `http://localhost:3333`.*

### 3. Frontend Setup
The frontend runs on port `3000` and connects to the backend.

```bash
cd frontend
cp .env.example .env.local   # optional
npm install                  # or yarn
npm run dev
```
*Open `http://localhost:3000`, register an account, then chat.*

### API overview
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | No | Create account |
| POST | `/auth/login` | No | Login, returns JWT |
| GET | `/auth/me` | JWT | Current user |
| POST | `/chat` | JWT | Run multi-LLM pipeline + save messages |
| GET | `/conversations` | JWT | List user conversations |
| GET | `/conversations/:id` | JWT | Conversation + messages |
| DELETE | `/conversations` | JWT | Clear all chats |
| DELETE | `/conversations/:id` | JWT | Delete one chat |

`POST /chat` body: `{ "message": "...", "conversationId?: "uuid" }`  
Response still includes `answer` + `selectedBy` (same LLM logic), plus `conversationId`.
---

## 🔧 Commands

### Frontend
| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

### Backend
| Command | Description |
|---|---|
| `yarn run start:dev` | Start development server (watch mode) |
| `yarn run build` | Build the application |
| `yarn run test` | Run unit tests |
| `yarn run test:e2e` | Run end-to-end tests |

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
