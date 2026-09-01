import truststore

# Use Windows/system certificate store
truststore.inject_into_ssl()

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

app = FastAPI(
    title="ResumeIQ AI API",
    version="1.0.0"
)


# ==========================================
# 2. CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",

        # Add your Vercel URL here later
        # "https://your-project.vercel.app"
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
    print("WARNING: GEMINI_API_KEY environment variable not found!")

client = genai.Client(
    api_key=GEMINI_API_KEY
)


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

        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        start = end - overlap

    return chunks


# ==========================================
# CREATE KNOWLEDGE CHUNKS
# ==========================================

all_chunks = []

for document in knowledge_base:
    all_chunks.extend(
        chunk_text(document)
    )


# ==========================================
# 6. CREATE EMBEDDINGS + FAISS
# ==========================================

def create_vector_database():

    response = client.models.embed_content(

        model="gemini-embedding-001",

        contents=all_chunks

    )


    embeddings = np.array(

        [
            item.values
            for item in response.embeddings
        ],

        dtype=np.float32

    )


    # Normalize embeddings
    faiss.normalize_L2(embeddings)


    dimension = embeddings.shape[1]


    # Cosine similarity using inner product
    vector_index = faiss.IndexFlatIP(
        dimension
    )


    vector_index.add(
        embeddings
    )


    return vector_index


# ==========================================
# CREATE RAG DATABASE SAFELY
# ==========================================

index = None

print("Creating RAG Vector Database...")


try:

    index = create_vector_database()

    print("RAG Vector Database Ready!")


except Exception as e:

    print(
        "WARNING: RAG Vector Database could not be created."
    )

    print(
        "Reason:",
        str(e)
    )

    print(
        "Server will continue using fallback knowledge."
    )


# ==========================================
# 7. RAG RETRIEVAL FUNCTION
# ==========================================

def retrieve_context(query, top_k=3):

    # --------------------------------------
    # FALLBACK IF VECTOR DATABASE FAILED
    # --------------------------------------

    if index is None:

        print(
            "RAG database unavailable."
        )

        print(
            "Using fallback knowledge."
        )

        return all_chunks[:top_k]


    try:

        # ----------------------------------
        # CREATE QUERY EMBEDDING
        # ----------------------------------

        response = client.models.embed_content(

            model="gemini-embedding-001",

            contents=query

        )


        query_embedding = np.array(

            [
                response.embeddings[0].values
            ],

            dtype=np.float32

        )


        # Normalize query
        faiss.normalize_L2(
            query_embedding
        )


        # Search FAISS
        scores, indices = index.search(

            query_embedding,

            top_k

        )


        retrieved = []


        for i in indices[0]:

            if i >= 0:

                retrieved.append(
                    all_chunks[i]
                )


        return retrieved


    except Exception as e:

        print(
            "RAG retrieval error:",
            str(e)
        )


        # ----------------------------------
        # FALLBACK KNOWLEDGE
        # ----------------------------------

        return all_chunks[:top_k]


# ==========================================
# 8. PDF TEXT EXTRACTION
# ==========================================

def extract_pdf_text(pdf_bytes):

    reader = PdfReader(
        io.BytesIO(pdf_bytes)
    )


    text = ""


    for page in reader.pages:

        page_text = page.extract_text()


        if page_text:

            text += (
                page_text + "\n"
            )


    return text.strip()


# ==========================================
# 9. HOME API
# ==========================================

@app.get("/")
def home():

    return {

        "message":
            "ResumeIQ AI Backend Running!",

        "rag_status":
            "active"
            if index is not None
            else "fallback"

    }


# ==========================================
# 10. HEALTH CHECK
# ==========================================

@app.get("/health")
def health():

    return {

        "status": "healthy",

        "rag_available":
            index is not None

    }


# ==========================================
# 11. ANALYZE RESUME API
# ==========================================

@app.post("/analyze")
async def analyze_resume(

    resume: UploadFile = File(...),

    job_description: str = Form(...)

):

    try:

        # ----------------------------------
        # READ RESUME
        # ----------------------------------

        pdf_bytes = await resume.read()


        if not pdf_bytes:

            raise HTTPException(

                status_code=400,

                detail="Uploaded resume is empty."

            )


        # ----------------------------------
        # EXTRACT PDF TEXT
        # ----------------------------------

        resume_text = extract_pdf_text(
            pdf_bytes
        )


        if not resume_text:

            raise HTTPException(

                status_code=400,

                detail=(
                    "Could not extract text from the PDF. "
                    "Please upload a text-based PDF."
                )

            )


        # ----------------------------------
        # RAG QUERY
        # ----------------------------------

        rag_query = f"""

Find relevant ATS guidelines, resume improvement
suggestions and technical skills.

JOB DESCRIPTION:

{job_description}

"""


        # ----------------------------------
        # RETRIEVE RAG KNOWLEDGE
        # ----------------------------------

        retrieved_context = retrieve_context(
            rag_query
        )


        rag_context = "\n\n".join(
            retrieved_context
        )


        # ----------------------------------
        # GEMINI PROMPT
        # ----------------------------------

        prompt = f"""
You are ResumeIQ, an AI-powered Resume Analyzer.

Analyze the candidate's resume against the provided job description.

Use the retrieved knowledge to improve your recommendations.

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

Use EXACTLY this structure:

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


IMPORTANT RULES:

1. overall_score must be between 0 and 100.
2. ats_score must be between 0 and 100.
3. Compare the resume directly with the job description.
4. Do not invent skills that are not supported by the resume.
5. Identify important missing skills.
6. Give useful and realistic suggestions.
7. Return ONLY valid JSON.
8. Do not use Markdown.
9. Do not wrap JSON in ```json.
"""


        # ----------------------------------
        # GEMINI ANALYSIS
        # ----------------------------------

        response = client.models.generate_content(

            model="gemini-2.5-flash",

            contents=prompt

        )


        # ----------------------------------
        # GET RESPONSE
        # ----------------------------------

        result_text = response.text.strip()


        # ----------------------------------
        # CLEAN MARKDOWN IF PRESENT
        # ----------------------------------

        result_text = re.sub(

            r"^```json\s*",

            "",

            result_text,

            flags=re.IGNORECASE

        )


        result_text = re.sub(

            r"^```\s*",

            "",

            result_text

        )


        result_text = re.sub(

            r"\s*```$",

            "",

            result_text

        ).strip()


        # ----------------------------------
        # CONVERT JSON
        # ----------------------------------

        analysis_result = json.loads(
            result_text
        )


        # ----------------------------------
        # RETURN RESULT
        # ----------------------------------

        return analysis_result


    except HTTPException:

        raise


    except json.JSONDecodeError as e:

        print(
            "JSON PARSE ERROR:",
            str(e)
        )


        raise HTTPException(

            status_code=500,

            detail=(
                "AI returned an invalid response. "
                "Please try again."
            )

        )


    except Exception as e:

        print(
            "ERROR:",
            str(e)
        )


        raise HTTPException(

            status_code=500,

            detail=str(e)

        )