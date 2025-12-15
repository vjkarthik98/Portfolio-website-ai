from fastapi import FastAPI, Request
from pinecone import Pinecone
import requests

app = FastAPI()

# CONFIGURATION - USE ENVIRONMENT VARIABLES IN PRODUCTION
PINECONE_KEY = os.environ.get("PINECONE_API_KEY")
HF_TOKEN = os.environ.get("HF_TOKEN")

pc = Pinecone(api_key=PINECONE_KEY)
index = pc.Index("portfolio")

# Hugging Face Inference API URL (Llama-3-8B-Instruct is great and free)
HF_API_URL = "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct"
headers = {"Authorization": f"Bearer {HF_TOKEN}"}

@app.post("/api/chat")
async def chat(request: Request):
    data = await request.json()
    user_query = data.get("message")

    # 1. Get Embedding for user query using a free HF model
    # (For simplicity in deployment, we use a simple HF feature-extraction call)
    emb_url = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"
    response = requests.post(emb_url, headers=headers, json={"inputs": user_query, "options": {"wait_for_model": True}})
    query_vector = response.json()

    # 2. Search Pinecone
    search_res = index.query(vector=query_vector, top_k=3, include_metadata=True)
    context = "\n".join([match['metadata']['text'] for match in search_res['matches']])

    # 3. Generate Answer
    prompt = f"""
    <|system|>
    You are a helpful AI assistant for a Gen AI Engineer's portfolio. 
    Use the following context about the engineer to answer the user's question.
    Context: {context}
    
    If the answer isn't in the context, politely say you don't know but suggest contacting them directly.
    <|user|>
    {user_query}
    <|assistant|>
    """
    
    payload = {
        "inputs": prompt,
        "parameters": {"max_new_tokens": 200, "return_full_text": False}
    }
    
    hf_response = requests.post(HF_API_URL, headers=headers, json=payload)
    answer = hf_response.json()[0]['generated_text']
    
    return {"response": answer}