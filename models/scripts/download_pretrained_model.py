print("Script started...")

import tensorflow as tf
import tensorflow_hub as hub
import os

print("Imports done.")

print("Downloading pretrained toxicity model...")

model_url = "https://tfhub.dev/tensorflow/toxicity/1"
model_dir = r"D:\ivan\models\toxicity_model\1"
os.makedirs(model_dir, exist_ok=True)

# Load model from TF Hub
model = hub.load(model_url)
print("Model downloaded from TF Hub.")

# Save for TensorFlow Serving
tf.saved_model.save(model, model_dir)
print(f"✅ Model saved at {model_dir}")

# List saved files for verification
print("Saved model contents:")
print(os.listdir(model_dir))
