from typing import List
from langchain_core.prompts import PromptTemplate
from app.services.llm_service import LLMService
from app.agents.emergency import EmergencySentinel

class MasterOrchestrator:
    def __init__(self):
        self.llm_service = LLMService()
        self.llm = self.llm_service.get_logic_model() # Uses Gemini/Qwen for logic
        self.emergency_sentinel = EmergencySentinel()

    def classify_intent(self, user_input: str, chat_history: List[str]):
        # 1. FAST CHECK: Only trigger for EXPLICIT life threats
        # We assume you cleaned up emergency.py to remove "chest pain" from the keyword list
        if self.emergency_sentinel.check_critical(user_input):
            return {"agent": "emergency", "confidence": 1.0}

        formatted_history = "\n".join(chat_history[-3:]) if chat_history else "No previous context."

        # 2. INTELLIGENT CHECK (The "Hesitation" Logic)
        template = """
        You are the Master Orchestrator for 'Pranaya', a health AI.
        Analyze the user input and map it to exactly ONE of the agents.
        CONTEXT FROM PREVIOUS CHAT:
        {history}
        CURRENT USER INPUT:
        {input}
        AGENTS:
        - "diagnosis": User describes symptoms (headache, fever, pain).
        - "emergency": User is dying, fainting, bleeding, or suicidal
        - "general_knowledge": User asks "What is X?", "Explain Y", "Do you know about Z?".
        - "mental_health": User expresses sadness, anxiety,depression, stress, or loneliness.
        - "myth_buster": User asks if a health fact is true or false.
        - "general_search": User asks "What is X?" or general knowledge questions.
        - "tracker": User mentions drinking water, taking meds, or sleep.
        - "chat": Casual greeting or irrelevant talk.

        CRITICAL DISTINCTION:
        - "I have chest pain" -> emergency
        - "Is chest pain dangerous?" -> general_knowledge
        - "I feel shortness of breath" -> diagnosis (or emergency if severe)
        - "Can shortness of breath be a symptom?" -> general_knowledge

        User Input: {input}
        CRITICAL RULE:
        If the user is adding details to a medical topic discussed in the HISTORY (like adding symptom details), route to "diagnosis" or "general_knowledge" accordingly. Don't default to "chat".
        
        Return ONLY the agent name (lowercase). Do not add punctuation.
        """
        
        prompt = PromptTemplate(template=template, input_variables=["input", "history"])
        chain = prompt | self.llm
        
        try:
            response = chain.invoke({"input": user_input, "history": formatted_history})
            agent_name = response.content.strip().lower()
            return {"agent": agent_name, "confidence": 0.9}
        except Exception as e:
            print(f"Orchestrator Error: {e}")
            return {"agent": "chat", "confidence": 0.5}