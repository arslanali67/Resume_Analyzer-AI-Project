from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

# Create the LLM only once
llm = ChatGoogleGenerativeAI(
    model="gemini-flash-latest",
    temperature=0,
)


def get_llm():
    """
    Return the cached Gemini LLM instance.
    """
    return llm


def ask_llm(prompt):
    """
    Ask the LLM directly.
    """
    response = llm.invoke(prompt)
    return response.content