# Agro AI — Smart Agriculture & Farm Intelligence Platform 🌱

Agro AI is a modern full-stack agricultural operating system designed to empower Indian farmers with next-generation AI diagnostics, farm activity planning, hyperlocal weather advisories, an equipment/produce marketplace, and agricultural calculation utilities.

---

## ✨ Features

- 🌿 **Multimodal AI Crop Diagnostics**: Visual inspection and leaf disease identification using OpenRouter vision models and HuggingFace Vision Transformers (ViT).
- 💬 **Multilingual AI Agronomist**: Conversational assistance supporting English, Telugu (తెలుగు), and Hindi (हिन्दी) with persistent chat history.
- 🌦️ **Agricultural Telemetry & Weather**: Hyperlocal forecasts, rainfall alerts, soil moisture, and farming advisories.
- 🛒 **Farming Marketplace**: Peer-to-peer equipment rentals (tractors, sprayers, harvesters) and crop produce commerce.
- 📅 **Farm Task & Activity Management**: Track sowing, irrigation, fertilizer cycles, and harvest timelines.
- 🧮 **Precision Agronomic Calculators**: Fertilizer NPK dosage, seed rate, drip irrigation, and harvest yield estimators.
- 🌗 **Adaptive UI**: Clean monochrome Apple + Notion aesthetics with emerald agricultural accents and deep OLED dark mode.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, Socket.io client, Axios, React Router v6
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT Authentication, Multer, Socket.io
- **AI & ML**: OpenRouter Vision (`openai/gpt-4o-mini`), Google Gemini, HuggingFace Vision Transformers (`kimcomehome/plantvillage-vit-leaf-disease`), PyTorch, Flask

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/vignesh1011e/AgroAi.git
cd AgroAi
```

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Configure Environment Variables
Create a `.env` file in `backend/`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/agro-ai?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 4. Run Locally
```bash
# Start backend server
npm run dev:backend

# Start frontend dev server
npm run dev:frontend
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📜 License
MIT License • Built for modern sustainable agriculture.
