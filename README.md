# Pranaya AI — A Federated Agentic Health Operating System

Pranaya is a next-generation **Agentic Health Platform** transforming passive symptom checkers into proactive and intelligent digital health companions. It introduces a **Federated Multi-Agent Workflow** that autonomously triages health issues, logs wellness metrics, and safeguards users through continuous risk monitoring.

---

##  1️⃣ Project Goal & Problem Statement

Most healthcare chatbots are **reactive, isolated, and forgetful**. They:

 Don’t remember user medical history  
 Can’t act autonomously  
 Fail during emergencies  
 Provide non-contextual advice (dangerous for chronic illness)

📌 **Pranaya fixes this** using Persistent Memory + Autonomous Agents to deliver personalized, contextual, and continuous care.

> **Mission:** Transform healthcare from a “one-time symptom chat” to a **persistent health operating system**.

---

##  2️⃣ Key Course Concepts Applied

### ✔ Multi-Agent System (Router + Specialists)
A central **Master Orchestrator** routes requests intelligently:

| Agent | Role | Trigger |
|------|------|---------|
| Dr. Diagnosis Agent | Clinical reasoning + triage | Symptoms / health queries |
| Agent Scribe | Tool calls + health log updates | Metrics/logging actions |
| Emergency Sentinel | Parallel crisis monitoring | Suicide, stroke keywords |

This **Router-Solver architecture** shows mastery of agent coordination and intent classification.

---

### ✔ Tools & Function Calling
Moves from **chatting → doing**:

- `log_health_metric()`: database writes via structured extraction  
- Vision tool: interpret lab reports / skin photos  
- Gemini function calling ensures reliable execution flows

> Natural language → structured health data → backend actions  
No forms required.

---

### ✔ Sessions & Memory (Context Engineering)
Pranaya "remembers" the user:

| Memory Type | Use |
|------------|-----|
| Long-Term | Age, weight, chronic conditions |
| Dynamic Context | Current symptoms, recent logs |

Healthcare reasoning is **condition-aware**:  
If a diabetic user reports “foot pain,” neuropathy becomes a top priority.

---

##  3️⃣ Technical Architecture

| Component | Stack / Service |
|----------|----------------|
| Backend | FastAPI + Python |
| AI Orchestration | LangChain / LangGraph |
| Core LLM | Google Gemini (multimodal) |
| Deployment | Google Cloud Run Services |
| Database | JSON → future: Firestore |

**Topology:** Hub-and-Spoke  
Master Orchestrator = hub → Specialist agents = spokes

---

##  4️⃣ Future Scope (Gap Analysis)

To enhance reliability + autonomy:

1. **Agent Observability**
   - LangSmith tracing & analytics  
   - Evaluate routing accuracy (medical vs non-medical)

2. **Long-Running Background Agents**
   - Medication adherence monitoring  
   - “Wake-up” health reminders when users forget

3. **RAG with Medical Knowledge Sources**
   - PubMed-backed retrieval  
   - **Evidence-first** health recommendations

Pranaya evolves into a **continually learning medical assistant**.

---

##  Local Development

```bash
git clone https://github.com/Soulima01/Pranaya
cd Pranaya
python3 -m venv venv
source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt

