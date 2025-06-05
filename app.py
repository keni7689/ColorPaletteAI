import os
import cv2
import numpy as np
from flask import Flask, request, render_template, jsonify, send_file
from werkzeug.utils import secure_filename
from sklearn.cluster import KMeans
import json
import tempfile
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}

def allowed_file(filename):
    """Check if uploaded file has allowed extension"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def rgb_to_hex(rgb):
    """Convert RGB values to hex color code"""
    return "#{:02x}{:02x}{:02x}".format(int(rgb[0]), int(rgb[1]), int(rgb[2]))

def extract_colors(image_path, num_colors=5):
    """
    Extract dominant colors from image using KMeans clustering
    Returns list of colors in RGB format
    """
    # Read image using OpenCV
    image = cv2.imread(image_path)
    
    # Convert BGR to RGB (OpenCV uses BGR by default)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Reshape image to be a list of pixels
    data = image.reshape((-1, 3))
    
    # Apply KMeans clustering to find dominant colors
    kmeans = KMeans(n_clusters=num_colors, random_state=42, n_init=10)
    kmeans.fit(data)
    
    # Get the colors (centroids)
    colors = kmeans.cluster_centers_
    
    # Get labels for each pixel
    labels = kmeans.labels_
    
    # Count frequency of each color
    unique_labels, counts = np.unique(labels, return_counts=True)
    
    # Sort colors by frequency (most dominant first)
    color_freq = list(zip(colors, counts))
    color_freq.sort(key=lambda x: x[1], reverse=True)
    
    # Extract just the colors
    dominant_colors = [color[0] for color in color_freq]
    
    return dominant_colors

@app.route('/')
def index():
    """Homepage route"""
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    """Handle file upload and color extraction"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file selected'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        # Secure the filename and save
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_")
        filename = timestamp + filename
        
        # Ensure upload directory exists
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        try:
            # Extract colors from the image
            colors_rgb = extract_colors(file_path)
            
            # Convert to hex and create color palette data
            palette = []
            for i, color in enumerate(colors_rgb):
                hex_code = rgb_to_hex(color)
                palette.append({
                    'id': i + 1,
                    'hex': hex_code,
                    'rgb': {
                        'r': int(color[0]),
                        'g': int(color[1]),
                        'b': int(color[2])
                    }
                })
            
            return render_template('result.html', 
                                 image_filename=filename,
                                 palette=palette)
            
        except Exception as e:
            # Clean up uploaded file on error
            if os.path.exists(file_path):
                os.remove(file_path)
            return jsonify({'error': f'Error processing image: {str(e)}'}), 500
    
    return jsonify({'error': 'Invalid file type. Please upload an image file.'}), 400

@app.route('/download-palette')
def download_palette():
    """Download color palette as JSON file"""
    palette_data = request.args.get('data')
    
    if not palette_data:
        return jsonify({'error': 'No palette data provided'}), 400
    
    try:
        # Create temporary file
        temp_file = tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False)
        temp_file.write(palette_data)
        temp_file.close()
        
        # Generate filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"color_palette_{timestamp}.json"
        
        return send_file(temp_file.name, 
                        as_attachment=True, 
                        download_name=filename,
                        mimetype='application/json')
    
    except Exception as e:
        return jsonify({'error': f'Error creating download: {str(e)}'}), 500

@app.errorhandler(413)
def too_large(e):
    """Handle file too large error"""
    return jsonify({'error': 'File is too large. Maximum size is 16MB.'}), 413

@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors"""
    return render_template('index.html'), 404

if __name__ == '__main__':
    # Create upload directory if it doesn't exist
    os.makedirs('static/uploads', exist_ok=True)
    
    # Run the app in debug mode
    app.run(debug=True, host='0.0.0.0', port=5000)