from app.prompts.evaluation_prompt import evaluation_prompt
from app.schemas.evaluation_schema import ResumeEvaluation
from app.services.llm_service import get_llm

llm = get_llm()

structured_llm = llm.with_structured_output(ResumeEvaluation)

evaluation_chain = (
    evaluation_prompt
    | structured_llm
)