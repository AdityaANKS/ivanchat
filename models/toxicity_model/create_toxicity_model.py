#!/usr/bin/env python3
"""
Create a simple toxicity detection model for TensorFlow Serving
Location: /mnt/d/ivan/models/scripts/create_toxicity_model.py
"""

import tensorflow as tf
import os
import sys

# Get the models directory path
script_dir = os.path.dirname(os.path.abspath(__file__))
models_dir = os.path.dirname(script_dir)
model_path = os.path.join(models_dir, "toxicity_model", "1")

print(f"Creating model at: {model_path}")

# Create directory if it doesn't exist
os.makedirs(model_path, exist_ok=True)

# Create a simple model
@tf.function
def preprocess(text):
    # Simple preprocessing - convert text length to feature
    return tf.cast(tf.strings.length(text), tf.float32)

class ToxicityModel(tf.keras.Model):
    def __init__(self):
        super().__init__()
        self.dense1 = tf.keras.layers.Dense(16, activation='relu')
        self.dense2 = tf.keras.layers.Dense(1, activation='sigmoid')
    
    @tf.function(input_signature=[tf.TensorSpec(shape=[None], dtype=tf.string)])
    def serve(self, text):
        # Preprocess
        features = tf.map_fn(preprocess, text, dtype=tf.float32)
        features = tf.reshape(features, [-1, 1])
        
        # Predict
        x = self.dense1(features)
        toxicity = self.dense2(x)
        
        # Return structured output
        return {
            'toxicity_score': toxicity,
            'is_toxic': tf.greater(toxicity, 0.5)
        }

# Create and save the model
print("Building model...")
model = ToxicityModel()

# Test the model
test_input = tf.constant(["test text"])
_ = model.serve(test_input)

# Save for TensorFlow Serving
print(f"Saving model to {model_path}...")
tf.saved_model.save(
    model,
    model_path,
    signatures={
        'serving_default': model.serve
    }
)

print("✅ Model created successfully!")
print(f"📁 Model location: {model_path}")

# Verify the saved files
print("\n📋 Created files:")
for root, dirs, files in os.walk(model_path):
    level = root.replace(model_path, '').count(os.sep)
    indent = ' ' * 2 * level
    print(f"{indent}{os.path.basename(root)}/")
    subindent = ' ' * 2 * (level + 1)
    for file in files:
        print(f"{subindent}{file}")