from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
import numpy as np
from PIL import Image
import io
import base64
import tensorflow as tf
from tensorflow.keras.models import load_model
import os

app = FastAPI()

# Allow CORS for local dev and Vercel/Netlify
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "models/final_blood_grouping_model.h5"
MODEL_IMG_SIZE = (224, 224)
ANTIBODY_TYPES = ["Anti-A", "Anti-B", "Anti-D (Rh)"]
BLOOD_TYPE_RULES = {
    (True, False, True): "A+", (True, False, False): "A-",
    (False, True, True): "B+", (False, True, False): "B-",
    (True, True, True): "AB+", (True, True, False): "AB-",
    (False, False, True): "O+", (False, False, False): "O-",
}

model = None
if os.path.exists(MODEL_PATH):
    model = load_model(MODEL_PATH)

def preprocess_for_model(img_pil):
    img_resized = img_pil.resize(MODEL_IMG_SIZE)
    img_array = np.array(img_resized)
    if img_array.ndim == 2:
        img_array = np.stack((img_array,) * 3, axis=-1)
    img_array = img_array / 255.0
    return np.expand_dims(img_array, axis=0)

def analyze_single_section(img_pil):
    if model is None:
        return {"agglutination": None, "confidence": 0}
    processed_batch = preprocess_for_model(img_pil)
    prediction = model.predict(processed_batch)[0][0]
    AGGLUTINATION_THRESHOLD = 0.3
    agglutination = bool(prediction > AGGLUTINATION_THRESHOLD)
    raw_confidence = float(prediction) if agglutination else 1 - float(prediction)
    confidence = round(raw_confidence, 2)
    return {"agglutination": agglutination, "confidence": confidence}

class AnalysisResult(BaseModel):
    blood_type: str
    confidence_score: float
    analysis_data: Dict[str, Any]

@app.post("/analyze", response_model=AnalysisResult)
async def analyze_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    img_pil = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img_np = np.array(img_pil)
    h, w, _ = img_np.shape
    num_sections = 3
    section_width = w // num_sections
    sections_np = [img_np[:, i * section_width:(i + 1) * section_width] for i in range(num_sections)]
    analysis_data = {}
    agglutination_tuple = []
    for i, section_np in enumerate(sections_np):
        section_pil = Image.fromarray(section_np)
        result = analyze_single_section(section_pil)
        analysis_data[f"section_{i}"] = result
        agglutination_tuple.append(result["agglutination"])
    blood_type = BLOOD_TYPE_RULES.get(tuple(agglutination_tuple), "Undetermined")
    confidence_score = np.mean([v["confidence"] for v in analysis_data.values()])
    return AnalysisResult(
        blood_type=blood_type,
        confidence_score=confidence_score,
        analysis_data=analysis_data
    )
