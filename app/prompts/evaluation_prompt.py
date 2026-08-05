from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser

from app.schemas.evaluation_schema import ResumeEvaluation


parser = PydanticOutputParser(
    pydantic_object=ResumeEvaluation
)


evaluation_prompt = ChatPromptTemplate.from_template(
    """
You are a Senior Technical HR Recruiter specializing in AI and Software Engineering hiring.

Evaluate the candidate ONLY based on the provided Job Description and Resume.

Job Description:
{job_description}

Candidate Resume:
{resume}

Evaluation Rules:

1. Match Score
- Give a score between 0 and 100.

2. Matching Skills
- List only the skills present in BOTH the resume and job description.

3. Missing Skills
- List important required skills missing from the resume.

4. Experience Summary
- Briefly summarize the candidate's relevant experience.

5. Strengths
- List 3-5 strengths.

6. Weaknesses
- List 3-5 weaknesses.

7. Recommendation
Return ONLY one of these exact values:

- Hire
- Maybe
- Reject

Do NOT write complete sentences.

8. Recommendation Reason
Provide a short explanation (1–2 sentences) explaining why you chose Hire, Maybe, or Reject.

Do not invent information that is not present in the resume.

Return ONLY the structured output below.

{format_instructions}
"""
).partial(
    format_instructions=parser.get_format_instructions()
)