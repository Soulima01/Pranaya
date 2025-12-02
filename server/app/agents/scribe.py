import json
from langchain_core.messages import SystemMessage, HumanMessage
from app.services.llm_service import LLMService

class AgentScribe:
    def __init__(self):
        self.llm_service = LLMService()
        self.llm = self.llm_service.get_logic_model() 

    # ... rest of the code remains exactly the same ...

    def extract_tracker_data(self, user_text: str, user_gender: str):
        system_prompt = f"""
        You are 'Agent Scribe'. Extract health data.
        USER GENDER: {user_gender}
        
        Output JSON ONLY. No markdown. No text outside braces.
        Format:
        {{
            "valid": true,
            "category": "water" | "medicine" | "vaccine" | "period",
            "item": "Name" or null,
            "quantity": "Amount" or null,
            "response_text": "Confirmation message"
        }}
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_text)
        ]

        try:
            response = self.llm.invoke(messages)
            content = response.content.strip()
            
            
            if "```" in content:
                content = content.split("```json")[-1].split("```")[0].strip()
            elif "{" not in content:
               
                raise ValueError("LLM did not return JSON")

            return json.loads(content)
            
        except Exception as e:
            print(f"❌ SCRIBE AGENT ERROR: {e}")
            # Return a safe fallback so the app doesn't hang
            return {
                "valid": False,
                "response_text": "I'm having trouble updating the tracker right now. Please try again."
            }