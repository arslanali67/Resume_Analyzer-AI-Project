from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def home():
    return {
        "message": "AI Resume Analyzer API is Running!"
    }


@router.get("/health")
def health():
    return {
        "status": "healthy"
    }