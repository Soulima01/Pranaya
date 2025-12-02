import requests
import json

url = "http://127.0.0.1:8000/chat"

def print_response(title, payload):
    print(f"\n--- TEST: {title} ---")
    print(f"User Input: {payload['message']}")
    response = requests.post(url, json=payload)
    
    if response.status_code == 200:
        data = response.json()
        print(f"Routed To: {data['routed_to']}")
        
        if data['routed_to'] == 'diagnosis':
            # Pretty print the medical report
            print("DOCTOR REPORT:")
            print(json.dumps(data['response']['data'], indent=2))
        else:
            print("Response:", data['response'])
    else:
        print("Error:", response.text)

# 1. Test Diagnosis
print_response("Diagnosis", {
    "message": "I am having extreme wrist pain after playing badminton.", 
    
})



# 4. Test Myth Buster
print_response("Myth Buster", {
    "message": "Does carrot give us night vision?"
})