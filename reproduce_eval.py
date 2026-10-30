
import json
from pathlib import Path
import numpy as np
import tensorflow as tf
from tensorflow import keras
from sklearn.metrics import classification_report, confusion_matrix
from tensorflow.keras.applications.efficientnet import preprocess_input

SEED = 42
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32

def preprocess_dataset(image, label):
    return preprocess_input(image), label

def evaluate():
    root = Path(r"d:\AD - 3\Brain-Tumor-Classifier\Brain-Tumor-Classifier\Brain-Tumor-Classifier")
    model_path = root / "models" / "brain_tumor_model.keras"
    class_names_path = root / "models" / "class_names.json"
    testing_dir = root / "dataset" / "Testing"

    print(f"Loading model from {model_path}...")
    model = keras.models.load_model(model_path)
    
    with open(class_names_path, "r") as f:
        class_names = json.load(f)
    print(f"Classes: {class_names}")

    print("Loading test dataset...")
    test_ds = keras.utils.image_dataset_from_directory(
        testing_dir,
        class_names=class_names,
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        shuffle=False
    )

    test_ds = test_ds.map(preprocess_dataset).prefetch(tf.data.AUTOTUNE)

    print("Evaluating...")
    y_true = []
    y_pred = []
    
    for images, labels in test_ds:
        preds = model.predict(images, verbose=0)
        y_true.extend(labels.numpy())
        y_pred.extend(np.argmax(preds, axis=1))

    y_true = np.array(y_true)
    y_pred = np.array(y_pred)

    from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
    
    metrics = {
        "accuracy": float(accuracy_score(y_true, y_pred)),
        "precision": float(precision_score(y_true, y_pred, average="weighted", zero_division=0)),
        "recall": float(recall_score(y_true, y_pred, average="weighted", zero_division=0)),
        "f1_score": float(f1_score(y_true, y_pred, average="weighted", zero_division=0)),
        "class_names": class_names,
        "confusion_matrix": confusion_matrix(y_true, y_pred).tolist(),
        "history": {} # History not available from a simple evaluation
    }
    
    analytics_dir = root / "analytics"
    analytics_dir.mkdir(exist_ok=True)
    with open(analytics_dir / "model_metrics.json", "w") as f:
        json.dump(metrics, f, indent=2)

    print("\n--- Classification Report ---")
    print(classification_report(y_true, y_pred, target_names=class_names, digits=4))
    
    print("\n--- Confusion Matrix ---")
    print(confusion_matrix(y_true, y_pred))

if __name__ == "__main__":
    evaluate()
