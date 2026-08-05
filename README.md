# 🤖 AI Resume Analyzer

An intelligent AI-powered Resume Screening & Candidate Ranking System built with **FastAPI**, **LangChain**, **Google Gemini**, **ChromaDB**, and **SQLite**.

The system automates resume screening by extracting candidate information, indexing resumes into a vector database, evaluating resumes against a Job Description using Retrieval-Augmented Generation (RAG), ranking candidates, and providing advanced filtering capabilities for HR professionals.

---

# 🚀 Features

## 📄 Resume Management

- Upload PDF resumes
- Upload DOCX resumes
- Upload ZIP folders containing multiple resumes
- Automatic duplicate detection using SHA-256 hashing
- Resume update detection
- Resume deletion

---

## 🧠 AI Resume Parsing

Automatically extracts:

- Candidate Name
- Email
- Phone Number
- Education
- Experience
- Current Role
- Location

using **Google Gemini + LangChain Structured Output Parsing**.

---

## 🔍 Semantic Resume Search

- Resume chunking
- Vector embeddings
- ChromaDB vector storage
- Semantic retrieval using LangChain

---

## 🎯 AI Resume Evaluation

Compare resumes against any Job Description.

The AI returns:

- Match Score
- Hiring Recommendation
- Matching Skills
- Missing Skills
- Strengths
- Weaknesses
- Overall Analysis

---

## 📊 Candidate Ranking

Candidates are ranked automatically based on:

- Match Score
- Hiring Recommendation

---

## 📂 Evaluation Database

All evaluation results are stored inside SQLite including:

- Candidate Details
- Resume Metadata
- AI Evaluation
- Match Score
- Recommendation

---

## 🔎 Advanced Filtering

Filter candidates using:

- Minimum Match Score
- Maximum Match Score
- Hiring Recommendation
- Experience Range
- Current Role
- Education
- Location
- Matching Skills
- Missing Skills

---

## 📑 Reports

Generate Excel reports containing:

- Candidate Information
- AI Evaluation
- Match Scores
- Recommendations

---

# 🛠 Tech Stack

## Backend

- FastAPI
- Python

## AI

- LangChain
- Google Gemini
- RAG (Retrieval-Augmented Generation)

## Vector Database

- ChromaDB

## Database

- SQLite

## Embedding Model

- HuggingFace Sentence Transformers

## Document Processing

- PyMuPDF
- python-docx

---

# 📁 Project Structure

```
resume-analyzer/
│
├── app/
│   ├── api/
│   ├── chains/
│   ├── prompts/
│   ├── schemas/
│   ├── services/
│   ├── ingest.py
│   └── app.py
│
├── data/
│   ├── resumes/
│   ├── chroma/
│   └── database.db
│
├── reports/
│
├── requirements.txt
├── .env.example
├── README.md
└── .gitignore
```

---

# ⚙ Installation

Clone the repository

```bash
git clone https://github.com/yourusername/ai-resume-analyzer.git
```

Move into the project

```bash
cd ai-resume-analyzer
```

Create virtual environment

```bash
python -m venv venv
```

Activate virtual environment

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

---

# 🔑 Environment Variables

Create a `.env` file

```env
GOOGLE_API_KEY=YOUR_GEMINI_API_KEY
```

---

# ▶ Run the Project

```bash
uvicorn app.app:app --reload
```

Open

```
http://127.0.0.1:8000/docs
```

---

# 📌 API Endpoints

## Upload

```
POST /upload/
```

Upload a single resume.

---

```
POST /upload/zip
```

Upload multiple resumes inside a ZIP file.

---

## Evaluation

```
POST /evaluate/
```

Evaluate all uploaded resumes.

---

```
POST /evaluate/{filename}
```

Evaluate a single resume.

---

## Candidates

```
GET /candidates/
```

View candidates.

---

```
GET /candidates/search
```

Search candidates.

---

```
DELETE /candidates/{filename}
```

Delete a candidate.

---

## Filters

```
GET /evaluations/filter
```

Advanced filtering endpoint.

---

## Reports

```
GET /reports/evaluation
```

Download evaluation report.

---

# 🧠 AI Workflow

```
Resume
   │
   ▼
Upload
   │
   ▼
Duplicate Detection
   │
   ▼
Metadata Extraction
   │
   ▼
Chunking
   │
   ▼
Embeddings
   │
   ▼
ChromaDB
   │
   ▼
Job Description
   │
   ▼
RAG Retrieval
   │
   ▼
Gemini Evaluation
   │
   ▼
SQLite Storage
   │
   ▼
Filtering & Ranking
   │
   ▼
Excel Report
```

---

# 📈 Future Enhancements

- JWT Authentication
- HR Dashboard (React)
- Resume Comparison
- Interview Question Generation
- Email Notifications
- ATS Compatibility Score
- PDF Report Generation
- Docker Deployment
- Cloud Deployment (AWS/Azure)

---

# 👨‍💻 Author

**Arslan Ali**

AI Engineer | Machine Learning | Generative AI | LangChain | FastAPI

---

# 📜 License

This project is licensed under the MIT License.

---

# ⭐ Acknowledgements

- FastAPI
- LangChain
- Google Gemini
- ChromaDB
- HuggingFace
- PyMuPDF