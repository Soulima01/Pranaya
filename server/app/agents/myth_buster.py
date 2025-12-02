import json
from langchain_core.messages import SystemMessage, HumanMessage
from app.services.llm_service import LLMService

class MythBuster:
    def __init__(self):
        self.llm_service = LLMService()
        self.llm = self.llm_service.get_primary_model()

    def check_fact(self, query: str):
        system_prompt = """
        You are the 'Myth Buster' agent.
        
        YOUR GOAL:
        Determine if a medical claim is a MYTH or a FACT.
        
        OUTPUT FORMAT (JSON):
        {
            "verdict": "MYTH" | "FACT" | ,
            "explanation": "Scientific explanation in 3-4 sentences.",
            "source": "Mention a credible entity (e.g., WHO, CDC, Mayo Clinic) if applicable."
        }
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=query)
        ]

        try:
            response = self.llm.invoke(messages)
            cleaned_content = response.content.replace("```json", "").replace("```", "").strip()
            return json.loads(cleaned_content)
        except:
            return {
                "verdict": "UNCERTAIN",
                "explanation": "I couldn't verify this claim right now.",
                "source": "N/A"
            }