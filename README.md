# BICU - Batch Image Converter Utility

A powerful desktop application for batch image conversion built with Tauri, React, and Rust.

## 🚀 Features

- **Batch Processing**: Convert multiple images at once
- **Multiple Formats**: Support for PNG, JPEG, WebP, and TIFF
- **Quality Control**: Adjustable compression quality (50-100%)
- **Favorites System**: Save frequently used source and destination folders
- **Conversion Analytics**: View processing statistics and file size comparisons
- **High Performance**: Rust backend for fast, efficient image processing
- **Cross-Platform**: Native desktop application

## 🛠 Tech Stack

- **Frontend**: React, Vite, CSS3
- **Backend**: Rust
- **Framework**: Tauri
- **Image Processing**: ImageMagick (via magick_rust)
- **File System**: Tauri plugins for native file operations

## 📱 Deployment

This project has two deployment configurations:

### 1. Desktop Application
The main application is built as a native desktop app using Tauri.

**Available Platforms:**
- ✅ **macOS**: Built and ready (Intel & Apple Silicon)
- 🔄 **Windows**: Coming soon (requires CI/CD setup)
- 🔄 **Linux**: Coming soon (requires CI/CD setup)

### 2. Portfolio Landing Page
A professional landing page showcasing the application for portfolio purposes.

**Location**: `/portfolio-landing/`
**Deployed to**: Vercel
**Purpose**: Showcase the desktop app and provide download links

## 🏗 Building

### Prerequisites
- Node.js (LTS version)
- Rust (latest stable)
- System dependencies:
  - **macOS**: `brew install imagemagick`
  - **Ubuntu**: `sudo apt-get install libmagickwand-dev`
  - **Windows**: ImageMagick development libraries

### Build Commands

```bash
# Navigate to the app directory
cd image-converter

# Install dependencies
npm install

# Development mode
npm run tauri dev

# Build for production
npm run tauri build
```

### Cross-Platform Builds

For automated cross-platform builds, use GitHub Actions:

1. Push a tag: `git tag v1.0.0 && git push origin v1.0.0`
2. The workflow will build for macOS, Windows, and Linux
3. Releases are created automatically with downloadable assets

## 📁 Project Structure

```
Image-Converter/
├── image-converter/          # Main Tauri application
│   ├── src/                 # React frontend
│   ├── src-tauri/           # Rust backend
│   ├── package.json
│   └── vite.config.js
├── portfolio-landing/        # Landing page for deployment
│   ├── index.html
│   ├── style.css
│   └── package.json
├── .github/workflows/        # CI/CD for cross-platform builds
└── README.md
```

## 🌐 Live Demo

**Portfolio Landing Page**: [Your Vercel URL here]

The landing page showcases the application with:
- Feature highlights and screenshots
- Download links for different platforms
- Technical specifications
- Professional presentation for portfolio use

## 🔧 Development

### Local Development
```bash
cd image-converter
npm run tauri dev
```

### Testing the Landing Page
```bash
cd portfolio-landing
python3 -m http.server 3000
# Visit http://localhost:3000
```

## 📋 System Requirements

- **macOS**: 10.15 or later
- **Windows**: Windows 10 or later  
- **Linux**: Ubuntu 18.04+ or equivalent
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 50MB free space

## 🎯 Portfolio Notes

This application demonstrates:
- **Desktop Development**: Tauri framework expertise
- **Frontend Skills**: Modern React with hooks and component architecture
- **Backend Programming**: Rust systems programming
- **Image Processing**: Working with native libraries and file systems
- **UI/UX Design**: Intuitive interface design
- **Cross-Platform Development**: Building for multiple operating systems
- **CI/CD**: Automated build and release processes

## 📄 License

MIT License - see LICENSE file for details

## 👤 Author

**Daniel Voigt**
- GitHub: [@danielvoigt](https://github.com/danielvoigt)
- Portfolio: [Your portfolio URL]
