import truststore
truststore.inject_into_ssl()

import io
import json
import re
import os

import numpy as np
import faiss

from dotenv import load_dotenv

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from pypdf import PdfReader
from google import genai


# ==========================================
# LOAD ENVIRONMENT VARIABLES
# ==========================================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError(
        "GEMINI_API_KEY not found. "
        "Please create backend/.env and add your API key."
    )


# ==========================================
# GEMINI CLIENT
# ==========================================

client = genai.Client(
    api_key=GEMINI_API_KEY
)


# ==========================================
# FASTAPI APP
# ==========================================

app = FastAPI(
    title="ResumeIQ AI API"
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",

        # Later add your Vercel URL here
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# RAG KNOWLEDGE BASE
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
# TEXT CHUNKING
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
# CREATE ALL RAG CHUNKS
# ==========================================

all_chunks = []

for document in knowledge_base:

    chunks = chunk_text(document)

    all_chunks.extend(chunks)


# ==========================================
# CREATE VECTOR DATABASE
# ==========================================

def create_vector_database():

    print("Creating embeddings...")

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


    # Normalize vectors
    faiss.normalize_L2(embeddings)


    dimension = embeddings.shape[1]


    vector_index = faiss.IndexFlatIP(
        dimension
    )


    vector_index.add(
        embeddings
    )


    return vector_index


# ==========================================
# INITIALIZE RAG
# ==========================================

print("===================================")
print("Creating ResumeIQ RAG Database...")
print("===================================")

index = create_vector_database()

print("===================================")
print("RAG Vector Database Ready!")
print("===================================")


# ==========================================
# RAG RETRIEVAL
# ==========================================

def retrieve_context(query, top_k=3):

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


    faiss.normalize_L2(
        query_embedding
    )


    scores, indices = index.search(

        query_embedding,

        top_k

    )


    retrieved_chunks = []


    for chunk_index in indices[0]:

        if (
            chunk_index >= 0
            and
            chunk_index < len(all_chunks)
        ):

            retrieved_chunks.append(
                all_chunks[chunk_index]
            )


    return retrieved_chunks


# ==========================================
# PDF TEXT EXTRACTION
# ==========================================

def extract_pdf_text(pdf_bytes):

    reader = PdfReader(
        io.BytesIO(pdf_bytes)
    )


    text = ""


    for page in reader.pages:

        page_text = page.extract_text()


        if page_text:

            text += page_text + "\n"


    return text.strip()


# ==========================================
# SAFE JSON PARSER
# ==========================================

def parse_gemini_json(text):

    if not text:

        raise ValueError(
            "Gemini returned an empty response."
        )


    cleaned_text = text.strip()


    # Remove markdown JSON blocks
    cleaned_text = re.sub(

        r"^```json\s*",

        "",

        cleaned_text,

        flags=re.IGNORECASE

    )


    cleaned_text = re.sub(

        r"^```\s*",

        "",

        cleaned_text

    )


    cleaned_text = re.sub(

        r"\s*```$",

        "",

        cleaned_text

    )


    cleaned_text = cleaned_text.strip()


    # Find JSON object if extra text exists
    match = re.search(

        r"\{.*\}",

        cleaned_text,

        re.DOTALL

    )


    if match:

        cleaned_text = match.group(0)


    return json.loads(
        cleaned_text
    )


# ==========================================
# HOME API
# ==========================================

@app.get("/")
def home():

    return {

        "message":
        "ResumeIQ RAG Backend Running Successfully!"

    }


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/health")
def health_check():

    return {

        "status": "healthy",

        "service":
        "ResumeIQ AI Backend"

    }


# ==========================================
# ANALYZE RESUME API
# ==========================================

@app.post("/analyze")
async def analyze_resume(

    resume: UploadFile = File(...),

    job_description: str = Form(...)

):

    try:

        print("\n===================================")
        print("NEW RESUME ANALYSIS REQUEST")
        print("===================================")


        # ==========================================
        # VALIDATE FILE
        # ==========================================

        if not resume.filename:

            raise HTTPException(

                status_code=400,

                detail="Resume file is missing."

            )


        if not resume.filename.lower().endswith(".pdf"):

            raise HTTPException(

                status_code=400,

                detail="Only PDF files are supported."

            )


        if not job_description.strip():

            raise HTTPException(

                status_code=400,

                detail="Job description cannot be empty."

            )


        # ==========================================
        # READ PDF
        # ==========================================

        print("Reading resume PDF...")


        pdf_bytes = await resume.read()


        if not pdf_bytes:

            raise HTTPException(

                status_code=400,

                detail="Uploaded PDF is empty."

            )


        # ==========================================
        # EXTRACT TEXT
        # ==========================================

        print("Extracting resume text...")


        resume_text = extract_pdf_text(
            pdf_bytes
        )


        if not resume_text:

            raise HTTPException(

                status_code=400,

                detail=(
                    "Could not extract text from this PDF. "
                    "Please upload a text-based PDF."
                )

            )


        print(
            f"Resume text extracted: "
            f"{len(resume_text)} characters"
        )


        # ==========================================
        # CREATE RAG QUERY
        # ==========================================

        rag_query = f"""

        Find the most relevant information about:

        1. ATS optimization
        2. Resume improvement
        3. Technical skills
        4. Job requirements

        JOB DESCRIPTION:

        {job_description}

        """


        # ==========================================
        # RETRIEVE RAG CONTEXT
        # ==========================================

        print("Retrieving RAG context...")


        retrieved_context = retrieve_context(

            rag_query,

            top_k=3

        )


        rag_context = "\n\n".join(
            retrieved_context
        )


        # ==========================================
        # GEMINI PROMPT
        # ==========================================

        prompt = f"""
You are ResumeIQ, an advanced AI-powered Resume Analyzer.

Analyze the candidate's resume against the provided job description.

Use the RAG knowledge as guidance.

==============================
RAG KNOWLEDGE
==============================

{rag_context}


==============================
CANDIDATE RESUME
==============================

{resume_text}


==============================
JOB DESCRIPTION
==============================

{job_description}


IMPORTANT:

Return ONLY valid JSON.

Do NOT include markdown.

Do NOT include ```json.

Use EXACTLY this JSON structure:

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


RULES:

1. overall_score must be between 0 and 100.

2. ats_score must be between 0 and 100.

3. skills_found must contain skills actually detected in the resume.

4. matching_skills must contain skills that match the job description.

5. missing_skills must contain important job requirements missing from the resume.

6. strengths must contain clear positive observations.

7. weaknesses must contain areas needing improvement.

8. suggestions must contain actionable resume improvements.

9. recommended_roles must suggest suitable job roles.

10. summary must provide a concise professional evaluation.

11. Do not invent skills that are not present.

12. Return valid JSON only.
"""


        # ==========================================
        # GEMINI ANALYSIS
        # ==========================================

        print("Sending request to Gemini AI...")


        response = client.models.generate_content(

            model="gemini-2.5-flash",

            contents=prompt

        )


        # ==========================================
        # PARSE RESPONSE
        # ==========================================

        print("Processing Gemini response...")


        analysis_result = parse_gemini_json(
            response.text
        )


        # ==========================================
        # ADD METADATA
        # ==========================================

        analysis_result["resume_name"] = (
            resume.filename
        )


        print("Analysis completed successfully!")

        print(
            "Overall Score:",
            analysis_result.get("overall_score")
        )


        return analysis_result


    except HTTPException:

        raise


    except Exception as error:

        print("\n===================================")
        print("ANALYSIS ERROR")
        print("===================================")

        print(str(error))


        raise HTTPException(

            status_code=500,

            detail=str(error)

        )