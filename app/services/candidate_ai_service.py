from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import ChatPromptTemplate

from app.schemas.evaluation_schema import ResumeEvaluation
from app.services.llm_service import get_llm


parser = PydanticOutputParser(
    pydantic_object=ResumeEvaluation
)


def evaluate_uploaded_resume(
    resume_text: str,
    job_description: str,
):
    """
    Evaluate uploaded resume directly without RAG.
    """

    llm = get_llm()

    prompt = ChatPromptTemplate.from_template(
        """
You are an expert ATS Resume Analyzer.

Your task is to compare the resume against the job description.

Return ONLY valid JSON.

{format_instructions}

Job Description:

{job_description}

------------------------------------

Resume:

{resume}
"""
    )

    chain = (
        prompt
        | llm
        | parser
    )

    return chain.invoke(
        {
            "job_description": job_description,
            "resume": resume_text,
            "format_instructions": parser.get_format_instructions(),
        }
    )