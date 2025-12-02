from typing import List
from langchain.schema import SystemMessage, HumanMessage
from app.services.llm_service import LLMService

class ProfessorKnowledge:
    def __init__(self):
        self.llm_service = LLMService()
        self.llm = self.llm_service.get_primary_model()

    def get_info(self, query: str, chat_history: List[str]):
        
        formatted_history = "\n".join(chat_history[-3:]) # Short history needed here

        system_prompt = """
        You are 'Pranaya Knowledge'. Answer general health questions concisely.
        If the user asks a follow-up question (e.g., "What are the symptoms?"), use the Context to know what disease they are talking about.
        """
        
        user_prompt = f"""
        Context: {formatted_history}
        Question: {query}
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt)
        ]

        response = self.llm.invoke(messages)
        return response.content