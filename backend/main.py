import os
import io
import json
import re

import numpy as np
import faiss

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from google import genai


# ==========================================
# 1. FASTAPI APP
# ==========================================

app = FastAPI(title="ResumeIQ AI API")


# ==========================================
# 2. CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://resume-analyzer-tau-virid.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# 3. GEMINI API
# ==========================================

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set")

client = genai.Client(api_key=GEMINI_API_KEY)


# ==========================================
# 4. RAG KNOWLEDGE BASE
# ==========================================

knowledge_base = [

    """
    ATS Resume Guidelines:

    Use clear and standard section headings such as Skills,
    Education, Experience, and Projects.

    Avoid excessive graphics and complicated formatting because
    Applicant Tracking Systems may not parse them correctly.

    Use relevant keywords from the job description naturally.
    """,

    """
    Resume Achievement Guidelines:

    Strong resumes describe achievements instead of only responsibilities.

    Use action verbs and measurable results.

    Example:

    Weak:
    Worked on a web application.

    Strong:
    Developed a web application that improved response time by 30 percent.
    """,

    """
    Software Engineer Skills:

    Common software engineering skills include Python, Java,
    JavaScript, SQL, Git, Data Structures, Algorithms,
    REST APIs, and databases.

    Cloud and DevOps skills include AWS, Docker,
    Kubernetes, and CI/CD.
    """,

    """
    Frontend Developer Skills:

    Common frontend skills include React, JavaScript,
    HTML, CSS, TypeScript, responsive design,
    state management, and REST API integration.
    """,

    """
    Backend Developer Skills:

    Common backend skills include Java, Python,
    Spring Boot, Node.js, REST APIs, SQL,
    databases, authentication, and microservices.
    """,

    """
    Resume Improvement Guidelines:

    A strong technical resume should clearly demonstrate
    relevant skills through projects or work experience.

    Projects should mention technologies used,
    the problem solved, and measurable outcomes where possible.
    """
]


# ==========================================
# 5. CHUNKING FUNCTION
# ==========================================

def chunk_text(text, chunk_size=300, overlap=50):

    chunks = []
    start = 0

    while start < len(text):

        end = start + chunk_size

        chunks.append(text[start:end].strip())

        start = end - overlap

    return chunks


# ==========================================
# 6. CREATE CHUNKS
# ==========================================

all_chunks = []

for document in knowledge_base:
    all_chunks.extend(chunk_text(document))


# ==========================================
# 7. CREATE EMBEDDINGS + FAISS
# ==========================================

def create_vector_database():

    response = client.models.embed_content(
        model="gemini-embedding-001",
        contents=all_chunks
    )

    embeddings = np.array(
        [item.values for item in response.embeddings],
        dtype=np.float32
    )

    # Normalize vectors for similarity search
    faiss.normalize_L2(embeddings)

    dimension = embeddings.shape[1]

    vector_index = faiss.IndexFlatIP(dimension)

    vector_index.add(embeddings)

    return vector_index


# ==========================================
# 8. CREATE RAG DATABASE
# ==========================================

print("Creating RAG Vector Database...")

index = create_vector_database()

print("RAG Vector Database Ready!")


# ==========================================
# 9. RAG RETRIEVAL FUNCTION
# ==========================================

def retrieve_context(query, top_k=3):

    response = client.models.embed_content(
        model="gemini-embedding-001",
        contents=query
    )

    query_embedding = np.array(
        [response.embeddings[0].values],
        dtype=np.float32
    )

    faiss.normalize_L2(query_embedding)

    scores, indices = index.search(
        query_embedding,
        top_k
    )

    retrieved = []

    for i in indices[0]:
        if i >= 0:
            retrieved.append(all_chunks[i])

    return retrieved


# ==========================================
# 10. PDF TEXT EXTRACTION
# ==========================================

def extract_pdf_text(pdf_bytes):

    reader = PdfReader(io.BytesIO(pdf_bytes))

    text = ""

    for page in reader.pages:

        page_text = page.extract_text()

        if page_text:
            text += page_text + "\n"

    return text


# ==========================================
# 11. HOME API
# ==========================================

@app.get("/")
def home():

    return {
        "message": "ResumeIQ RAG Backend Running!"
    }


# ==========================================
# 12. HEALTH CHECK
# ==========================================

@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


# ==========================================
# 13. ANALYZE RESUME API
# ==========================================

@app.post("/analyze")
async def analyze_resume(

    resume: UploadFile = File(...),

    job_description: str = Form(...)

):

    try:

        # -----------------------------
        # Validate file
        # -----------------------------

        if not resume.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail="Please upload a PDF resume."
            )


        # -----------------------------
        # Read Resume
        # -----------------------------

        pdf_bytes = await resume.read()

        resume_text = extract_pdf_text(pdf_bytes)

        if not resume_text.strip():
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from the PDF."
            )


        # -----------------------------
        # RAG Query
        # -----------------------------

        rag_query = f"""
Find relevant ATS guidelines, resume improvement
suggestions and technical skills for this job.

JOB DESCRIPTION:

{job_description}
"""


        # -----------------------------
        # Retrieve RAG Knowledge
        # -----------------------------

        retrieved_context = retrieve_context(
            rag_query
        )

        rag_context = "\n\n".join(
            retrieved_context
        )


        # -----------------------------
        # Gemini Prompt
        # -----------------------------

        prompt = f"""
You are ResumeIQ, an AI-powered Resume Analyzer.

Use the retrieved RAG knowledge, resume and job description
to provide a detailed analysis.

========================
RETRIEVED RAG KNOWLEDGE
========================

{rag_context}


========================
RESUME
========================

{resume_text}


========================
JOB DESCRIPTION
========================

{job_description}


Return ONLY valid JSON.

Use exactly this structure:

{{
    "overall_score": 0,
    "ats_score": 0,
    "skills_found": [],
    "matching_skills": [],
    "missing_skills": [],
    "strengths": [],
    "weaknesses": [],
    "suggestions": [],
    "recommended_roles": [],
    "summary": ""
}}

Rules:

1. Scores must be between 0 and 100.
2. Compare the resume with the job description.
3. Use the RAG knowledge for suggestions.
4. Do not invent skills that are not supported by the resume.
5. Identify relevant missing skills.
6. Return ONLY valid JSON.
"""


        # -----------------------------
        # Gemini Analysis
        # -----------------------------

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )


        # -----------------------------
        # Clean JSON
        # -----------------------------

        result_text = response.text.strip()

        result_text = re.sub(
            r"^```json\s*|\s*```$",
            "",
            result_text
        ).strip()


        # -----------------------------
        # Convert JSON
        # -----------------------------

        analysis_result = json.loads(
            result_text
        )


        # -----------------------------
        # Return Result
        # -----------------------------

        return analysis_result


    except HTTPException:
        raise


    except Exception as e:

        print("ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )