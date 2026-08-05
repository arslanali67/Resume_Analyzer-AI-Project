from langchain_core.prompts import ChatPromptTemplate


metadata_prompt = ChatPromptTemplate.from_template(
    """
You are an expert HR resume parser.

Your task is to extract structured metadata from the resume.

Resume:
{resume}

Extract ONLY factual information present in the resume.

Rules:

- Do not guess.
- If information is missing, return:
    - "" for text fields
    - [] for lists
    - 0 for experience_years.
- Calculate total professional experience in years only if it can be determined from the resume.
- Skills should only contain technical skills.
- Return the output in the required structured format.

{format_instructions}
"""
)