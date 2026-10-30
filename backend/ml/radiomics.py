"""Quantitative Radiomics & Treatment Planning Extraction Engine.

Computes high-dimensional radiomic biomarkers (first-order intensity,
GLCM spatial texture, and morphology) and models treatment planning indicators.
"""

from __future__ import annotations
import math
from pathlib import Path
from typing import Any, Dict

import numpy as np
from PIL import Image


def extract_radiomic_features(image_path: Path | str, predicted_class: str = "") -> Dict[str, Any]:
    """Extract comprehensive radiomic biomarkers and treatment planning indicators."""
    img = Image.open(image_path).convert("L").resize((224, 224))
    arr = np.array(img, dtype=np.float64) / 255.0

    # 1. First-Order Intensity Statistics
    mean = float(np.mean(arr))
    std = float(np.std(arr))
    variance = float(np.var(arr))
    skewness = float(np.mean(((arr - mean) / (std + 1e-7)) ** 3))
    kurtosis = float(np.mean(((arr - mean) / (std + 1e-7)) ** 4))

    # Normalized Shannon Histogram Entropy
    hist, _ = np.histogram(arr, bins=32, range=(0.0, 1.0), density=True)
    hist = hist[hist > 0]
    entropy = float(-np.sum(hist * np.log2(hist + 1e-9)))

    # 2. Gray-Level Co-occurrence Matrix (GLCM) Texture Metrics (16-level quantization)
    bins = 16
    quantized = np.clip((arr * (bins - 1)).astype(np.int32), 0, bins - 1)
    glcm = np.zeros((bins, bins), dtype=np.float64)
    # Horizontal co-occurrence
    glcm += np.histogram2d(
        quantized[:, :-1].ravel(), quantized[:, 1:].ravel(), bins=bins, range=[[0, bins], [0, bins]]
    )[0]
    # Vertical co-occurrence
    glcm += np.histogram2d(
        quantized[:-1, :].ravel(), quantized[1:, :].ravel(), bins=bins, range=[[0, bins], [0, bins]]
    )[0]
    glcm /= glcm.sum() + 1e-9

    i_idx, j_idx = np.indices((bins, bins))
    glcm_contrast = float(np.sum(glcm * ((i_idx - j_idx) ** 2)))
    glcm_homogeneity = float(np.sum(glcm / (1.0 + np.abs(i_idx - j_idx))))
    glcm_energy = float(np.sum(glcm**2))
    glcm_dissimilarity = float(np.sum(glcm * np.abs(i_idx - j_idx)))

    # Correlation
    mu_i = np.sum(i_idx * glcm)
    mu_j = np.sum(j_idx * glcm)
    sigma_i = np.sqrt(np.sum(((i_idx - mu_i) ** 2) * glcm) + 1e-9)
    sigma_j = np.sqrt(np.sum(((j_idx - mu_j) ** 2) * glcm) + 1e-9)
    glcm_correlation = float(np.sum((i_idx - mu_i) * (j_idx - mu_j) * glcm) / (sigma_i * sigma_j))

    # 3. Morphological & Structural Biomarkers
    grad_y, grad_x = np.gradient(arr)
    grad_mag = np.sqrt(grad_x**2 + grad_y**2)
    edge_sharpness = float(np.mean(grad_mag))

    tissue_mask = arr > 0.08
    tissue_fraction = float(np.sum(tissue_mask) / arr.size)
    high_intensity = arr > (mean + 1.25 * std)
    lesion_ratio = float(np.sum(high_intensity) / (np.sum(tissue_mask) + 1e-7))
    heterogeneity_index = float(std / (mean + 1e-7))

    # 4. Treatment Planning & Clinical Decision Support Modeling
    cls_lower = (predicted_class or "").lower()

    if cls_lower == "notumor":
        resectability = 0.0
        rsi = 0.0
        chemo_response = 0.0
        edema_index = 0.0
        resectability_grade = "Not Applicable (Healthy Tissue)"
        treatment_pathway = "No oncological intervention indicated. Routine clinical checkup as scheduled."
        risk_tier = "Baseline Normal"
    elif cls_lower == "meningioma":
        # Meningiomas typically have sharp, dural-based margins -> higher GTR resectability
        resectability = min(96.0, max(68.0, 75.0 + edge_sharpness * 350.0))
        rsi = min(85.0, max(50.0, 60.0 + glcm_homogeneity * 25.0))
        chemo_response = 42.0  # Meningiomas are typically radiation/surgery primary
        edema_index = min(80.0, max(20.0, lesion_ratio * 180.0))
        resectability_grade = "High Resectability (Well-circumscribed extra-axial margin)"
        treatment_pathway = "Surgical resection (Simpson Grade I-II) recommended. Adjuvant Stereotactic Radiosurgery (SRS) for residual skull-base attachment."
        risk_tier = "Moderate Resection Priority"
    elif cls_lower == "pituitary":
        # Pituitary adenomas: Transsphenoidal approach common
        resectability = min(92.0, max(72.0, 80.0 + edge_sharpness * 250.0))
        rsi = min(88.0, max(55.0, 68.0 + glcm_homogeneity * 20.0))
        chemo_response = 38.0
        edema_index = min(45.0, max(15.0, lesion_ratio * 120.0))
        resectability_grade = "Favorable for Endoscopic Endonasal Resection"
        treatment_pathway = "Transsphenoidal microsurgical/endoscopic resection. Endocrine hormone level monitoring and targeted Gamma Knife if cavernous sinus invasion."
        risk_tier = "Favorable Resection Profile"
    elif cls_lower == "glioma":
        # Gliomas typically have infiltrative margins -> lower margin sharpness
        resectability = min(78.0, max(45.0, 52.0 + edge_sharpness * 300.0 - heterogeneity_index * 12.0))
        rsi = min(82.0, max(48.0, 55.0 + glcm_contrast * 15.0))
        chemo_response = min(89.0, max(58.0, 62.0 + heterogeneity_index * 18.0))
        edema_index = min(95.0, max(45.0, lesion_ratio * 250.0))
        resectability_grade = "Guarded Resectability (Infiltrative diffuse margins)"
        treatment_pathway = "Maximal safe surgical resection with intraoperative mapping, followed by adjuvant Stupp Protocol (concurrent Temozolomide + Fractionated Radiotherapy)."
        risk_tier = "High Priority Multimodal Therapy"
    else:
        resectability = 65.0
        rsi = 60.0
        chemo_response = 50.0
        edema_index = 40.0
        resectability_grade = "Investigational Assessment"
        treatment_pathway = "Multidisciplinary tumor board evaluation indicated."
        risk_tier = "Under Evaluation"

    # Radar profile scores normalized (0 - 100 scale)
    radar_profile = [
        {"metric": "Tissue Density", "value": round(min(100.0, mean * 350.0), 1), "benchmark": 45.0},
        {"metric": "Heterogeneity", "value": round(min(100.0, heterogeneity_index * 75.0), 1), "benchmark": 30.0},
        {"metric": "Margin Sharpness", "value": round(min(100.0, edge_sharpness * 1800.0), 1), "benchmark": 50.0},
        {"metric": "Texture Complexity", "value": round(min(100.0, glcm_contrast * 60.0), 1), "benchmark": 35.0},
        {"metric": "Structural Uniformity", "value": round(min(100.0, glcm_homogeneity * 110.0), 1), "benchmark": 60.0},
        {"metric": "Vascular Cellularity", "value": round(min(100.0, lesion_ratio * 320.0), 1), "benchmark": 25.0},
    ]

    return {
        "first_order": {
            "mean_intensity": round(mean, 4),
            "std_deviation": round(std, 4),
            "variance": round(variance, 4),
            "skewness": round(skewness, 4),
            "kurtosis": round(kurtosis, 4),
            "entropy": round(entropy, 4),
        },
        "texture_glcm": {
            "contrast": round(glcm_contrast, 4),
            "homogeneity": round(glcm_homogeneity, 4),
            "energy": round(glcm_energy, 4),
            "dissimilarity": round(glcm_dissimilarity, 4),
            "correlation": round(glcm_correlation, 4),
        },
        "morphological": {
            "edge_sharpness": round(edge_sharpness, 4),
            "tissue_fraction": round(tissue_fraction, 4),
            "lesion_area_ratio": round(lesion_area_ratio, 4),
            "heterogeneity_index": round(heterogeneity_index, 4),
        },
        "treatment_planning": {
            "resectability_score": round(resectability, 1),
            "resectability_grade": resectability_grade,
            "radiation_sensitivity_index": round(rsi, 1),
            "chemo_response_index": round(chemo_response, 1),
            "edema_mass_effect_index": round(edema_index, 1),
            "treatment_pathway": treatment_pathway,
            "risk_tier": risk_tier,
        },
        "radar_profile": radar_profile,
    }

