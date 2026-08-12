from langchain_core.output_parsers import PydanticOutputParser

from app.services.llm_service import llm
from app.prompts.resume_rewriter_prompt import resume_rewriter_prompt
from app.schemas.resume_rewrite_schema import ResumeRewrite


parser = PydanticOutputParser(
    pydantic_object=ResumeRewrite
)


def rewrite_resume(
    resume: str,
    job_description: str,
    evaluation,
):
    """
    Rewrite a resume using ATS evaluation feedback.
    """

    chain = (
        resume_rewriter_prompt
        | llm
        | parser
    )

    rewritten_resume = chain.invoke(
        {
            "resume": resume,
            "job_description": job_description,

            "match_score": evaluation.match_score,

            "matching_skills": ", ".join(
                evaluation.matching_skills
            ),

            "missing_skills": ", ".join(
                evaluation.missing_skills
            ),

            "resume_strengths": "\n".join(
                evaluation.strengths
            ),

            "resume_weaknesses": "\n".join(
                evaluation.weaknesses
            ),

            "overall_feedback": "\n".join(
                evaluation.overall_feedback
            ),
        }
    )

    return rewritten_resume