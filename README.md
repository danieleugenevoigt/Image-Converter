# 📦 Batch Image Converter Utility (BICU)

A simple, fast, and customizable batch image converter built with **React**, **Vite**, **Rust**, and **Tauri**. It lets you convert large sets of images between formats with just a few clicks.

This repository contains both the native desktop application and its portfolio landing page.

---

## ✨ Key Features

*   **Batch Processing**: Convert multiple images at once with support for various formats including PNG, JPEG, WebP, and TIFF.
*   **Quality Control**: Adjust compression quality from 50% to 100% to balance file size and image quality.
*   **Favorites System**: Save frequently used source and destination folders for quick access.
*   **Conversion Analytics**: View detailed statistics including file count, processing time, and file size comparisons.
*   **High Performance**: Built with a Rust backend for fast, efficient image processing.
*   **Cross-Platform**: Native desktop application built with the Tauri framework.

---

## 🛠 Tech Stack

- **Frontend**: React, Vite, CSS3
- **Backend**: Rust
- **Framework**: Tauri
- **Image Processing**: `image` crate

---

## 📥 Download

You can download the latest version of the application directly from the **GitHub Releases** page.

| Platform | Status |
|:---:|:---:|
| **macOS** (Intel & Apple Silicon) | ✅ Available |
| **Windows** (x64) | 🔄 Coming Soon |
| **Linux** (AppImage) | ✅ Available |

> **⚠️ macOS Security Notice**
> Since this app is not code-signed with a paid Apple Developer certificate, macOS may show a security warning. To run the app, **right-click** it and select "Open". You only need to do this once.

---

## 🚀 How to Use

1.  **Open BICU**: Launch the application on your machine.
2.  **Select Folders**: Choose a source folder with your images and a destination folder for the converted files.
3.  **Choose Formats & Quality**: Select the input and output formats, and adjust the output quality.
4.  **Convert**: Click the "Convert" button and watch the progress.

---

## 🏗️ Development and Building

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


## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👤 Author

**Daniel Voigt**
- GitHub: [@danielvoigt](https://github.com/danieleugenevoigt)
- Portfolio: [Your portfolio URL]
