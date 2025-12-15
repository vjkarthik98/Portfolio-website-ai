import os
from pinecone import Pinecone
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

# 1. Load keys from .env file
load_dotenv() 

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY") 
INDEX_NAME = "portfolio-website"

if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY not found. Please check your .env file.")

# 1. Initialize
print("Initializing...")
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(INDEX_NAME)
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

# 2. Read Resume
with open("resume.txt", "r", encoding="utf-8") as f:
    text = f.read()

# 3. Chunk Text (Split into smaller pieces)
chunk_size = 500
chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]

# 4. Embed & Upsert
print(f"Uploading {len(chunks)} chunks to Pinecone...")
vectors = []
for i, chunk in enumerate(chunks):
    embedding = model.encode(chunk).tolist()
    vectors.append({
        "id": f"chunk-{i}",
        "values": embedding,
        "metadata": {"text": chunk}
    })

index.upsert(vectors=vectors)
print("Success! Your AI is now trained on your resume.")