# 🤖 AI Resume Analyzer

<<<<<<< Updated upstream
An intelligent AI-powered Resume Screening & Candidate Ranking System built with **FastAPI**, **LangChain**, **Google Gemini**, **ChromaDB**, and **SQLite**.

The system automates resume screening by extracting candidate information, indexing resumes into a vector database, evaluating resumes against a Job Description using Retrieval-Augmented Generation (RAG), ranking candidates, and providing advanced filtering capabilities for HR professionals.
=======
An AI-powered **Resume Screening, Candidate Ranking, and HR Analytics System** built with **FastAPI**, **React + Vite + TypeScript**, **LangChain**, **Google Gemini**, **ChromaDB**, **BM25 Hybrid Search**, and **SQLite**.

The system automates the end-to-end recruitment screening workflow: uploading multi-format resumes, detecting duplicate files, automatically extracting structured candidate profiles, indexing documents into a hybrid vector + keyword search engine, performing Retrieval-Augmented Generation (RAG) evaluations against Job Descriptions, ranking candidates, comparing candidates head-to-head, providing HR analytics, generating ATS-optimized resume rewrites, and exporting styled Excel reports.
>>>>>>> Stashed changes

---

# 🚀 Features

<<<<<<< Updated upstream
## 📄 Resume Management

- Upload PDF resumes
- Upload DOCX resumes
- Upload ZIP folders containing multiple resumes
- Automatic duplicate detection using SHA-256 hashing
- Resume update detection
- Resume deletion
=======
### 📄 1. Document Management & Intelligent Ingestion
- **Multi-Format Support**: Upload single or multiple `.pdf` and `.docx` resumes.
- **Bulk ZIP Upload**: Ingest ZIP archives containing many candidate resumes at once (`.pdf`/`.docx` files are discovered recursively).
- **SHA-256 Duplicate Detection**: A content fingerprint is computed for every resume; the system classifies each upload as `insert`, `update` (same filename, new content), or `duplicate` (same content already indexed).
- **Document Text Extraction**: Powered by PyMuPDF (`fitz`) for PDFs and `python-docx` for DOCX files. Plain `.txt` files are also supported in the candidate portal.

### 🧠 2. AI-Powered Structured Resume Parsing
- **Automated Metadata Extraction**: **Google Gemini** with **LangChain structured output parsing** converts unstructured resume text into a typed Pydantic schema (`ResumeMetadata`) containing:
  - Candidate Full Name
  - Email Address & Phone Number
  - Total Years of Experience (float)
  - Current/Latest Job Role
  - Highest Education Level
  - Geographical Location
  - Key Technical & Soft Skills
  - LinkedIn / GitHub / Portfolio links (when available)
  - One-sentence Professional Summary

### 🔍 3. Hybrid Search Engine (Vector + Keyword)
- **Dense Vector Search**: Resume chunks are embedded locally with HuggingFace `BAAI/bge-small-en-v1.5` and indexed in **ChromaDB**.
- **Sparse Keyword Search**: **BM25** (`rank_bm25` via LangChain) provides exact term matching (certifications, tools, domain terms).
- **Weighted Rank Fusion**: Semantic (Chroma) and keyword (BM25) results are merged per candidate using a rank-based scoring scheme, giving accurate context retrieval for evaluation.

### 🎯 4. RAG-Based Job Description Evaluation
- **Job Description Management**: Create, list, view, update, and delete job descriptions (title + department + description text) via the `/jobs/` API. Each JD gets an auto-incremented `job_id`.
- **Contextual Chunk Retrieval**: For each candidate, the top relevant resume chunks are retrieved with hybrid search against the job description.
- **Deep AI Evaluation**: Evaluates candidates against job requirements and generates:
  - **Match Score (0–100)**, weighted roughly as Skills 35% / Experience 25% / Keywords 15% / Projects 10% / Education 10% / Formatting 5%
  - **Hiring Recommendation**: `Hire`, `Maybe`, or `Reject`
  - **Recommendation Rationale**
  - **Skill Gap Analysis**: `Matching Skills` vs. `Missing Skills`
  - **Strengths & Weaknesses**
  - **Per-Category ATS Breakdown** (skills, experience, education, projects, keywords, formatting — each with score + reason)
  - **ATS Grade** (A+ through F), exactly 5 overall feedback items, resume strengths, and resume improvements

