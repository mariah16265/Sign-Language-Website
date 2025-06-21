import pickle
import numpy as np
import sys
import os
import json

# Load model
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, 'ASL_Alphabet_Model.p')

with open(model_path, 'rb') as f:
    model_data = pickle.load(f)
    model = model_data['model']
    classes = model_data['classes']

# Get input JSON from command line
input_json = sys.stdin.read()
data = json.loads(input_json)

features = data['features']
hand = data.get('hand', 'Left')

# Flip x-coordinates for right hand
if hand == 'Right':
    for i in range(0, len(features), 2):
        features[i] = -features[i]

x = np.array(features).reshape(1, -1)
prediction = model.predict(x)[0]
proba = model.predict_proba(x)[0]
confidence = float(np.max(proba) * 100)

# Output result
print(json.dumps({
    "predicted": prediction,
    "confidence": confidence,
    "hand": hand
}), flush=True)
