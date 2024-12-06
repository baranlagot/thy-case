# Menu Scanner & AI Chat Application

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-412991)](https://openai.com/)

An AI-powered menu scanner and chat application that helps users understand and interact with menu items.

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Setup Instructions](#setup-instructions)
- [Usage Guide](#usage-guide)
- [Component Documentation](#component-documentation)
- [Development Guidelines](#development-guidelines)
- [Testing](#testing)
- [Production Deployment](#production-deployment)

## Architecture Overview

### Core Components
1. **Frontend (Next.js)**
   - Page Components (`page.tsx`)
   - UI Components (`Camera.tsx`, `ChatBox.tsx`, `FoodList.tsx`)
   - Shadcn UI Components (`Input.tsx`, `ScrollArea.tsx`, `Button.tsx`)

2. **Backend (Next.js API Routes)**
   - Extract API (`/api/extract`)
   - Chat API (`/api/chat`)

3. **External Services**
   - OpenAI API (GPT-3.5 Turbo)
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
```bash
Node.js >= 18
npm or yarn
OpenAI API key