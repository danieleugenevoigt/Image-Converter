import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";

import "./App.css";

function App() {
  const [sourcePath, setSourcePath] = useState("");
  const [destinationPath, setDestinationPath] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [message, setMessage] = useState("");

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

    try {
      await invoke("convert_png_to_webp", { source: sourcePath, destination: destinationPath });
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

      <button className="convert-button" onClick={handleConvertImages} disabled={isConverting}>
        {isConverting ? "Converting..." : "Convert Images"}
      </button>

      {message && <p className="status-message">{message}</p>}
    </div>
  );
}

export default App;
