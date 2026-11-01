"""Run one real inference with the trained Keras model fused with Quantitative Radiomics.

Extracts deep learning probability distribution, mathematical radiomic biomarkers,
and treatment planning prognostic indicators in a unified output.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from tensorflow import keras
from tensorflow.keras.applications.efficientnet import preprocess_input

# Import Radiomics Engine
try:
    from backend.ml.radiomics import (
        crop_brain_contour,
        normalize_mri_contrast,
        extract_radiomic_features,
        fuse_radiomics_and_deep_learning,
        validate_cranial_mri_scan,
    )
except ImportError:
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    from radiomics import (
        crop_brain_contour,
        normalize_mri_contrast,
        extract_radiomic_features,
        fuse_radiomics_and_deep_learning,
        validate_cranial_mri_scan,
    )

IMAGE_SIZE = (224, 224)


def main() -> None:
    if len(sys.argv) != 4:
        raise SystemExit("Usage: predict.py IMAGE_PATH MODEL_PATH CLASS_NAMES_PATH")

    image_path, model_path, class_names_path = map(Path, sys.argv[1:])
    if not model_path.is_file() or not class_names_path.is_file():
        raise SystemExit("Model assets are missing. Train the model before inference.")

    with class_names_path.open("r", encoding="utf-8") as handle:
        class_names = json.load(handle)
    if not isinstance(class_names, list) or not class_names:
        raise SystemExit("class_names.json is invalid or empty.")

    # 1. Springer-Standard Preprocessing
    orig_image = Image.open(image_path).convert("RGB")

    # Quality Control Gate: Cranial MRI Out-Of-Distribution (OOD) Validator
    is_valid, validation_msg, qc_metrics = validate_cranial_mri_scan(orig_image)
    if not is_valid:
        unrelated_result = {
            "is_valid_scan": False,
            "predicted_class": "unrelated_scan",
            "prediction": "unrelated_scan",
            "confidence": 0.0,
            "status": "unrelated_scan",
            "validation_message": validation_msg,
            "error_message": "Image is not a related Brain MRI Scan",
            "clinical_rationale": f"QUALITY CONTROL ALERT: {validation_msg} The uploaded file was rejected by the clinical validation gate because it does not match cranial Magnetic Resonance Imaging (MRI) characteristics.",
            "model_version": "EfficientNetB0-DeepLearning-Radiomics-v2.0",
            "probabilities": {c: 0.0 for c in class_names},
            "raw_probabilities": {},
            "radiomics": {"first_order": {}, "texture_glcm": {}, "morphological": {}},
            "treatment_planning": {
                "resectability_score": 0.0,
                "resectability_grade": "Not Applicable (Unrelated Image)",
                "radiation_sensitivity_index": 0.0,
                "chemo_response_index": 0.0,
                "edema_mass_effect_index": 0.0,
                "treatment_pathway": "No medical evaluation available: Uploaded file is not a valid Brain MRI scan.",
                "risk_tier": "Invalid Input",
            },
            "radar_profile": [],
            "qc_metrics": qc_metrics,
        }
        print(json.dumps(unrelated_result))
        return

    cropped_image = crop_brain_contour(orig_image)
    norm_image = normalize_mri_contrast(cropped_image)
    resized = norm_image.resize(IMAGE_SIZE)

    # 2. Multi-Scale Test-Time Augmentation (TTA)
    model = keras.models.load_model(model_path)
    arr_orig = preprocess_input(np.expand_dims(np.asarray(resized, dtype=np.float32), axis=0))
    arr_flip = preprocess_input(
        np.expand_dims(np.asarray(resized.transpose(Image.FLIP_LEFT_RIGHT), dtype=np.float32), axis=0)
    )
    p_orig = model.predict(arr_orig, verbose=0)[0]
    p_flip = model.predict(arr_flip, verbose=0)[0]
    probabilities = (p_orig + p_flip) / 2.0

    raw_prob_dict = {str(class_names[i]): float(probabilities[i]) for i in range(len(class_names))}

    # 3. Extract Quantitative Radiomics & Treatment Planning Indicators
    radiomics_data = extract_radiomic_features(image_path)

    # 4. Multi-Modal Springer Hybrid Fusion & Calibration
    predicted_label, confidence, calibrated_probs, clinical_rationale = fuse_radiomics_and_deep_learning(
        raw_prob_dict, radiomics_data, [str(c) for c in class_names]
    )

    # Re-evaluate treatment planning with the calibrated class
    radiomics_data = extract_radiomic_features(image_path, predicted_class=predicted_label)

    # 5. Unified Result Payload
    result = {
        "predicted_class": predicted_label,
        "confidence": float(confidence),
        "probabilities": calibrated_probs,
        "raw_probabilities": raw_prob_dict,
        "clinical_rationale": clinical_rationale,
        "model_version": "EfficientNetB0-DeepLearning-Radiomics-v2.0",
        "radiomics": {
            "first_order": radiomics_data.get("first_order", {}),
            "texture_glcm": radiomics_data.get("texture_glcm", {}),
            "morphological": radiomics_data.get("morphological", {}),
        },
        "treatment_planning": radiomics_data.get("treatment_planning", {}),
        "radar_profile": radiomics_data.get("radar_profile", []),
    }

    print(json.dumps(result))


if __name__ == "__main__":
    main()
