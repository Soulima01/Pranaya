import json
from typing import List
from langchain_core.messages import SystemMessage, HumanMessage
from app.services.llm_service import LLMService

class NudgeAgent:
    def __init__(self):
        self.llm_service = LLMService()
        # We use the Logic Model (Gemini) because it's fast and good at structured lists
        self.llm = self.llm_service.get_logic_model()

    def generate_suggestions(self, user_text: str, bot_response: str) -> List[str]:
        """
        Generates 3 short follow-up questions based on the last interaction.
        """
        
        system_prompt = """
        You are 'Pranaya Nudge', a conversation engine.
        
        YOUR GOAL:
        Predict exactly 3 short, relevant follow-up questions the USER might want to ask next.
        
        RULES:
        1. Keep them short (max 6-8 words).
        2. Make them relevant to the last topic discussed.
        3. If the topic was medical, suggest deeper questions (e.g., "dietary advice", "side effects").
        4. If the topic was mental health, suggest coping questions.
        5. Output strictly as a JSON list of strings. Example: ["What should I eat?", "Is it contagious?", "When to see a doctor?"]
        """
        
        user_prompt = f"""
        USER ASKED: "{user_text}"
        AI REPLIED: "{bot_response}"
        
        Generate 3 user follow-up questions (JSON List):
        """

        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt)
        ]

        try:
            response = self.llm.invoke(messages)
            content = response.content.replace("```json", "").replace("```", "").strip()
            return json.loads(content)
        except Exception as e:
            print(f"Nudge Error: {e}")
            # Safe fallbacks if AI fails
            return ["Tell me more", "What else?", "Go back"]