# Menu Scanner & AI Chat Application

  

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

[![OpenAI](https://img.shields.io/badge/OpenAI-API-412991)](https://openai.com/)

  

An AI-powered menu scanner and chat application that helps users understand and interact with menu items.

  

## Table of Contents

- [Architecture Overview](#architecture-overview)

- [Setup Instructions](#setup-instructions)

- [Installation](#installation)

- [Environment](#environment-variables)

- [Run Development Server](#run-development-server)

- [Component Documentation](#component-documentation)

- [API Routes](#api-routes)

- [Usage Guide](#usage-guide)


  

## Architecture Overview

  

### Core Components

1.  **Frontend (Next.js)**

- Page Components (`page.tsx`)

- UI Components (`Camera.tsx`, `ChatBox.tsx`, `FoodList.tsx`)

- Shadcn UI Components (`Input.tsx`, `ScrollArea.tsx`, `Button.tsx`)

  

2.  **Backend (Next.js API Routes)**

- Extract API (`/api/extract`)

- Chat API (`/api/chat`)

  

3.  **External Services**

- OpenAI API (GPT-4o)

- Tesseract.js (OCR)

  

### Libraries & Technologies

- Next.js 14 (React Framework)

- TypeScript

- Tailwind CSS

- Radix UI

- Tesseract.js (OCR)

- OpenAI API

- Shadcn UI Components

  

## Setup Instructions

  

### Prerequisites

```
Node.js >=  18

npm  or  yarn

OpenAI  API  key
```

### Installation
```
# Clone repository
git clone <repository-url>

# Install dependencies
npm install

# Environment setup
cp .env.example .env.local
```

### Environment Variables
OPENAI_API_KEY=your_api_key_here

### Run Development Server
```
npm run dev
```

## Component Documentation
### Camera Component
Components responsible for:
- Image capture from device camera
- File upload functionality
- OCR text extraction using Tesseract.js
- Sending extracted text to OpenAI API

### ChatBox Component
Features:
- Real-time chat interface
- Auto-scrolling messages
- Message history management
- Integration with OpenAI API for responses

## API Routes
### Extract API
- Accepts POST requests
- Processes OCR text
- Returns structured menu items
### Chat API
- Handles chat messages
- Integrates with OpenAI
- Provides context-aware responses

## Usage Guide
### Scanning Menu
- Click "Take Photo" button
- Allow camera access
- Take picture of menu
- Wait for OCR processing

### Viewing Results
- Extracted menu items appear as cards
- Items are automatically translated if specified

### Using Chat
- Type questions about menu items
- AI responds with relevant information
- Chat history is maintained during session