# ColorPaletteAI 🎨

A modern Flask web application that extracts the top 5 dominant colors from uploaded images using AI-powered K-Means clustering. Built with OpenCV and scikit-learn for robust color analysis.

![colorPaleete](https://github.com/user-attachments/assets/d4f0823f-c31b-4d44-8f60-5d758d20623a)


## ✨ Features

- **AI-Powered Color Extraction**: Uses K-Means clustering to identify dominant colors
- **Modern UI**: Clean, responsive design with Bootstrap and custom CSS
- **Drag & Drop Upload**: Easy file upload with drag-and-drop support
- **One-Click Copy**: Click any color to copy its hex code to clipboard
- **Export Functionality**: Download color palettes as JSON files
- **Mobile Responsive**: Works perfectly on all device sizes
- **File Validation**: Supports JPG, PNG, GIF, BMP, WEBP (max 16MB)

## 🚀 Quick Start

### Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd ColorPaletteAI
   ```

2. **Create a virtual environment** (recommended)
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## 📁 Project Structure

```
ColorPaletteAI/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # Project documentation
├── static/
│   ├── css/
│   │   └── style.css     # Custom styles
│   ├── js/
│   │   └── script.js     # JavaScript functionality
│   └── uploads/          # Uploaded images storage
└── templates/
    ├── index.html        # Homepage template
    └── result.html       # Results page template
```

## 🛠️ How It Works

1. **Image Upload**: Users upload an image through the web interface
2. **Color Processing**: OpenCV loads and processes the image
3. **K-Means Clustering**: scikit-learn's K-Means algorithm identifies 5 dominant colors
4. **Color Sorting**: Colors are sorted by frequency (most dominant first)
5. **Results Display**: Colors are displayed with hex codes and RGB values
6. **Export Options**: Users can copy hex codes or download as JSON

## 🎯 Technical Details

### Backend (Flask)
- **Framework**: Flask 2.3.3
- **Image Processing**: OpenCV 4.8.1
- **Machine Learning**: scikit-learn 1.3.0
- **File Handling**: Werkzeug for secure uploads
- **Color Analysis**: K-Means clustering with n_clusters=5

### Frontend
- **UI Framework**: Bootstrap 5.3.0
- **Icons**: Font Awesome 6.0.0
- **Styling**: Custom CSS with gradients and animations
- **JavaScript**: Vanilla JS for interactions and file handling

### Key Algorithms
- **K-Means Clustering**: Groups similar colors together
- **Color Space**: RGB color space for web compatibility
- **Frequency Analysis**: Colors sorted by pixel count

## 🔧 Configuration

### File Upload Settings
- **Max file size**: 16MB
- **Allowed formats**: PNG, JPG, JPEG, GIF, BMP, WEBP
- **Upload directory**: `static/uploads/`

### Color Extraction Settings
- **Number of colors**: 5 (configurable in `extract_colors()` function)
- **Random state**: 42 (for reproducible results)
- **Color space**: RGB

## 🚀 Deployment

### Local Development
```bash
python app.py
```
The app runs on `http://localhost:5000` with debug mode enabled.

### Production Deployment
For production, consider:
- Setting `debug=False`
- Using a production WSGI server (e.g., Gunicorn)
- Configuring proper file upload limits
- Setting up proper error logging
- Using environment variables for configuration

## 📝 API Endpoints

- `GET /` - Homepage
- `POST /upload` - Handle file upload and color extraction
- `GET /download-palette` - Download color palette as JSON

## 🎨 Color Palette Format

The application exports color palettes in the following JSON format:

```json
[
  {
    "id": 1,
    "hex": "#FF5733",
    "rgb": {
      "r": 255,
      "g": 87,
      "b": 51
    }
  },
  ...
]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **OpenCV** for image processing capabilities
- **scikit-learn** for K-Means clustering algorithm
- **Flask** for the web framework
- **Bootstrap** for responsive UI components
- **Font Awesome** for beautiful icons

## 🐛 Troubleshooting

### Common Issues

1. **Import Error for cv2**
   ```bash
   pip install opencv-python
   ```

2. **File Upload Issues**
   - Check file size (max 16MB)
   - Ensure file is a valid image format
   - Verify upload directory permissions

3. **Color Extraction Errors**
   - Ensure image is not corrupted
   - Check if image has sufficient color variation

### Error Handling

The application includes comprehensive error handling for:
- Invalid file types
- File size limits
- Image processing errors
- Server errors

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review the error messages in the browser console
3. Check the Flask application logs
4. Open an issue on the project repository

---

Made with ❤️ using Flask, OpenCV, and scikit-learn
