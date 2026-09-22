# Fusion AI (Frontend)

Fusion AI is a modern, responsive chat interface built with Next.js 16 and Tailwind CSS v4. It features a sleek, component-based architecture designed for optimal user experience.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive interface inspired by top-tier AI chat applications.
- **Component Architecture**: Modular design with separate `Sidebar`, `ChatArea`, and `InputArea` components.
- **Tailwind CSS v4**: Utilizes the latest Tailwind features for high-performance styling.
- **Optimized Assets**: Uses `lucide-react` for lightweight, crisp icons.
- **Responsive Layout**: Adapts seamlessly to different screen sizes.

## 🛠 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Package Manager**: NPM

## 📂 Project Structure

```bash
src/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Main chat page controller
│   └── globals.css      # Global styles & Tailwind import
├── components/
│   ├── Chat/
│   │   ├── ChatArea.tsx     # Main message display area
│   │   ├── InputArea.tsx    # Floating input bar
│   │   └── MessageBubble.tsx # Individual message component
│   ├── UI/
│   │   └── UpgradeTab.tsx   # "Upgrade to Pro" side tab
│   └── Sidebar.tsx          # Left navigation sidebar
```

## ⚡ Getting Started

### Prerequisites

- Node.js 18+ installed
- NPM installed

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd fusion-ai/web-client
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔌 API Integration

Auth is required. After login/register, the frontend stores a JWT and sends:

`Authorization: Bearer <token>`

- **Chat**: `POST http://localhost:3333/chat` with `{ "message": "...", "conversationId?": "uuid" }`
- **Conversations**: `GET /conversations`, `GET /conversations/:id`

Expected chat response:
```json
{
  "conversationId": "uuid",
  "answer": "AI response text...",
  "selectedBy": "mistral"
}
```

## 📜 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint checks.

## 🤝 Contributing

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
