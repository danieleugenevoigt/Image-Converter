import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";

import "./App.css";

function App() {
  const [sourcePath, setSourcePath] = useState("");
  const [destinationPath, setDestinationPath] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [message, setMessage] = useState("");
  const [fromFileType, setFromFileType] = useState("png");
  const [toFileType, setToFileType] = useState("webp");

  const handleBrowseSource = async () => {
    try {
      const selected = await open({ directory: true });

      if (selected) setSourcePath(selected);
    } catch (error) {
      console.error("Error selecting source folder:", error);
    }
  };

  const handleBrowseDestination = async () => {
    try {
      const selected = await open({ directory: true });

      if (selected) setDestinationPath(selected);
    } catch (error) {
      console.error("Error selecting destination folder:", error);
    }
  };

  const handleConvertImages = async () => {
    if (!sourcePath || !destinationPath) {
      setMessage("Please select both source and destination folders.");
      return;
    }

    setIsConverting(true);
    setMessage("Converting images...");
    console.log("Converting images with the following parameters:");
    console.log("Source Path:", sourcePath);
    console.log("Destination Path:", destinationPath);
    console.log("From File Type:", fromFileType);
    console.log("To File Type:", toFileType);

    try {
      await invoke("convert_images", { 
        inputDir: sourcePath, 
        outputDir: destinationPath, 
        inputFileType: fromFileType, 
        outputFileType: toFileType });
      setMessage("Conversion completed successfully!");
    } catch (error) {
      console.error("Error during conversion:", error);
      setMessage("Error during conversion. Check the console for details.");
    }

    setIsConverting(false);
  };

  return (
    <div className="app-container">
      <h1>Image Converter Pro</h1>

      <div className="path-container">
        <div className="path-input">
          <label>Source Folder:</label>
          <input type="text" value={sourcePath} readOnly placeholder="Select source folder" />
          <button onClick={handleBrowseSource}>Browse</button>
        </div>

        <div className="path-input">
          <label>Destination Folder:</label>
          <input type="text" value={destinationPath} readOnly placeholder="Select destination folder" />
          <button onClick={handleBrowseDestination}>Browse</button>
        </div>
      </div>

      <div className="file-types">
        <div className="from-file-types">
          <label>From File Types:</label>
          <select value={fromFileType} onChange={(e) => setFromFileType(e.target.value)}>
            <option value="png">png</option>
            <option value="jpg">jpg</option>
            <option value="jpeg">jpeg</option>
            <option value="gif">gif</option>
            <option value="bmp">bmp</option>
            <option value="tiff">tiff</option>
            <option value="webp">webp</option>
          </select>
        </div>
        <div className="to-file-types">
          <label>To File Type:</label>
          <select value={toFileType} onChange={(e) => setToFileType(e.target.value)}>
            <option value="webp">webp</option>
            <option value="jpeg">jpeg</option>
            <option value="png">png</option>
            <option value="tiff"> stiff</option>
          </select>
        </div>
      </div>

      <button className="convert-button" onClick={handleConvertImages} disabled={isConverting}>
        {isConverting ? "Converting..." : "handle Convert Images"}
      </button>

      {message && <p className="status-message">{message}</p>}
    </div>
  );
}

export default App;
