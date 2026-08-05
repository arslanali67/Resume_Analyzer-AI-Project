from langchain_core.output_parsers import PydanticOutputParser

from app.schemas.resume_metadata import ResumeMetadata
from app.prompts.metadata_prompt import metadata_prompt
from app.services.llm_service import get_llm


# Load LLM
llm = get_llm()

# Create parser
parser = PydanticOutputParser(
    pydantic_object=ResumeMetadata
)

# Build chain
metadata_chain = (
    metadata_prompt.partial(
        format_instructions=parser.get_format_instructions()
    )
    | llm
    | parser
)