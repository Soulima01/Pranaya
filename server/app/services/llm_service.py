import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

class LLMService:
    def __init__(self):
        self.google_key = os.getenv("GOOGLE_API_KEY")
        if not self.google_key:
            raise ValueError("GOOGLE_API_KEY is missing in .env file")

        # 🔴 FIX: Updated model name to one you definitely have access to
        # You can also try "gemini-1.5-flash-latest" or "gemini-2.0-flash" if this fails
        self.gemini = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=self.google_key,
            temperature=0.3
        )

    def get_primary_model(self):
        """
        Used by Doctor, Nurse, Vision, Myth Buster.
        """
        return self.gemini

    def get_logic_model(self):
        """
        Used by Orchestrator, Scribe, Nudge.
        """
        return self.gemini