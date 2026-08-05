from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser

from app.schemas.evaluation_schema import ResumeEvaluation


# Create parser
parser = PydanticOutputParser(
    pydantic_object=ResumeEvaluation
)


evaluation_prompt = ChatPromptTemplate.from_template(
    """
You are an experienced HR recruiter.

Evaluate the candidate based on the given Job Description and Resume.

Job Description:
{job_description}

Candidate Resume:
{resume}

Return the evaluation in the exact format below.

{format_instructions}
"""
).partial(
    format_instructions=parser.get_format_instructions()
)