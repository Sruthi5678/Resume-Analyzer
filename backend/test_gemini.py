import os
import truststore
from dotenv import load_dotenv
from google import genai

# Make Python use Windows certificate store
truststore.inject_into_ssl()

# Load variables from .env file
load_dotenv()

# Get API key securely
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError(
        "GEMINI_API_KEY not found. Please add it to your .env file."
    )

# Create Gemini client
client = genai.Client(api_key=API_KEY)

# Test embedding
response = client.models.embed_content(
    model="gemini-embedding-001",
    contents="Hello, this is a test"
)

print("SUCCESS!")
print(response.embeddings[0].values[:5])