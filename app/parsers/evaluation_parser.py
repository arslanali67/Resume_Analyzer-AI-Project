from langchain_core.output_parsers import PydanticOutputParser

from app.schemas.evaluation_schema import ResumeEvaluation


evaluation_parser = PydanticOutputParser(
    pydantic_object=ResumeEvaluation
)