### ⚔️ 5. Side-by-Side Candidate Comparison
- `GET /compare/?filename1=...&filename2=...` compares two previously evaluated candidates head-to-head.
- Determines per-category winners (match score, experience, matching/missing skills, recommendation, education) and an overall winner with win percentages.

### 📊 6. HR Analytics & Leaderboards
- **Dashboard Analytics** (`GET /dashboard/`): total evaluated candidates, recommendation counts and percentages, average/highest/lowest score, average experience, score and experience distributions, top 10 matching skills, and top 5 candidates.

### 🔎 7. Multi-Criteria Candidate Filtering & Search
- **Candidate directory** (`GET /candidates/`): paginated list with optional filters for location, education, current role, and experience range.
- **Free-text search** (`GET /candidates/search`): substring match on candidate name, email, current role, or filename.
- **Stored results** (`GET /evaluate/results`): filter by match-score range, recommendation, location, education, current role, experience range, matching skill, or missing skill — with sorting and pagination.

### 📑 8. Automated Excel Report Generation
- Exports a styled `.xlsx` workbook (`output/evaluation_results.xlsx`) via `openpyxl` with three sheets: **Candidate Ranking**, **Detailed Evaluation**, and **Candidate Metadata**.
- Includes frozen header rows, auto filters, auto-sized columns, and green/yellow/red conditional formatting on scores.

### ✍️ 9. Candidate Portal — ATS Analysis & Resume Rewriting
- **`POST /candidate/analyze`**: candidates upload a resume (`.pdf`, `.docx`, or `.txt`) plus a job description and receive, in one call:
  - Extracted metadata
  - ATS evaluation (the same weighted scoring described above)
  - A rewritten, ATS-optimized resume (structured `ResumeRewrite` with summary, categorized skills, experience bullets, projects, education, certifications, and improvement suggestions)
  - An ATS-friendly PDF generated with **ReportLab** (`app/generated_resumes/<name>_ATS_Resume.pdf`), downloadable via `GET /candidate/download/{filename}` (basename + `.pdf`-only guard against path traversal)
- **`POST /candidate/rewrite`**: the same analysis + rewrite pipeline without PDF generation.

### 💻 10. Modern Full-Stack User Interface
- Single-page HR dashboard built with **React 19**, **Vite**, **TypeScript**, and **Tailwind CSS v4**.
- Five sections navigated via a sticky header: **Upload**, **Evaluate**, **Candidates**, **Results**, and **Reports**.
>>>>>>> Stashed changes

---

## 🧠 AI Resume Parsing

<<<<<<< Updated upstream
Automatically extracts:

- Candidate Name
- Email
- Phone Number
- Education
- Experience
- Current Role
- Location

using **Google Gemini + LangChain Structured Output Parsing**.
=======
### Backend & AI Frameworks
| Layer | Technology |
| :--- | :--- |
| **API Framework** | FastAPI (Python 3.11) |
| **Server** | Uvicorn (ASGI) |
| **AI / LLM Orchestration** | LangChain (`langchain-google-genai`) |
| **LLM Provider** | Google Gemini (`gemini-flash-latest`, temperature 0) |
| **Embeddings** | HuggingFace `BAAI/bge-small-en-v1.5` (local, via `langchain-huggingface`) |
| **Vector Database** | ChromaDB (`chroma_db/`) via `langchain-chroma` |
| **Keyword Search** | BM25 (`rank-bm25` via `langchain-community`) |
| **Relational Database** | SQLite (Python `sqlite3`) — `data/resume_analyzer.db` |
| **Document Parsers** | PyMuPDF (`fitz`), `python-docx` |
| **PDF Generation** | ReportLab |
| **Excel Export** | `openpyxl` |

