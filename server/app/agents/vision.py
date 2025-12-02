from langchain_core.messages import HumanMessage, SystemMessage
from app.services.llm_service import LLMService

class AgentVision:
    def __init__(self):
        self.llm_service = LLMService()
        # Neysa Qwen-3-VL is a Vision Model, so this works natively!
        self.llm = self.llm_service.get_primary_model()

    def analyze_report(self, base64_image: str):
        """
        Takes a Base64 string of an image and returns a medical analysis.
        """
        
        system_prompt = """
        You are 'Pranaya Lab Tech', a senior pathologist. 
        
        YOUR GOAL:
        Analyze the medical image and provide a highly detailed, formatted report.
        
        FORMATTING RULES (CRITICAL):
        1. Use **HTML tags** for formatting. Do NOT use Markdown.
        2. If a value is **HIGH** or **LOW** (Abnormal), wrap it in: <span class="text-red-600 font-bold"> ... </span>
        3. If a value is **NORMAL**, wrap it in: <span class="text-green-600 font-bold"> ... </span>
        4. Use <b>...</b> for headers and important keywords.
        5. Use <br> for line breaks.
        
        STRUCTURE:
        <h3>🧪 Test Summary</h3>
        [Identify the test, e.g., CBC, Lipid Profile]
        
        <h3>📊 Detailed Analysis</h3>
        <ul>
           <li><b>Parameter Name:</b> [Value] [Unit] - <span class="...">[Status]</span> <br> <i>(Explanation of what this means in 1 sentence)</i></li>
           ... (Repeat for all key values)
        </ul>
        
        <h3>🩺 Clinical Interpretation</h3>
        [Detailed paragraph explaining the overall health picture. Mention potential causes for the abnormal values (e.g., "High WBC suggests an active infection").]
        
        <h3>💡 Next Steps</h3>
        [Actionable advice, e.g., "Drink water", "Consult a General Physician"].
        """

        # Construct the Multimodal Message (Text + Image)
        # This is the standard format for OpenAI-compatible Vision Models
        message = HumanMessage(
            content=[
                {"type": "text", "text": "Please analyze this medical report image."},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"{base64_image}" # Frontend sends "data:image/jpeg;base64,..."
                    },
                },
            ]
        )

        try:
            # Send System Prompt + Image Message
            response = self.llm.invoke([SystemMessage(content=system_prompt), message])
            return response.content
        except Exception as e:
            print(f"Vision Error: {e}")
            return "I had trouble reading that image. Please make sure the text is clear and well-lit."