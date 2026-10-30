"""Reproducible EfficientNetB0 transfer-learning pipeline.

Expected dataset layout:
dataset/
  Training/<class-name>/*.jpg
  Testing/<class-name>/*.jpg

The script discovers class folders from Training, uses Testing as the held-out
evaluation set when available, and writes only actual model results.
"""

from __future__ import annotations

import argparse
import json
import random
from pathlib import Path

import numpy as np
import tensorflow as tf
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score, precision_score, recall_score
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.applications.efficientnet import preprocess_input


SEED = 42
IMAGE_SIZE = (224, 224)
DEFAULT_EPOCHS = 12


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train the brain MRI classifier.")
    parser.add_argument("--dataset", type=Path, default=Path("dataset"))
    parser.add_argument("--models", type=Path, default=Path("models"))
    parser.add_argument("--analytics", type=Path, default=Path("analytics"))
    parser.add_argument("--epochs", type=int, default=DEFAULT_EPOCHS)
    parser.add_argument("--batch-size", type=int, default=16)
    return parser.parse_args()


def set_seeds() -> None:
    random.seed(SEED)
    np.random.seed(SEED)
    tf.random.set_seed(SEED)


def class_names_from(training_dir: Path) -> list[str]:
    classes = sorted(path.name for path in training_dir.iterdir() if path.is_dir())
    if len(classes) < 2:
        raise ValueError(f"Expected at least two class folders in {training_dir}. Found: {classes}")
    return classes


def preprocess_dataset(image, label):
    return preprocess_input(image), label


def build_model(class_count: int) -> keras.Model:
    augmentation = keras.Sequential(
        [
            layers.RandomFlip("horizontal"),
            layers.RandomRotation(0.05),
            layers.RandomZoom(0.08),
        ],
        name="augmentation",
    )
    base = keras.applications.EfficientNetB0(
        include_top=False,
        weights="imagenet",
        input_shape=(*IMAGE_SIZE, 3),
    )
    base.trainable = False
    inputs = keras.Input(shape=(*IMAGE_SIZE, 3))
    x = augmentation(inputs)
    x = base(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.25)(x)
    outputs = layers.Dense(class_count, activation="softmax")(x)
    model = keras.Model(inputs, outputs)
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=1e-3),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model


def main() -> None:
    args = parse_args()
    set_seeds()
    training_dir = args.dataset / "Training"
    testing_dir = args.dataset / "Testing"
    if not training_dir.is_dir():
        raise FileNotFoundError(
            f"Training dataset not found at {training_dir}. "
            "Place a licensed dataset in dataset/Training/<class-name>/ before training."
        )

    class_names = class_names_from(training_dir)
    args.models.mkdir(parents=True, exist_ok=True)
    args.analytics.mkdir(parents=True, exist_ok=True)
    with (args.models / "class_names.json").open("w", encoding="utf-8") as handle:
        json.dump(class_names, handle, indent=2)

    train = keras.utils.image_dataset_from_directory(
        training_dir,
        class_names=class_names,
        image_size=IMAGE_SIZE,
        batch_size=args.batch_size,
        validation_split=0.2 if not testing_dir.is_dir() else None,
        subset="training" if not testing_dir.is_dir() else None,
        seed=SEED,
        shuffle=True,
    )
    validation = None
    if not testing_dir.is_dir():
        validation = keras.utils.image_dataset_from_directory(
            training_dir,
            class_names=class_names,
            image_size=IMAGE_SIZE,
            batch_size=args.batch_size,
            validation_split=0.2,
            subset="validation",
            seed=SEED,
            shuffle=False,
        )
    else:
        validation = keras.utils.image_dataset_from_directory(
            testing_dir,
            class_names=class_names,
            image_size=IMAGE_SIZE,
            batch_size=args.batch_size,
            shuffle=False,
        )

    autotune = tf.data.AUTOTUNE
    train = train.map(preprocess_dataset, num_parallel_calls=autotune).prefetch(autotune)
    validation = validation.map(preprocess_dataset, num_parallel_calls=autotune).prefetch(autotune)
    model = build_model(len(class_names))
    model_path = args.models / "brain_tumor_model.keras"
    callbacks = [
        keras.callbacks.EarlyStopping(monitor="val_loss", patience=3, restore_best_weights=True),
        keras.callbacks.ReduceLROnPlateau(monitor="val_loss", factor=0.3, patience=2),
        keras.callbacks.ModelCheckpoint(model_path, monitor="val_accuracy", save_best_only=True),
    ]
    history = model.fit(train, validation_data=validation, epochs=args.epochs, callbacks=callbacks)

    labels: list[int] = []
    probabilities: list[np.ndarray] = []
    for images, batch_labels in validation:
        labels.extend(batch_labels.numpy().tolist())
        probabilities.append(model.predict(images, verbose=0))
    y_true = np.asarray(labels)
    y_probabilities = np.concatenate(probabilities)
    y_pred = np.argmax(y_probabilities, axis=1)
    metrics = {
        "accuracy": float(accuracy_score(y_true, y_pred)),
        "precision": float(precision_score(y_true, y_pred, average="weighted", zero_division=0)),
        "recall": float(recall_score(y_true, y_pred, average="weighted", zero_division=0)),
        "f1_score": float(f1_score(y_true, y_pred, average="weighted", zero_division=0)),
        "class_names": class_names,
        "confusion_matrix": confusion_matrix(y_true, y_pred, labels=list(range(len(class_names)))).tolist(),
        "history": {key: [float(value) for value in values] for key, values in history.history.items()},
    }
    with (args.analytics / "model_metrics.json").open("w", encoding="utf-8") as handle:
        json.dump(metrics, handle, indent=2)
    print(json.dumps({key: value for key, value in metrics.items() if key != "history"}, indent=2))


if __name__ == "__main__":
    main()