### Frontend
| Layer | Technology |
| :--- | :--- |
| **UI Library** | React 19 |
| **Build Tool** | Vite |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) |
| **HTTP Client** | Axios |
| **Notifications** | `react-hot-toast` |
| **Linting** | `oxlint` |
>>>>>>> Stashed changes

---

## 🔍 Semantic Resume Search

<<<<<<< Updated upstream
- Resume chunking
- Vector embeddings
- ChromaDB vector storage
- Semantic retrieval using LangChain
=======
```
                  ┌─────────────────────────────┐
                  │ Resume Upload (.pdf/.docx,  │
                  │  .zip, or .txt via portal)  │
                  └──────────────┬──────────────┘
                                 │
                                 ▼
                  ┌─────────────────────────────┐
                  │ SHA-256 Hash Check          │
                  │ (insert / update / duplicate)│
                  └──────────────┬──────────────┘
                                 │
                                 ▼
                  ┌─────────────────────────────┐
                  │ Text Extraction             │
                  │ (PyMuPDF / python-docx)     │
                  └──────────────┬──────────────┘
                                 │
                  ┌──────────────┴──────────────┐
                  │                             │
                  ▼                             ▼
   ┌──────────────────────────┐   ┌──────────────────────────┐
   │ Gemini Structured Parsing│   │ Text Chunking            │
   │  (ResumeMetadata)        │   │ (500 chars / 100 overlap)│
   └─────────────┬────────────┘   └─────────────┬────────────┘
                 │                              │
                 │                ┌─────────────┴─────────────┐
                 │                │                           │
                 │                ▼                           ▼
                 │   ┌────────────────────────┐   ┌────────────────────────┐
                 │   │ Dense Embeddings       │   │ Sparse BM25            │
                 │   │ (bge-small-en-v1.5)    │   │ Keyword Indexing       │
                 │   └───────────┬────────────┘   └───────────┬────────────┘
                 │               │                            │
                 │               ▼                            ▼
                 │   ┌────────────────────────┐   ┌────────────────────────┐
                 │   │ Chroma Vector Store    │   │ BM25 Search Index      │
                 │   └───────────┬────────────┘   └───────────┬────────────┘
                 │               │                            │
                 │               └─────────────┬──────────────┘
                 │                             │
                 │                             ▼
                 │              ┌─────────────────────────────┐
                 │              │ Hybrid Retrieval            │
                 │              │ (Chroma + BM25 rank fusion) │
                 │              └─────────────┬───────────────┘
                 │                            │
                 │              ┌─────────────┴───────────────┐
                 │              │  Job Description (SQLite)   │
                 │              └─────────────┬───────────────┘
                 │                            │
                 │                            ▼
                 │              ┌─────────────────────────────┐
                 │              │ Gemini RAG Evaluation       │
                 │              │  - Match Score (0-100)      │
                 │              │  - Hire/Maybe/Reject        │
                 │              │  - ATS Grade (A+ to F)      │
                 │              │  - Skill Gap Analysis       │
                 │              └─────────────┬───────────────┘
                 │                            │
                 └──────────────┬─────────────┘
                                │
                                ▼
                 ┌─────────────────────────────┐
                 │ SQLite Database             │
                 │  - job_descriptions         │
                 │  - candidates               │
                 │  - evaluations              │
                 └─────────────┬───────────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
              ▼                                 ▼
   ┌──────────────────────────┐   ┌──────────────────────────┐
   │ React HR Dashboard       │   │ Styled Excel Export      │
   │ (upload / evaluate /     │   │ (output/evaluation_results│
   │  candidates / results /  │   │  .xlsx via openpyxl)     │
   │  reports)                │   └──────────────────────────┘
   └──────────────────────────┘
```

### Candidate Portal Flow (`POST /candidate/analyze`)

```
Upload Resume + Job Description (multipart form)
  → save to data/temp/<uuid>.<ext>
  → read_document() + clean_text()
  → extract_metadata()          (Gemini → ResumeMetadata)
  → evaluate_resume(text)       (direct text, no RAG → ResumeEvaluation)
  → rewrite_resume()            (Gemini → ResumeRewrite)
  → generate_resume_pdf()       (ReportLab → app/generated_resumes/…_ATS_Resume.pdf)
  → return {metadata, evaluation, rewritten_resume, pdf {filename, download_url}}
  → delete temporary file (finally block)
```
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
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

<<<<<<< Updated upstream
Clone the repository

```bash
git clone https://github.com/yourusername/ai-resume-analyzer.git
```

Move into the project

```bash
cd ai-resume-analyzer
```

Create virtual environment
=======
### 1. System Routes
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Welcome message |
| `GET` | `/health` | Health check (`{"status": "healthy"}`) |

### 2. Upload APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/upload/` | Upload a single resume (`.pdf` or `.docx`). Returns `{filename, status}` where status is `uploaded` / `updated` / `duplicate`. |
| `POST` | `/upload/zip` | Upload a ZIP archive of resumes for batch processing. Returns `{uploaded, updated, duplicates, failed, results}`. |

### 3. Job Description APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/jobs/` | Create a job description (`{title, department?, description}`) → returns new `job_id`. |
| `GET` | `/jobs/` | List all job descriptions. |
| `GET` | `/jobs/{job_id}` | Get one job description. |
| `PUT` | `/jobs/{job_id}` | Update a job description. |
| `DELETE` | `/jobs/{job_id}` | Delete a job description. |
| `GET` | `/jobs/{job_id}/history` | All evaluations for a specific job. |

### 4. Evaluation APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/evaluate/` | Evaluate **all** indexed resumes against a `job_id`. Saves results to SQLite, exports Excel, and returns per-candidate `{filename, metadata, evaluation}`. |
| `POST` | `/evaluate/{filename}` | Evaluate a single resume (by filename) against a `job_id`. |
| `GET` | `/evaluate/results` | Stored evaluations with pagination and filters: `match_score_min`, `match_score_max`, `recommendation`, `location`, `education`, `current_role`, `experience_min`, `experience_max`, `matching_skill`, `missing_skill`, `sort_by`, `order`. |

### 5. Candidate Management & Search APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/candidates/` | Paginated candidate list; filters: `location`, `education`, `current_role`, `experience_min`, `experience_max`. |
| `GET` | `/candidates/search` | Free-text search (`search` param) over name / email / role / filename. |
| `DELETE` | `/candidates/{filename}` | Delete candidate from ChromaDB and remove the stored resume file. |

### 6. Comparison, History & Analytics APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/compare/?filename1=&filename2=` | Head-to-head comparison of two evaluated candidates (per-category winners + overall). |
| `GET` | `/history/{filename}` | Evaluation history for one candidate (joins job titles). |
| `GET` | `/dashboard/` | Aggregated HR analytics (counts, percentages, averages, distributions, top skills, top candidates). |

### 7. Candidate Portal APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/candidate/analyze` | Multipart: `resume` file (`.pdf`/`.docx`/`.txt`) + `job_description` text. Returns `{metadata, evaluation, rewritten_resume, pdf:{filename, download_url}}`. |
| `POST` | `/candidate/rewrite` | Same as analyze but without PDF generation. Returns `{metadata, evaluation, rewritten_resume}`. |
| `GET` | `/candidate/download/{filename}` | Download a generated ATS resume PDF (`.pdf` only, basename-guarded). |

### 8. Reports APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/reports/evaluation` | Download the latest Excel report (`output/evaluation_results.xlsx`). |

> Interactive API documentation is available at `http://127.0.0.1:8000/docs` (Swagger UI) and `http://127.0.0.1:8000/redoc`.

---

## ⚙️ Installation & Setup

### Prerequisites
- **Python 3.10+** (developed and tested on **3.11.9**)
- **Node.js 18+** & **npm**
- **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/))

