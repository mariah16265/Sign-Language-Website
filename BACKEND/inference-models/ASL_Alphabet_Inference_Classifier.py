import pickle
import numpy as np
import sys
import os
import json

# Load model
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, 'ASL_Alphabet_Model.p')  # Make sure this matches your model filename

with open(model_path, 'rb') as f:
    model_data = pickle.load(f)
    model = model_data['model']
    classes = model_data['classes']
    min_vals = model_data['min_vals']  # Load min values from training
    max_vals = model_data['max_vals']  # Load max values from training

# Get input JSON from command line
input_json = sys.stdin.read()
data = json.loads(input_json)

features = data['features']
hand = data.get('hand', 'Left')

# Flip x-coordinates for right hand
if hand == 'Right':
    for i in range(0, len(features), 2):
        features[i] = -features[i]

# Apply min-max scaling using training parameters
scaled_features = []
for i in range(len(features)):
    # Handle near-zero ranges safely
    range_val = max_vals[i] - min_vals[i]
    if range_val < 1e-8:
        scaled_val = 0.0
    else:
        scaled_val = (features[i] - min_vals[i]) / range_val
    scaled_features.append(scaled_val)

x = np.array(scaled_features).reshape(1, -1)
prediction = model.predict(x)[0]
proba = model.predict_proba(x)[0]
confidence = float(np.max(proba) * 100)

# Get top 3 predictions and confidences
top_n = 3
top_indices = np.argsort(proba)[-top_n:][::-1]  # Indices of top probabilities (descending)
top_predictions = [classes[i] for i in top_indices]
top_confidences = [float(proba[i] * 100) for i in top_indices]

# Output result with top predictions
print(json.dumps({
    "predicted": prediction,
    "confidence": confidence,
    "hand": hand,
    "top_predictions": top_predictions,
    "top_confidences": top_confidences
}), flush=True)