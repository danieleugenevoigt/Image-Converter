# 📦 Batch Image Converter Utility (BICU) — Version 1.0.0

Welcome to the official release of **Batch Image Converter Utility (BICU)**!  
BICU is a simple, fast, and customizable batch image converter built with **React**, **Vite**, **Rust**, and **Tauri**.  
It lets you convert large sets of images between formats with just a few clicks — no coding required!

---

## ✨ Features

- **Batch Image Conversion**: Convert multiple images between formats (e.g., PNG to WebP).
- **Favorites Management**: Save and reuse favorite source and destination folders.
- **Customizable Quality**: Adjust the quality of the output images.
- **File Type Selection**: Choose input and output file types for conversion.
- **Folder Creation**: Automatically create destination folders if they don’t exist.
- **Progress Tracking**: View conversion progress and status messages.
- **Offline Support**: Works natively without requiring an internet connection.
- **Cross-Platform**: Available for Windows, macOS, and Linux.

---

## 📥 Downloads

| Platform | File | Instructions |
|:--------:|:----:|:-------------|
| **Windows** | [`bicu-setup-1.0.0.exe`](#) | Download and run the installer. |
| **macOS** | [`bicu-1.0.0.dmg`](#) | Download, open the DMG, and drag BICU to Applications. |
| **Linux** | [`bicu-1.0.0.deb`](#) | Install via `sudo dpkg -i bicu-1.0.0.deb`. |

> Replace `#` above with the actual file links once you upload them!

---

## 🚀 How to Use

1. **Open BICU**:
   - Launch the application on your machine.

2. **Select Folders**:
   - Use the "Browse" button to select a source folder containing the images to be converted.
   - Use the "Browse" button to select or create a destination folder where the converted images will be saved.

3. **Choose File Types**:
   - Select the input file type (e.g., PNG, JPEG) from the dropdown menu.
   - Select the output file type (e.g., WebP, TIFF) from the dropdown menu.

4. **Adjust Quality**:
   - Use the quality dropdown to select the desired quality for the output images. Higher values result in better quality but larger file sizes.

5. **Manage Favorites**:
   - Click the "heart" icon to save the current folder as a favorite.
   - Click the "trash" icon to remove the currently selected favorite.

6. **Convert Images**:
   - Click the **Convert** button to start the conversion process.
   - The application will display the number of files converted and the total time taken.

7. **View Status**:
   - A status message will appear at the bottom of the application to indicate progress or any errors.

---

## 🛠️ Developer Guide

### Prerequisites

To build and run the application locally, you’ll need:

- **Node.js** (v16 or later) and **npm**
- **Rust** and **Cargo** (required for Tauri)
- A supported operating system (Windows, macOS, or Linux)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/image-converter.git
   cd image-converter