---

### Step 1: Clone Repository & Environment Setup

```bash
git clone https://github.com/arslanali67/Resume_Analyzer-AI-Project.git
cd resume_analyzer
```

Create a `.env` file in the project root:

```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

---

### Step 2: Backend Setup

1. **Create and activate a virtual environment**:

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

2. **Install backend dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

   > The first time you upload or evaluate a resume, the local embedding model (`BAAI/bge-small-en-v1.5`) is downloaded from HuggingFace and cached.

3. **Start the FastAPI backend server**:
   ```bash
   uvicorn app.app:app --reload --port 8000
   ```

   - Swagger UI: `http://127.0.0.1:8000/docs`
   - ReDoc: `http://127.0.0.1:8000/redoc`

---

### Step 3: Frontend Setup

1. Open a new terminal and navigate to `frontend`:
   ```bash
   cd frontend
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Start the Vite development server**:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

> The frontend calls `http://127.0.0.1:8000` by default. To override it, set `VITE_API_BASE_URL` (e.g. in a `frontend/.env.local` file).

---

## 🧪 CLI Batch Execution (Optional)

If you prefer to run batch processing directly via Python without the web server:
>>>>>>> Stashed changes

```bash
python -m venv venv
```

<<<<<<< Updated upstream
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
=======
This will:
1. Ingest all PDF resumes from `data/resumes/` into ChromaDB.
2. Read the job description from `data/job_descriptions/mearn_stack.txt`.
3. Evaluate every resume against that job description (hybrid search + Gemini).
4. Save candidates and evaluations into `data/resume_analyzer.db`.
5. Export a styled Excel report to `output/evaluation_results.xlsx`.
6. Print a ranked leaderboard and detailed evaluations to the terminal.
>>>>>>> Stashed changes

---

# 🔑 Environment Variables

<<<<<<< Updated upstream
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
=======
The generated report (`output/evaluation_results.xlsx`) contains three sheets:

- **Candidate Ranking** — rank, candidate, resume, score, recommendation, experience, current role, email, phone, location
- **Detailed Evaluation** — score, matching/missing skills, strengths, weaknesses, experience summary, recommendation + reason
- **Candidate Metadata** — contact details, education, experience, role, location

All sheets have styled headers, frozen top rows, auto filters, and score-based conditional formatting (green ≥ 80, yellow 50–79, red < 50).

---

## 🗄 Database Schema

SQLite database at `data/resume_analyzer.db` (auto-created on startup by `initialize_database()`):

```sql
job_descriptions(id, title, department, description, created_at)

candidates(candidate_id, filename UNIQUE, candidate_name, email, phone,
           location, education, current_role, experience_years, created_at)

evaluations(evaluation_id, candidate_id FK→candidates ON DELETE CASCADE,
            job_id FK→job_descriptions ON DELETE CASCADE,
            match_score, recommendation, recommendation_reason,
            strengths, weaknesses, matching_skills, missing_skills,  -- JSON strings
            created_at)
```

**Where data lives:**
- **ChromaDB** (`chroma_db/`) — resume text chunks, embeddings, and candidate metadata (source of truth for candidates).
- **SQLite** (`data/resume_analyzer.db`) — job descriptions, candidate ID/filename mapping, evaluation history.
- **Filesystem** — uploaded resumes (`data/resumes/`), temp uploads (`data/temp/`, `data/temp_upload/`), generated PDFs (`app/generated_resumes/`), Excel reports (`output/`).

---

## 🔑 Environment Variables

| Variable | Required | Description |
| :--- | :--- | :--- |
| `GOOGLE_API_KEY` | ✅ Yes | Google Gemini API key, loaded via `python-dotenv` in `app/services/llm_service.py`. |

No other environment variables are currently used — data paths (`data/resumes`, `data/resume_analyzer.db`, `chroma_db`, `output`) are hardcoded in the services.

---

## 🧰 Example Usage

### Create a job description and evaluate all candidates

