# Fusion AI

**Fusion AI** is a state-of-the-art Multi-LLM Chatbot application that leverages AI-based decision-making to provide intelligent responses. It features a modern, responsive frontend built with Next.js and a robust backend service powered by NestJS.

---

## 🚀 Features

- **Multi-LLM Support**: Interaction with various Large Language Models.
- **AI Decision Making**: Intelligent routing and response generation.
- **Modern UI**: Sleek, responsive chat interface designed with Tailwind CSS v4.
- **Real-time Interaction**: Seamless communication between frontend and backend.
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
- **HTTP Client**: Axios
- **Reactive Extensions**: RxJS
- **Testing**: Jest
- **Package Manager**: Yarn (recommended) or NPM

---

## 📂 Project Structure

The project is organized into two main distinct directories:

```
fusion-ai/
├── frontend/    # Next.js Frontend Application
└── backend/     # NestJS Backend Service
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

## ⚡ Setup & Installation

To run the Fusion AI project locally, you will need to set up and run both the frontend and backend services concurrently.

### 1. Prerequisites
- **Node.js**: v18 or higher
- **NPM** (for frontend) and **Yarn** (recommended for backend)

### 2. Backend Setup
The backend runs on port `3333`.

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
yarn install  # or npm install

# Start the development server
yarn run start:dev
```
*The backend server will start at `http://localhost:3333`.*

### 3. Frontend Setup
The frontend runs on port `3000` and connects to the backend.

Open a new terminal window:

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
*The frontend application will run at `http://localhost:3000`.*

---

## 📖 Usage

1. Ensure both backend and frontend servers are running.
2. Open your browser and navigate to `http://localhost:3000`.
3. Use the chat interface to interact with the AI.
4. The frontend communicates with the backend API at `http://localhost:3333`.

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
