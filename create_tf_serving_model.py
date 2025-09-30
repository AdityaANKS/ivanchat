#!/usr/bin/env python3
import tensorflow as tf
import os
import shutil

def create_serving_model():
    """Create a TensorFlow Serving compatible model without using Keras save"""
    
    model_dir = '/mnt/d/ivan/models/toxicity_model/1'
    
    # Clean up existing model
    if os.path.exists(model_dir):
        shutil.rmtree(model_dir)
    os.makedirs(model_dir, exist_ok=True)
    
    print(f'Creating model with TensorFlow {tf.__version__}')
    
    # Define the serving function
    @tf.function
    def predict(input_text):
        # Ensure input is a tensor
        input_text = tf.convert_to_tensor(input_text, dtype=tf.string)
        
        # Simple processing - get text length as feature
        lengths = tf.strings.length(input_text)
        lengths_float = tf.cast(lengths, tf.float32)
        
        # Mock toxicity scoring (0-1 range)
        # Short texts: low toxicity, long texts: higher toxicity (just for demo)
        normalized = lengths_float / 100.0
        scores = tf.minimum(normalized, 1.0)
        
        return {
            'toxicity_score': scores,
            'text_length': lengths,
            'predictions': scores
        }
    
    # Get concrete function with signature
    text_spec = tf.TensorSpec(shape=[None], dtype=tf.string, name='text_input')
    concrete_func = predict.get_concrete_function(text_spec)
    
    # Save using saved_model directly
    tf.saved_model.save(
        obj=predict,
        export_dir=model_dir,
        signatures={
            'serving_default': concrete_func
        }
    )
    
    print('✅ Model created successfully')
    print(f'📁 Model saved to: {model_dir}')
    
    # Verify saved model
    print('\n📋 Verifying saved model...')
    loaded = tf.saved_model.load(model_dir)
    print('✅ Model loads correctly')
    
    # List saved files
    print('\n📁 Created files:')
    for root, dirs, files in os.walk(model_dir):
        level = root.replace(model_dir, '').count(os.sep)
        indent = ' ' * 2 * level
        print(f'{indent}{os.path.basename(root)}/')
        subindent = ' ' * 2 * (level + 1)
        for file in files:
            print(f'{subindent}{file}')
    
    return True

if __name__ == '__main__':
    try:
        create_serving_model()
    except Exception as e:
        print(f'❌ Error: {e}')
        import traceback
        traceback.print_exc()