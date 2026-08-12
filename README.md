# 🤖 AI Resume Analyzer & Candidate Ranking Platform

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
├── reports/                    # Generated Excel Export Files Output
├── clean_requirements.txt      # Cleaned Python Dependencies
├── requirements.txt            # Project Dependencies
├── .env.example                # Sample Environment Variables Config
├── README.md                   # Project Documentation
└── .gitignore
=======
├── app/                              # FastAPI Backend Application
│   ├── api/                          # API Route Handlers
│   │   ├── candidate_portal.py       # Full candidate pipeline (/candidate/analyze)
│   │   ├── candidate_rewriter.py     # Analyze + rewrite without PDF (/candidate/rewrite)
│   │   ├── candidates.py             # Candidate list, search, filter, delete
│   │   ├── comparison.py             # Side-by-side comparison (/compare)
│   │   ├── dashboard.py              # Analytics stats (/dashboard)
│   │   ├── download_resume.py        # Generated PDF download (/candidate/download)
│   │   ├── evaluation.py             # Single / batch evaluation (/evaluate)
│   │   ├── history.py                # Per-candidate evaluation history (/history)
│   │   ├── job_description.py        # Job description CRUD (/jobs)
│   │   ├── job_history.py            # Evaluations for one job (/jobs/{id}/history)
│   │   ├── reports.py                # Excel report download (/reports/evaluation)
│   │   ├── routes.py                 # Health / welcome routes
│   │   ├── upload.py                 # Single and ZIP uploads (/upload)
│   │   ├── resume_generator.py       # ⚠️ Legacy duplicate of /candidate/analyze (not mounted)
│   │   └── schemas.py                # Route-level schemas
│   │
│   ├── chains/                       # LangChain LCEL pipelines
│   │   ├── evaluation_chain.py       # Resume vs JD evaluation (structured output)
│   │   └── metadata_chain.py         # Structured resume metadata extraction
│   │
│   ├── parsers/                      # Output parsers
│   │   └── evaluation_parser.py      # Pydantic evaluation output parser
│   │
│   ├── prompts/                      # Prompt templates
│   │   ├── evaluation_prompt.py      # Weighted ATS evaluation prompt
│   │   ├── metadata_prompt.py        # Metadata extraction prompt
│   │   └── resume_rewriter_prompt.py # ATS resume rewriting prompt
│   │
│   ├── schemas/                      # Pydantic data models
│   │   ├── ats_breakdown.py          # Per-category ATS scores
│   │   ├── ats_request.py / ats_response.py
│   │   ├── candidate_filter.py / candidate_response.py
│   │   ├── evaluation_filter.py / evaluation_request.py
│   │   ├── evaluation_schema.py      # ResumeEvaluation model
│   │   ├── job_description.py        # JD create/update payloads
│   │   ├── resume_metadata.py        # ResumeMetadata model
│   │   └── resume_rewrite_schema.py  # ResumeRewrite model
│   │
│   ├── services/                     # Core business logic
│   │   ├── ats_service.py            # Candidate-portal analyze pipeline
│   │   ├── bm25_service.py           # BM25 retriever factory
│   │   ├── candidate_ai_service.py   # ⚠️ Legacy duplicate evaluator (unused)
│   │   ├── candidate_database.py     # SQLite candidate persistence
│   │   ├── candidate_service.py      # Chroma-metadata candidate queries
│   │   ├── chunker.py                # Recursive text splitter (500/100)
│   │   ├── comparison_service.py     # Head-to-head comparison engine
│   │   ├── dashboard_service.py      # Analytics aggregation
│   │   ├── database.py               # SQLite connection + schema init
│   │   ├── duplicate_detector.py     # SHA-256 fingerprint & action decision
│   │   ├── embedding_model.py        # Local bge-small-en-v1.5 embeddings
│   │   ├── evaluation_database.py    # Evaluation persistence & filtering
│   │   ├── evaluator.py              # Batch evaluation orchestrator
│   │   ├── excel_exporter.py         # Styled 3-sheet Excel exporter
│   │   ├── file_reader.py            # PDF / DOCX / TXT text extraction
│   │   ├── history_service.py        # Per-candidate evaluation history
│   │   ├── hybrid_search.py          # Chroma + BM25 rank fusion
│   │   ├── ingest_folder.py          # Folder ingestion (CLI)
│   │   ├── ingestion.py              # Single-file ingestion pipeline
│   │   ├── jd_reader.py              # Job description file reader
│   │   ├── job_description_service.py# JD database operations
│   │   ├── job_service.py            # Job id generation helper
│   │   ├── llm_service.py            # Gemini singleton + ask_llm
│   │   ├── metadata_extractor.py     # Metadata chain runner
│   │   ├── pdf_reader.py             # PyMuPDF reader (legacy)
│   │   ├── rag_service.py            # Hybrid-search / direct-text evaluation
│   │   ├── resume_generator.py       # ReportLab ATS PDF generator
│   │   ├── resume_pipeline.py        # Shared analyze+rewrite pipeline
│   │   ├── resume_rewriter.py        # Gemini ATS rewrite runner
│   │   ├── retriever.py              # Vector-store retriever wrapper
│   │   ├── text_cleaner.py           # Text normalization
│   │   ├── upload_service.py         # Single / multiple resume uploads
│   │   ├── vector_store.py           # ChromaDB load, add, delete, retrieve
│   │   └── zip_upload_service.py     # ZIP extraction and batch ingestion
│   │
│   ├── generated_resumes/            # ATS-rewritten PDF output
│   ├── templates/                    # (reserved for templates)
│   ├── app.py                        # FastAPI application entrypoint
│   ├── ingest.py                     # CLI ingestion function
│   └── main.py                       # CLI batch pipeline
│
├── frontend/                         # React + Vite + TypeScript frontend
│   ├── src/
│   │   ├── api/client.ts             # Axios client (all backend calls)
│   │   ├── components/
│   │   │   ├── CandidatesSection.tsx # Candidate directory, search, filters
│   │   │   ├── EvaluateSection.tsx   # JD input + evaluate all / one
│   │   │   ├── Layout.tsx            # Sticky header navigation
│   │   │   ├── ReportsSection.tsx    # Excel report download
│   │   │   ├── ResultsSection.tsx    # Stored results with filters
│   │   │   └── UploadSection.tsx     # Single / multi / ZIP upload
│   │   ├── types/index.ts            # TypeScript interfaces
│   │   ├── App.tsx                   # Root component (section coordination)
│   │   ├── main.tsx                  # React entry point
│   │   └── index.css                 # Tailwind import + base styles
│   ├── package.json
│   ├── vite.config.ts                # React + Tailwind plugins
│   ├── tsconfig*.json
│   └── index.html
│
├── data/                             # Local file & database storage
│   ├── resume_analyzer.db            # SQLite database (auto-created)
│   ├── resumes/                      # Uploaded resume files
│   ├── job_descriptions/             # Reference JD text files
│   ├── temp/                         # Candidate-portal temp uploads
│   ├── temp_upload/                  # ZIP upload staging
│   └── generated_resumes/            # (reserved)
│
├── chroma_db/                        # ChromaDB vector store persistence
├── output/                           # Generated Excel reports
├── scratch/                          # Ad-hoc scripts
├── requirements.txt                  # Pinned Python dependencies
├── clean_requirements.txt            # Copy of requirements.txt
├── .env                              # GOOGLE_API_KEY (gitignored)
├── .gitignore
└── README.md
>>>>>>> Stashed changes
```

---

# ⚙ Installation

Clone the repository

```bash
git clone https://github.com/yourusername/ai-resume-analyzer.git
cd ai-resume-analyzer
```

Create virtual environment

```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

