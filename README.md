# 🤖 AI Resume Analyzer & Candidate Ranking Platform

An enterprise-grade, AI-powered **Resume Screening, Candidate Ranking, and HR Analytics System** built with **FastAPI**, **React + Vite + TypeScript**, **LangChain**, **Google Gemini**, **ChromaDB**, **BM25 Hybrid Search**, and **SQLite**.

The system automates the end-to-end recruitment screening workflow: uploading multi-format resumes, detecting duplicate files, automatically extracting structured candidate profiles, indexing documents into a hybrid vector + keyword search engine, performing Retrieval-Augmented Generation (RAG) evaluations against Job Descriptions, ranking candidates, generating candidate comparison matrixes, providing real-time HR analytics, and exporting styled Excel reports.

---

## 🌟 Key Features

### 📄 1. Document Management & Intelligent Ingestion
- **Multi-Format Support**: Upload single or multiple `.pdf` and `.docx` resumes.
- **Bulk ZIP Upload**: Ingest nested ZIP archives containing hundreds of candidate resumes at once.
- **SHA-256 Duplicate Detection**: Automatically calculates SHA-256 file hashes to prevent duplicate resume ingestion or track document updates.
- **Document Text Extraction**: Powered by PyMuPDF (`fitz`) and `python-docx` for accurate text parsing.

### 🧠 2. AI-Powered Structured Resume Parsing
- **Automated Metadata Extraction**: Employs **Google Gemini** with **LangChain Structured Output Parsing** to convert unstructured resume text into standardized JSON schema containing:
  - Candidate Full Name
  - Email Address & Phone Number
  - Total Years of Experience (float)
  - Current/Latest Job Role
  - Highest Education Level
  - Geographical Location
  - Key Technical & Soft Skills
  - Work Experience Summary

### 🔍 3. Hybrid Search Engine (Vector + Keyword)
- **Dense Vector Search**: Embeds resume chunks using HuggingFace `sentence-transformers/all-MiniLM-L6-v2` and indexes them in **ChromaDB**.
- **Sparse Keyword Search**: Indexing via **BM25** (`rank_bm25`) for exact term matching (e.g., specific certifications, tools, or domain terms).
- **Reciprocal Rank Fusion (RRF)**: Combines dense semantic similarity and sparse keyword scores to yield highly accurate candidate retrieval.

### 🎯 4. RAG-Based Job Description Evaluation
- **Dynamic Job Description Management**: Upload JDs via `.pdf`, `.docx`, `.txt`, or paste plain text. Maintains active JDs and complete JD version history.
- **Contextual Chunk Retrieval**: Retrieves top relevant resume chunks per candidate matching the target Job Description.
- **Deep AI Evaluation**: Evaluates candidates against job requirements and generates:
  - **Match Score (0 – 100)**
  - **Hiring Recommendation**: `Strong Hire`, `Hire`, `Consider`, or `Reject`
  - **Recommendation Rationale**: Concise explanation of the verdict
  - **Skill Gap Analysis**: List of `Matching Skills` vs. `Missing Skills`
  - **Strengths & Weaknesses**: Granular pros and cons list

### ⚔️ 5. Side-by-Side Candidate Comparison
- Compare two or more candidates head-to-head against any Job Description.
- Generates side-by-side comparison matrixes detailing relative score rankings, skill overlap, unique strengths, and AI recommendation summaries.

### 📊 6. Interactive HR Analytics & Leaderboards
- **Executive Analytics**: Real-time metrics including total candidates, average match score, recommendation distribution, top matching skills, top missing skills, and candidate location breakdowns.
- **Leaderboards**: Automatically sorts and ranks candidates by AI match score and recommendation level.

### 🔎 7. Multi-Criteria Candidate Filtering & Search
- Filter candidate pool dynamically using:
  - Match Score Range (`min_score` to `max_score`)
  - Hiring Recommendation (`Strong Hire`, `Hire`, etc.)
  - Years of Experience Range (`min_exp` to `max_exp`)
  - Current Role, Location, and Education Level
  - Required Skills (`matching_skill`) or Gap Skills (`missing_skill`)
  - Full-text Hybrid Search query with pagination and custom sorting

### 📑 8. Automated Excel Report Generation
- Exports comprehensive candidate evaluation reports to formatted Excel (`.xlsx`) spreadsheets using `openpyxl`.
- Includes custom cell styling, header formatting, score highlighting, and organized skill summaries.

