from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import requests
import io
from PIL import Image
from auth_key import API_KEY  # Import API_KEY from auth_key.py

app = Flask(__name__)
CORS(app)

API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
headers = {"Authorization": f"Bearer {API_KEY}"}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.content

@app.route('/generate-image', methods=['POST'])
def generate_image():
    data = request.json
    text = data.get('text')
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    image_bytes = query({"inputs": text})
    image = Image.open(io.BytesIO(image_bytes))
    img_io = io.BytesIO()
    image.save(img_io, 'JPEG')
    img_io.seek(0)
    return send_file(img_io, mimetype='image/jpeg')

if __name__ == '__main__':
    app.run(debug=True)