Activate virtual environment

1. **Create and Activate Virtual Environment**:

   **Windows**:
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

   **Linux / macOS**:
   ```bash
   python3 -m venv venv
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

## 🧪 CLI Batch Execution (Optional)

If you prefer to run batch processing directly via Python script without launching the web server:

```bash
python -m app.main
```

This will:
1. Ingest all resumes from `data/resumes/`.
2. Extract metadata and index into ChromaDB + BM25.
3. Read Job Description from `data/job_descriptions/mearn_stack.txt`.
4. Perform RAG evaluation across all resumes.
5. Save results into `data/database.db`.
6. Export styled Excel report to `reports/`.
7. Print candidate leaderboard and detailed evaluations in terminal output.

---

## 📊 Sample Excel Report Output

The generated Excel report (`reports/evaluation_report.xlsx`) contains:

- **Candidate Name, Email, & Contact**
- **Match Score (0 - 100)** with color-highlighted cells
- **Hiring Recommendation** (`Strong Hire`, `Hire`, `Consider`, `Reject`)
- **Experience Summary**
- **Matching Skills List**
- **Missing Skills List**
- **Strengths & Weaknesses**
- **Recommendation Rationale**

---

## 📈 Future Enhancements

- 🔐 **JWT User Authentication & Role-Based Access (HR / Admin / Viewer)**
- ✉️ **Automated Candidate Email Notifications & Interview Scheduling**
- 🤖 **AI-Generated Custom Interview Questions Based on Skill Gaps**
- 📄 **Dynamic PDF Report Exporting (in addition to Excel)**
- 🐳 **Docker & Docker Compose Containerization**
- ☁️ **Cloud Deployment Deployment Scripts (AWS ECS / Azure Web Apps)**

---

## 👨‍💻 Author

**Arslan Ali**  
AI Engineer | Machine Learning | Generative AI | LangChain | FastAPI  

---

## 📜 License

This project is licensed under the **MIT License**.

---

## ⭐ Acknowledgements

- [FastAPI](https://fastapi.tiangolo.com/)
- [LangChain](https://www.langchain.com/)
- [Google Gemini API](https://ai.google.dev/)
- [ChromaDB](https://www.trychroma.com/)
- [HuggingFace Transformers](https://huggingface.co/)
- [PyMuPDF](https://pymupdf.readthedocs.io/)
- [React](https://react.dev/) & [Vite](https://vitejs.dev/)
