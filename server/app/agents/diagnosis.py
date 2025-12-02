import json
from typing import List
from langchain_core.prompts import PromptTemplate
from langchain_core.messages import SystemMessage, HumanMessage
from app.services.llm_service import LLMService

class DrDiagnosis:
    def __init__(self):
        self.llm_service = LLMService()
       
        self.llm = self.llm_service.get_primary_model()

    def analyze_symptoms(self, current_symptom: str, chat_history: List[str]):
        
        formatted_history = "\n".join(chat_history[-5:])
        
        
        system_prompt = """
        You are 'Dr. Pranaya', an expert Senior Consultant Doctor.
        
        YOUR GOAL:
        Analyze symptoms and provide a HIGHLY DETAILED, 4-5 line explanation for each possible condition.
        
        CRITICAL OUTPUT RULES:
        1. Output MUST be valid JSON only.
        2. For the "reasoning" field of EACH disease, you MUST cover these 4 points:
           - **The "Why":** Explain clearly why the symptoms match this disease.
           - **OTC Meds:** Suggest specific medicines (e.g., "Paracetamol 650mg for fever", "Cetirizine for runny nose").
           - **Tests:** Mention 1-2 relevant lab tests (e.g., "CBC", "Dengue NS1 Antigen").
           - **Action:** State clearly: "Manage at home" OR "Visit a doctor".
        
        OUTPUT FORMAT (JSON Structure):
        {
            "triage_level": "Emergency" | "Consult Doctor" | "Self Care",
            "potential_conditions": [
                {
                    "name": "Disease Name (e.g., Viral Influenza)",
                    "likelihood": "High" | "Medium" | "Low",
                    "reasoning": "Write 4-5 full sentences here. Explain the match. Suggest medicines like Paracetamol/Ibuprofen. Recommend tests like CBC if needed. State if a doctor visit is required.",
                    "severity": "High" | "Moderate" | "Mild"
                },
                {
                    "name": "Disease Name (e.g., Common Cold)",
                    "likelihood": "Medium",
                    "reasoning": "Write 4-5 full sentences here. Explain why it is likely cold. Suggest steam inhalation and Vitamin C. State that it usually resolves at home.",
                    "severity": "Mild"
                },
                { "name": "Disease Name (e.g., Covid-19)",
                    "likelihood": "Low",
                    "reasoning": "Write 4-5 full sentences here. Explain why it is likely cold. Suggest steam inhalation and Vitamin C. State that it usually resolves at home.",
                    "severity": "Mild"}
            ],
            "immediate_advice": "A summary paragraph on general home care (hydration, rest, isolation) and when to rush to the ER.",
            "questions_to_ask": ["Follow up 1", "Follow up 2"]
        }
        """

        user_prompt = f"""
        PREVIOUS CHAT CONTEXT:
        {formatted_history}
        
        CURRENT USER INPUT:
        {current_symptom}
        """

        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt)
        ]

        try:
            response = self.llm.invoke(messages)
            # Cleanup JSON (remove markdown wrappers if present)
            cleaned_content = response.content.replace("```json", "").replace("```", "").strip()
            return json.loads(cleaned_content)
        except Exception as e:
            print(f"Dr. Diagnosis Error: {e}")
            return {
                "triage_level": "Consult Doctor",
                "immediate_advice": "I am having trouble processing the detailed diagnosis. Please consult a doctor immediately.",
                "potential_conditions": []
            }