### 💻 9. Modern Full-Stack User Interface
- Modern, responsive SPA built with **React 18**, **Vite**, **TypeScript**, and **Tailwind CSS**.
- Multi-tab navigation: **Upload Resumes**, **Job Description & Evaluate**, **Candidates & Search**, **Detailed Results & Comparison**, and **Analytics & Reports**.

---

## 🛠 Tech Stack

### Backend & AI Frameworks
| Layer | Technology |
| :--- | :--- |
| **API Framework** | FastAPI (Python 3.10+) |
| **Server** | Uvicorn (ASGI) |
| **AI / LLM Orchestration** | LangChain (`langchain-google-genai`) |
| **LLM Provider** | Google Gemini (`gemini-flash-latest` / `gemini-1.5-pro`) |
| **Embeddings** | HuggingFace `sentence-transformers/all-MiniLM-L6-v2` |
| **Vector Database** | ChromaDB |
| **Keyword Search** | BM25 (`rank_bm25`) |
| **Relational Database** | SQLite (via Python `sqlite3`) |
| **Document Parsers** | PyMuPDF (`fitz`), `python-docx` |
| **Report Generation** | `openpyxl` |

### Frontend
| Layer | Technology |
| :--- | :--- |
| **UI Library** | React 18 |
| **Build Tool** | Vite |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |
| **HTTP Client** | Axios |

---

## 🧠 AI System Workflow Architecture

```
                                 ┌────────────────────────┐
                                 │ Candidate Resume Upload│
                                 │  (.pdf, .docx, .zip)   │
                                 └───────────┬────────────┘
                                             │
                                             ▼
                                 ┌────────────────────────┐
                                 │ SHA-256 Hash Check     │
                                 │ (Duplicate Prevention) │
                                 └───────────┬────────────┘
                                             │
                                             ▼
                                 ┌────────────────────────┐
                                 │ Text Extraction        │
                                 │ (PyMuPDF / python-docx)│
                                 └───────────┬────────────┘
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       │                                           │
                       ▼                                           ▼
         ┌──────────────────────────┐                ┌──────────────────────────┐
         │ Gemini Structured Parsing│                │ Text Chunking            │
         │  (Candidate Metadata)    │                │ (RecursiveTextSplitter)  │
         └─────────────┬────────────┘                └─────────────┬────────────┘
                       │                                           │
                       │                        ┌──────────────────┴──────────────────┐
                       │                        │                                     │
                       │                        ▼                                     ▼
                       │             ┌────────────────────┐                ┌────────────────────┐
                       │             │ Dense Embeddings   │                │ Sparse BM25        │
                       │             │  (HuggingFace)     │                │ Keyword Indexing   │
                       │             └──────────┬─────────┘                └──────────┬─────────┘
                       │                        │                                     │
                       │                        ▼                                     ▼
                       │             ┌────────────────────┐                ┌────────────────────┐
                       │             │ Chroma Vector Store│                │ BM25 Search Index  │
                       │             └──────────┬─────────┘                └──────────┬─────────┘
                       │                        │                                     │
                       │                        └──────────────────┬──────────────────┘
                       │                                           │
                       │                                           ▼
                       │                             ┌──────────────────────────┐
                       │                             │ Job Description Input    │
                       │                             └─────────────┬────────────┘
                       │                                           │
                       │                                           ▼
                       │                             ┌──────────────────────────┐
                       │                             │ Hybrid Retrieval (RRF)   │
                       │                             └─────────────┬────────────┘
                       │                                           │
                       │                                           ▼
                       │                             ┌──────────────────────────┐
                       │                             │ Gemini RAG Evaluation    │
                       │                             │  - Match Score (0-100)   │
                       │                             │  - Recommendation        │
                       │                             │  - Strengths/Weaknesses  │
                       │                             └─────────────┬────────────┘
                       │                                           │
                       └─────────────────────┬─────────────────────┘
                                             │
                                             ▼
                                 ┌────────────────────────┐
                                 │ SQLite Database        │
                                 │ - Candidates           │
                                 │ - Job Descriptions     │
                                 │ - Evaluation Results   │
                                 └───────────┬────────────┘
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       │                                           │
                       ▼                                           ▼
         ┌──────────────────────────┐                ┌──────────────────────────┐
         │ React HR Dashboard       │                │ Styled Excel Export      │
         │ (Filters, Search, Matrix)│                │ (.xlsx via openpyxl)     │
         └──────────────────────────┘                └──────────────────────────┘
```

