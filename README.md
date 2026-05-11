# MindMesh

## Intelligent Second Brain for Knowledge Workers

MindMesh is an AI-powered productivity platform that connects information from Gmail, Slack, Jira, Calendar, and uploaded documents into one unified workspace.

Instead of manually searching through emails, chats, tickets, and documents, NeuroSync AI automatically builds contextual relationships and provides:

* AI-generated daily briefings
* Semantic search
* Context relationship graphs
* Action and deadline extraction
* Cross-platform insights

---

# Problem Statement

Modern professionals work across multiple disconnected platforms such as emails, Slack, Jira, meetings, and documents. Important information often gets scattered, causing:

* Information overload
* Missed deadlines
* Reduced productivity
* Context switching

NeuroSync AI acts as a "Second Brain" by automatically connecting related information across platforms and surfacing relevant insights.

---

# Core Features

## 1. AI Daily Briefing

Generates a smart overview of:

* Urgent tasks
* Important discussions
* Deadlines
* Connected updates across platforms
* Suggested next actions

---

## 2. Semantic Search

Searches meaning instead of exact keywords using vector embeddings.

Example:

Searching:

```text
frontend deployment issue
```

can retrieve:

* Slack discussions
* Jira tickets
* Emails
* Meeting notes

related to deployment.

---

## 3. Context Relationship Graph

Builds a graph connecting:

* Gmail messages
* Slack discussions
* Jira tickets
* Calendar events

based on:

* shared tags
* topics
* related context

This helps users understand how information is connected across platforms.

---

## 4. Action Extraction

Automatically extracts:

* Tasks
* Commitments
* Deadlines
* Responsible persons

from conversations and documents.

---

## 5. Multi-Source Intelligence

NeuroSync AI combines information from:

* Gmail API
* Slack API
* Jira API
* Calendar data
* Uploaded documents

into a single unified intelligence system.

---

# How It Works

1. Data is collected from platforms like Gmail, Slack, Jira, Calendar, and uploaded documents.
2. The backend processes messages, tags, timestamps, and descriptions.
3. Sentence Transformers generate semantic embeddings.
4. ChromaDB stores embeddings for semantic search.
5. AI agents generate summaries, answers, and action items.

---

# Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS

---

## Backend

* FastAPI
* Python

---

## AI & NLP

* Sentence Transformers
* Semantic Embeddings
* AI Agent Architecture

---

## Database / Search

* ChromaDB
* NetworkX Graph Engine

---

## APIs

* Gmail API
* Slack API
* Jira API
* Calendar Integration

---

# Project Architecture

```text
MindMesh/
│
├── backend/
│   ├── agents/
│   ├── data/mock/
│   ├── models/
│   ├── routers/
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# Backend Architecture

* AI Agents → Generate summaries, answer questions, and extract actions.
* Graph Engine → Uses NetworkX to connect related information.
* Vector Store → Uses ChromaDB for semantic search.

---

# API Endpoints

## Health Check

```http
GET /api/health
```

---

## AI Briefing

```http
GET /api/briefing
```

---

## Ask Brain

```http
POST /api/ask
```

Body:

```json
{
  "question": "What are the urgent deployment issues?"
}
```

---

## Action Extraction

```http
GET /api/actions
```

---

## Context Graph

```http
GET /api/graph
```

---

## Semantic Search

```http
POST /api/search
```

Body:

```json
{
  "query": "frontend deployment",
  "n_results": 5
}
```

---

# Installation Guide

## 1. Clone Repository

```bash
git clone https://github.com/Abhishek-1710/MindMesh
cd MindMesh
```

---

# Backend Setup

## 2. Create Virtual Environment

```bash
python -m venv venv
```

---

## 3. Activate Virtual Environment

### Windows

```bash
venv\Scripts\activate
```

### Linux / Mac

```bash
source venv/bin/activate
```

---

## 4. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

---

## 5. Run Backend

```bash
uvicorn main:app --reload --port 8000
```

---

# Frontend Setup

## 6. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## 7. Run Frontend

```bash
npm run dev
```

---

# Deployment

## Backend Deployment

Recommended:

* Render
* Railway

---

## Frontend Deployment

Recommended:

* Vercel

---

# Future Improvements

* Real-time integrations
* Authentication system
* Notification support
* Persistent cloud vector database
* Advanced analytics

---

# Authors

* Abhishek & Amardeep

---

# License

This project is developed for educational and hackathon purposes.
