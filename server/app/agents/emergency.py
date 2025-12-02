class EmergencySentinel:
    def __init__(self):
        
        self.critical_keywords = [
            "suicide", "kill myself", "want to die", 
            "call 108", "call ambulance", "call police",
            "taking pills", "cut my wrist", "overdose"
        ]

    def check_critical(self, text: str) -> bool:
        text_lower = text.lower()
        for keyword in self.critical_keywords:
            if keyword in text_lower:
                return True
        return False