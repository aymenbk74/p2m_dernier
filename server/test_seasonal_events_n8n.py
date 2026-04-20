import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

# Configuration
API_URL = "http://localhost:8000/api/admin/events/seasonal"
AGENT_KEY = os.getenv("STOCK_AGENT_KEY", "your-secret-key-from-env")

data = [
    {
        "evenement": "Noël",
        "data": "25 décembre",
        "compte_a_rebours": "- 45 jours",
        "image_illustration": "https://images.pexels.com/photos/29793830/pexels-photo-29793830.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
    },
    {
        "evenement": "Nouvel An",
        "data": "1 janvier",
        "compte_a_rebours": "- 52 jours",
        "image_illustration": "https://images.pexels.com/photos/5716462/pexels-photo-5716462.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
    },
    {
        "evenement": "Saint-Valentin",
        "data": "14 février",
        "compte_a_rebours": "- 96 jours",
        "image_illustration": "https://images.pexels.com/photos/6249028/pexels-photo-6249028.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
    },
    {
        "evenement": "Début Ramadan",
        "data": "18 février",
        "compte_a_rebours": "- 100 jours",
        "image_illustration": "https://images.pexels.com/photos/7249750/pexels-photo-7249750.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
    }
]

headers = {
    "X-Agent-Key": AGENT_KEY,
    "Content-Type": "application/json"
}

def test_push():
    print(f"🚀 Pushing {len(data)} events to {API_URL}...")
    try:
        response = requests.post(API_URL, json=data, headers=headers)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_push()
