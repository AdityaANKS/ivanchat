#!/bin/bash

echo "🚀 Setting up ML models for Ivan Chat"

# Create directory structure
echo "📁 Creating directories..."
mkdir -p /mnt/d/ivan/models/toxicity_model
mkdir -p /mnt/d/ivan/models/scripts

# Create the model
echo "🤖 Creating toxicity model..."
python3 << 'EOF'
import tensorflow as tf
import os

model_dir = "/mnt/d/ivan/models/toxicity_model/1"
os.makedirs(model_dir, exist_ok=True)

model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=[], dtype=tf.string),
    tf.keras.layers.Lambda(lambda x: tf.expand_dims(tf.cast(tf.strings.length(x), tf.float32), -1)),
    tf.keras.layers.Dense(16, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

model.build()
tf.saved_model.save(model, model_dir)
print(f"✅ Model saved to {model_dir}")
EOF

# Start TensorFlow Serving
echo "🐳 Starting TensorFlow Serving..."
docker run -d --name toxicity-model \
  -p 8501:8501 \
  -v /mnt/d/ivan/models/toxicity_model:/models/toxicity_model \
  -e MODEL_NAME=toxicity_model \
  tensorflow/serving

echo "✅ Setup complete!"
echo "📊 Test the model at: http://localhost:8501/v1/models/toxicity_model"
else
    print("Model downloaded and saved successfully.")