---

## 📁 Project Directory Structure

```
resume-analyzer/
│
├── app/                        # FastAPI Backend Application
│   ├── api/                    # API Route Handlers
│   │   ├── candidates.py       # Candidate CRUD, search, and filtering
│   │   ├── comparison.py       # Side-by-side candidate comparison
│   │   ├── dashboard.py        # Analytics stats and dashboard endpoints
│   │   ├── evaluation.py       # Single and batch resume evaluation
│   │   ├── history.py          # Candidate evaluation history
│   │   ├── job_description.py  # Job description uploads & active JD setting
│   │   ├── job_history.py      # Evaluations associated with a specific JD
│   │   ├── reports.py          # Excel report export endpoint
│   │   ├── routes.py           # Core system status routes
│   │   ├── schemas.py          # API route response schemas
│   │   └── upload.py           # File and ZIP upload endpoints
│   │
│   ├── chains/                 # LangChain Chains
│   │   ├── evaluation_chain.py # Resume vs JD evaluation LLM chain
│   │   └── metadata_chain.py   # Structured resume metadata extraction chain
│   │
│   ├── parsers/                # Output Parsers
│   │   └── evaluation_parser.py# Pydantic evaluation output parser
│   │
│   ├── prompts/                # Prompt Templates
│   │   ├── evaluation_prompt.py# Evaluation prompt template
│   │   └── metadata_prompt.py  # Metadata extraction prompt template
│   │
│   ├── schemas/                # Pydantic Schemas & Data Models
│   │   ├── candidate_filter.py # Candidate filtering payload schema
│   │   ├── candidate_response.py # Candidate response schema
│   │   ├── evaluation_filter.py# Evaluation filter parameters schema
│   │   ├── evaluation_request.py # Evaluation trigger payload schema
│   │   ├── evaluation_schema.py# AI evaluation output Pydantic model
│   │   ├── job_description.py  # Job description schema
│   │   └── resume_metadata.py  # Structured candidate metadata Pydantic model
│   │
│   ├── services/               # Core Business Logic & Services
│   │   ├── bm25_service.py     # BM25 sparse indexer & retriever
│   │   ├── candidate_service.py# Candidate management & SQLite storage
│   │   ├── chunker.py          # Text splitting & chunking utility
│   │   ├── comparison_service.py# Candidate side-by-side comparison engine
│   │   ├── dashboard_service.py# Analytics aggregation logic
│   │   ├── database.py         # SQLite connection & table initializations
│   │   ├── duplicate_detector.py # SHA-256 hash calculator & duplicate detector
│   │   ├── embedding_model.py  # SentenceTransformers embedding wrapper
│   │   ├── evaluation_database.py # Evaluation persistence & query engine
│   │   ├── evaluator.py        # Batch evaluation orchestrator
│   │   ├── excel_exporter.py   # Styled openpyxl Excel exporter
│   │   ├── file_reader.py      # Unified PDF / DOCX text extractor
│   │   ├── history_service.py  # Candidate revision & evaluation history
│   │   ├── hybrid_search.py    # Hybrid RRF search implementation
│   │   ├── ingest_folder.py    # Folder ingestion service
│   │   ├── ingestion.py        # Single file ingestion pipeline
│   │   ├── jd_reader.py        # Job description file reader
│   │   ├── job_description_service.py # JD database & file manager
│   │   ├── llm_service.py      # Gemini Chat Model initializer
│   │   ├── metadata_extractor.py # AI resume metadata extraction runner
│   │   ├── pdf_reader.py       # PyMuPDF text reader
│   │   ├── rag_service.py      # Context-aware evaluation runner
│   │   ├── retriever.py        # Retrieval interface wrapper
│   │   ├── text_cleaner.py     # Text normalization utility
│   │   ├── upload_service.py   # Single resume upload handler
│   │   ├── vector_store.py     # ChromaDB vector store manager
│   │   └── zip_upload_service.py # ZIP archive extractor and batch uploader
│   │
│   ├── app.py                  # FastAPI Application Entrypoint
│   ├── ingest.py               # CLI Ingestion Script
│   └── main.py                 # CLI Execution Pipeline
│
├── frontend/                   # React + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── api/                # Axios API Client Modules
│   │   ├── components/         # UI Components
│   │   │   ├── CandidatesSection.tsx # Candidate directory & search
│   │   │   ├── EvaluateSection.tsx   # Job Description input & evaluation trigger
│   │   │   ├── Layout.tsx            # Navigation Header & App Shell
│   │   │   ├── ReportsSection.tsx   # HR Analytics & Export Panel
│   │   │   ├── ResultsSection.tsx   # Evaluation Leaderboard & Detailed Modal
│   │   │   └── UploadSection.tsx    # Drag-and-drop resume & ZIP uploader
│   │   ├── types/              # TypeScript Type Interfaces
│   │   ├── App.tsx             # Root Application Component
│   │   ├── main.tsx            # Vite React DOM Mount Point
│   │   └── index.css           # Global Styles & Tailwind Imports
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── data/                       # Local File & Database Storage
│   ├── database.db             # SQLite Relational Database
│   ├── resumes/                # Uploaded Resume Files Storage
│   ├── job_descriptions/       # Uploaded Job Descriptions Storage
│   └── chroma/                 # ChromaDB Vector Storage Directory
│
├── reports/                    # Generated Excel Export Files Output
├── clean_requirements.txt      # Cleaned Python Dependencies
├── requirements.txt            # Project Dependencies
├── .env.example                # Sample Environment Variables Config
├── README.md                   # Project Documentation
└── .gitignore
```