```bash
# 1. Create a JD (note the returned job_id)
curl -X POST http://127.0.0.1:8000/jobs/ \
  -H "Content-Type: application/json" \
  -d '{"title": "Python AI Engineer", "department": "Engineering", "description": "We are hiring a Python AI Engineer with experience in FastAPI, LangChain, and RAG systems..."}'

# 2. Evaluate all indexed resumes against job_id 1
curl -X POST http://127.0.0.1:8000/evaluate/ \
  -H "Content-Type: application/json" \
  -d '{"job_id": 1}'

# 3. Download the Excel report
curl -OJ http://127.0.0.1:8000/reports/evaluation
```

### Evaluate a single resume

```bash
curl -X POST "http://127.0.0.1:8000/evaluate/sample_resume.pdf" \
  -H "Content-Type: application/json" \
  -d '{"job_id": 1}'
```

### Compare two candidates

```bash
curl "http://127.0.0.1:8000/compare/?filename1=sample_resume.pdf&filename2=sample_resume1.pdf"
```

### Candidate portal (analyze + rewrite + PDF)

```bash
curl -X POST http://127.0.0.1:8000/candidate/analyze \
  -F "resume=@data/resumes/sample_resume.pdf" \
  -F "job_description=Python AI Engineer with FastAPI, LangChain and RAG experience."
```

---

## 🚧 Troubleshooting

| Problem | Likely cause / fix |
| :--- | :--- |
| `Error: Could not extract text from the uploaded resume.` | The PDF may be image-only (scanned) — text extraction requires a text layer. |
| Slow first evaluation / `Loading embedding model...` | The local `BAAI/bge-small-en-v1.5` model downloads from HuggingFace on first use. |
| `Duplicate resume detected` on upload | The resume content hash already exists in ChromaDB — expected behavior. Re-upload a modified file (or rename + change content) to force an update. |
| Frontend can't reach the backend | The backend must run on `http://127.0.0.1:8000` (CORS allows `localhost:3000` and `localhost:5173`). Start it before the frontend. |
| `No evaluation report found` on `/reports/evaluation` | Run `POST /evaluate/` (or `python -m app.main`) once to generate `output/evaluation_results.xlsx`. |
| CORS errors in the browser | The frontend dev server must be on port `5173` (or `3000`) — the allowed origins are hardcoded in `app/app.py`. |
| Rate limiting / quota errors from Gemini | Check your Google AI Studio quota and the `GOOGLE_API_KEY` in `.env`. |

### Known frontend/backend mismatch (not yet fixed)

The React dashboard sends `{"job_description": "..."}` to `POST /evaluate/`, while the backend currently expects `{"job_id": <int>}`. As a result, **the "Evaluate" section of the web UI will not work against the current backend** — the evaluate endpoints work via the CLI (`python -m app.main`) or direct API calls with `job_id`. This is the most significant integration gap in the project today.

---

## 🔭 Future Improvements

- 🔐 **JWT User Authentication & Role-Based Access (HR / Admin / Viewer)**
- ✉️ **Automated Candidate Email Notifications & Interview Scheduling**
- 🤖 **AI-Generated Custom Interview Questions Based on Skill Gaps**
- 📄 **Dynamic PDF Report Exporting (in addition to Excel)**
- 🐳 **Docker & Docker Compose Containerization**
- ☁️ **Cloud Deployment Scripts (AWS ECS / Azure Web Apps)**
- ⚡ **Background job processing (e.g., Celery / FastAPI `BackgroundTasks`)** — evaluation calls are currently synchronous and block the event loop
- 🧪 **Automated test suite** (only ad-hoc test scripts exist in `scratch/` and `app/services/`)
>>>>>>> Stashed changes

---

# 📌 API Endpoints

<<<<<<< Updated upstream
## Upload

```
POST /upload/
```

Upload a single resume.
=======
**Arslan Ali**  
AI Engineer | Machine Learning | Generative AI | LangChain | FastAPI
>>>>>>> Stashed changes

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