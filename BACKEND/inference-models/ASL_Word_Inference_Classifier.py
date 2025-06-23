import sys
import json
import numpy as np
import pickle
import os
import tensorflow as tf

script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, 'ASL_Word_Model.keras')

# Load model and label encoder
model = tf.keras.models.load_model(model_path)
with open(os.path.join(script_dir, 'ASL_Word_Label_Encoder.pickle'), 'rb') as f:
    label_encoder = pickle.load(f)
all_class_names = label_encoder.classes_

# Module-specific class filtering
MODULE_CLASSES = {
    "animals": ["CAT", "DOG", "DOLPHIN", "EAGLE", "GIRAFFE"],
    # Add other modules here as needed
}

def main():
    input_json = sys.stdin.read()
    data = json.loads(input_json)

    features = data['features']  # should be 2280 values = 20 × 114
    hand = data.get('hand', 'Left')
    module = data.get('module', None)  # optional

    x = np.array(features).reshape(1, 20, 114).astype(np.float32)
    pred_probs = model.predict(x)[0]  # shape: (num_classes,)

    # Restrict prediction to allowed classes (if module is specified)
    if module and module.lower() in MODULE_CLASSES:
        allowed_classes = MODULE_CLASSES[module.lower()]
        allowed_indices = [i for i, label in enumerate(all_class_names) if label in allowed_classes]

        if not allowed_indices:
            raise ValueError(f"No allowed class indices found for module '{module}'")

        restricted_probs = pred_probs[allowed_indices]
        best_idx = allowed_indices[np.argmax(restricted_probs)]

        # Top 3 predictions within the allowed module only
        top_n = 3
        sorted_indices = np.argsort(restricted_probs)[-top_n:][::-1]
        top_indices = [allowed_indices[i] for i in sorted_indices]
    else:
        best_idx = int(np.argmax(pred_probs))
        top_n = 3
        top_indices = pred_probs.argsort()[-top_n:][::-1]

    predicted_word = label_encoder.inverse_transform([best_idx])[0]
    confidence = float(pred_probs[best_idx] * 100)
    top_predictions = label_encoder.inverse_transform(top_indices).tolist()
    top_confidences = [float(pred_probs[i] * 100) for i in top_indices]

    output = {
        "predicted": predicted_word,
        "confidence": confidence,
        "hand": hand,
        "module": module,
        "top_predictions": top_predictions,
        "top_confidences": top_confidences
    }
    print(json.dumps(output), flush=True)

if __name__ == "__main__":
    main()