---

## 📌 Complete API Endpoints Reference

### 1. Upload APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/upload/` | Upload a single resume (`.pdf` or `.docx`). Returns extracted metadata & duplicate status. |
| `POST` | `/upload/zip` | Upload a ZIP archive containing multiple resumes for batch processing. |

### 2. Job Description APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/jd/upload` | Upload a Job Description file (`.pdf`, `.docx`, `.txt`). |
| `POST` | `/api/jd/text` | Save a new Job Description by submitting raw text. |
| `GET` | `/api/jd/active` | Get the currently active Job Description. |
| `GET` | `/api/jd/history` | List all historical Job Descriptions saved in SQLite. |

### 3. Evaluation APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/evaluate/` | Trigger batch evaluation for all uploaded resumes against specified `job_id`. |
| `POST` | `/evaluate/{filename}` | Evaluate a specific uploaded resume against specified `job_id`. |
| `GET` | `/evaluate/results` | Retrieve evaluated candidate results with advanced filtering, sorting, and pagination. |

### 4. Candidate Management & Search APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/candidates/` | List all candidate profiles stored in database with pagination. |
| `GET` | `/candidates/search` | Perform hybrid vector + keyword search over candidates using a natural language query. |
| `GET` | `/candidates/{filename}` | Get complete profile & details for a specific candidate. |
| `DELETE`| `/candidates/{filename}` | Delete candidate profile, evaluation records, and associated resume file. |
| `POST` | `/candidates/filter` | Apply multi-parameter filtering on candidate database records. |

### 5. Candidate Comparison & History APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/candidates/compare` | Compare two or more candidates side-by-side against a Job Description. |
| `GET` | `/api/candidates/{id}/history` | Get evaluation history log for a specific candidate. |
| `GET` | `/api/jd/{jd_id}/evaluations` | Get all candidate evaluations linked to a specific Job Description ID. |

### 6. Analytics & Reports APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Retrieve aggregated HR analytics metrics (total resumes, average score, top skills, recommendations breakdown). |
| `GET` | `/reports/evaluation` | Download styled Excel (`.xlsx`) evaluation report file. |

---

## ⚙ Installation & Setup

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**
- **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/))

---

### Step 1: Clone Repository & Environment Setup

```bash
git clone https://github.com/yourusername/ai-resume-analyzer.git
cd ai-resume-analyzer
```

Create `.env` file in the root directory:

```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

---

### Step 2: Backend Setup

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

2. **Install Backend Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Start FastAPI Backend Server**:
   ```bash
   uvicorn app.app:app --reload --port 8000
   ```

   - API Documentation (Swagger UI): `http://127.0.0.1:8000/docs`
   - ReDoc Documentation: `http://127.0.0.1:8000/redoc`

---

### Step 3: Frontend Setup

1. Open a new terminal window and navigate to `frontend`:
   ```bash
   cd frontend
   ```

2. **Install Frontend Dependencies**:
   ```bash
   npm install
   ```

3. **Start Vite Development Server**:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

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
