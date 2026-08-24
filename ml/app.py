from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
from PIL import Image, UnidentifiedImageError
import torch
import io
import traceback

app = Flask(__name__)
CORS(app)

print("Loading PlantVillage disease model...")

classifier = None

try:
    classifier = pipeline(
        task="image-classification",
        model="kimcomehome/plantvillage-vit-leaf-disease"
    )
    print("✅ PlantVillage model loaded successfully!")

except Exception as e:
    print("❌ Failed to load model")
    traceback.print_exc()


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "service": "Agro AI Disease Detection",
        "model_loaded": classifier is not None
    })


@app.route("/predict", methods=["POST"])
def predict():

    if classifier is None:
        return jsonify({
            "success": False,
            "message": "Model failed to load. Check server logs."
        }), 500

    try:

        if "image" not in request.files:
            return jsonify({
                "success": False,
                "message": "No image provided."
            }), 400

        image_file = request.files["image"]

        if image_file.filename == "":
            return jsonify({
                "success": False,
                "message": "No image selected."
            }), 400

        try:
            image = Image.open(image_file.stream).convert("RGB")

        except UnidentifiedImageError:
            return jsonify({
                "success": False,
                "message": "Invalid image file."
            }), 400

        with torch.no_grad():
            results = classifier(
                image,
                top_k=5
            )

        predictions = []

        for result in results:
            predictions.append({
                "label": result["label"],
                "confidence": round(result["score"] * 100, 2)
            })

        return jsonify({
            "success": True,
            "prediction": predictions[0],
            "predictions": predictions
        })

    except Exception as e:

        print("\n================ ERROR ================\n")
        traceback.print_exc()
        print("\n=======================================\n")

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@app.route("/")
def home():
    return jsonify({
        "message": "Agro AI Disease Detection API",
        "routes": [
            "/health",
            "/predict"
        ]
    })


import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )