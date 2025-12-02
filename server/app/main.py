from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

# --- IMPORT AGENTS ---
from app.agents.orchestrator import MasterOrchestrator
from app.agents.emergency import EmergencySentinel
from app.agents.diagnosis import DrDiagnosis
from app.agents.mental_health import NurseCompassion
from app.agents.myth_buster import MythBuster
from app.agents.knowledge import ProfessorKnowledge
from app.agents.scribe import AgentScribe
from app.agents.vision import AgentVision
from app.agents.nudge import NudgeAgent # <--- NEW

app = FastAPI(title="Pranaya Health Agent API")

# --- MIDDLEWARE ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- INITIALIZE AGENTS ---
orchestrator = MasterOrchestrator()
doctor = DrDiagnosis()
nurse = NurseCompassion()
myth_buster = MythBuster()
professor = ProfessorKnowledge()
scribe = AgentScribe()
vision_agent = AgentVision()
nudge_agent = NudgeAgent() # <--- NEW

# --- DATA MODEL ---
class ChatRequest(BaseModel):
    message: str
    user_id: str = "guest"
    history: List[str] = []   
    gender: str = "Unknown"   
    image: Optional[str] = None 

# --- ROUTES ---

@app.get("/")
def read_root():
    return {"status": "online", "message": "Pranaya Brain is Active 🧠"}

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    user_text = request.message
    chat_history = request.history
    user_gender = request.gender
    user_image = request.image
    
    # --- 0. PRIORITY CHECK: VISION ANALYSIS ---
    if user_image:
        print("👀 Vision Agent Activated...")
        analysis = vision_agent.analyze_report(user_image)
        
        # For vision, we generate nudges based on the analysis
        suggestions = nudge_agent.generate_suggestions(user_text or "Uploaded Image", analysis)

        return {
            "status": "success",
            "routed_to": "vision",
            "response": {
                "type": "chat",
                "message": analysis
            },
            "suggestions": suggestions
        }

    # --- 1. ORCHESTRATOR (Text Only) ---
    decision = orchestrator.classify_intent(user_text, chat_history)
    intent = decision["agent"]
    
    response_data = {}

    # --- 2. ROUTING LOGIC ---
    
    # A. MEDICAL EMERGENCY (Physical)
    if intent == "emergency":
        response_data = {
            "type": "emergency",
            "message": "CRITICAL ALERT: Please call emergency services immediately. I have detected a crisis."
        }
        
    # B. TRACKER (Water, Meds, Periods)
    elif intent == "tracker":
        result = scribe.extract_tracker_data(user_text, user_gender)
        
        if result["valid"]:
            response_data = {
                "type": "tracker_log", 
                "message": result["response_text"],
                "data": result 
            }
        else:
            response_data = {
                "type": "chat",
                "message": result["response_text"]
            }

    # C. DIAGNOSIS (Symptom Checker)
    elif intent == "diagnosis":
        result = doctor.analyze_symptoms(user_text, chat_history)
        response_data = {"type": "diagnosis", "data": result}
        
    # D. GENERAL KNOWLEDGE
    elif intent == "general_knowledge":
        reply = professor.get_info(user_text, chat_history)
        response_data = {"type": "chat", "message": reply}
        
    # E. MENTAL HEALTH
    elif intent == "mental_health":
        reply = nurse.get_support(user_text, chat_history)
        response_data = {"type": "chat", "message": reply}
        
    # F. MYTH BUSTER
    elif intent == "myth_buster":
        result = myth_buster.check_fact(user_text)
        response_data = {"type": "myth", "data": result}
        
    # G. DEFAULT CHAT
    else:
        response_data = {
            "type": "chat", 
            "message": "I'm listening. You can describe symptoms, ask health questions, log water, or upload a medical report."
        }

    # --- 3. GENERATE NUDGES (The Suggestion Engine) ---
    # We need to extract the "Text" part of the bot's reply to give context to the Nudge Agent
    bot_text_context = ""
    
    # Extract text based on response type
    if "message" in response_data:
        bot_text_context = response_data["message"]
    elif "data" in response_data and intent == "diagnosis":
        bot_text_context = response_data["data"].get("immediate_advice", "Medical diagnosis provided.")
    elif "data" in response_data and intent == "myth_buster":
        bot_text_context = response_data["data"].get("explanation", "Fact check provided.")

    # Generate 3 clickable suggestions
    suggestions = []
    if intent != "emergency": # Don't nudge during an emergency
        suggestions = nudge_agent.generate_suggestions(user_text, bot_text_context)

    return {
        "status": "success",
        "routed_to": intent,
        "response": response_data,
        "suggestions": suggestions # <--- Sent to Frontend
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)