
import sys
import subprocess
import json
from pathlib import Path

def test_inference():
    root = Path(__file__).resolve().parent
    predict_script = root / "backend" / "ml" / "predict.py"
    model_path = root / "models" / "brain_tumor_model.keras"
    class_names_path = root / "models" / "class_names.json"
    testing_dir = root / "dataset" / "Testing"

    test_cases = [
        ("glioma", "Te-gl_1.jpg"),
        ("meningioma", "Te-me_1.jpg"),
        ("notumor", "Te-no_1.jpg"),
        ("pituitary", "Te-pi_1.jpg")
    ]

    print("--- Inference Verification ---")
    for expected_class, filename in test_cases:
        image_path = testing_dir / expected_class / filename
        if not image_path.exists():
            print(f"Skipping {expected_class}: {image_path} not found.")
            continue
            
        cmd = [sys.executable, str(predict_script), str(image_path), str(model_path), str(class_names_path)]
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            print(f"FAILED: {expected_class} - {result.stderr}")
        else:
            try:
                output = json.loads(result.stdout)
                pred_class = output.get("predicted_class")
                confidence = output.get("confidence")
                print(f"SUCCESS: Input={expected_class}, Predicted={pred_class}, Confidence={confidence:.4f}")
            except Exception as e:
                print(f"ERROR parsing JSON for {expected_class}: {e}")

if __name__ == "__main__":
    test_inference()
