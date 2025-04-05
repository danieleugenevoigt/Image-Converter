import { useState, useEffect } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import InformationViewer from "./InformationViewer/InformationViewer.jsx";
import "./App.css";


function App() {
  const [sourcePath, setSourcePath] = useState("");
  const [destinationPath, setDestinationPath] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [message, setMessage] = useState("");
  const [fromFileType, setFromFileType] = useState("png");
  const [toFileType, setToFileType] = useState("webp");
  const [fileCount, setFileCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [quality, setQuality] = useState(90);
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage when the app loads
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    console.log("Loaded from localStorage:", storedFavorites); // Debugging log

    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleBrowseSource = async () => {
    try {
      const selected = await open({ directory: true });

      if (selected) setSourcePath(selected);
    } catch (error) {
      console.error("Error selecting source folder:", error);
    }
  };

  const handleAddToFavorites = () => {
    if (sourcePath && !favorites.includes(sourcePath)) {
      setFavorites([...favorites, sourcePath]);
      setMessage("Added to favorites!");
    } else {
      setMessage("Path is already in favorites or empty.");
    }
  };

  const handleSelectFavorite = (favorite) => {
    setSourcePath(favorite);
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

    setFileCount(0);
    setTotalTime(0);
    setIsConverting(true);
    setMessage("Converting images...");
    console.log("Converting images with the following parameters:");
    console.log("Source Path:", sourcePath);
    console.log("Destination Path:", destinationPath);
    console.log("From File Type:", fromFileType);
    console.log("To File Type:", toFileType);
  
    try {
      const data = await invoke("convert_images", { 
        inputDir: sourcePath, 
        outputDir: destinationPath, 
        inputFileType: fromFileType, 
        outputFileType: toFileType,
        quality: quality,
       });
       
      setFileCount(data[0]);
      setTotalTime(data[1].toFixed(3));      setMessage("Conversion completed successfully!");
    } catch (error) {
      console.error("Error during conversion:", error);
      setMessage("Error during conversion. Check the console for details.");
    }

    setIsConverting(false);
  };

  return (
    <div className="app-container">
      <h1>BICU</h1>
      <h2>Batch Image Converter Utility</h2>
      <div className="path-container">
        <div className="path-input">
          <label>Source Folder:</label>
          <input
            type="text"
            value={sourcePath}
            readOnly
            placeholder="Select source folder"
          />
          <button onClick={handleBrowseSource}>Browse</button>
          <button onClick={handleAddToFavorites}>Add to Favorites</button>
          
          <div className="favorites-container">
          <label>Favorites:</label>
          <select
            onChange={(e) => handleSelectFavorite(e.target.value)}
            value={sourcePath}
          >
            <option value="">Select a favorite</option>
            {favorites.map((favorite, index) => (
              <option key={index} value={favorite}>
                {favorite}
              </option>
            ))}
          </select>
        </div>
  
        

        <div className="path-input">
          <label>Destination Folder:</label>
          <input
            type="text"
            value={destinationPath}
            readOnly
            placeholder="Select destination folder"
          />
          <button onClick={handleBrowseDestination}>Browse</button>
        </div>
      </div>

      <div className="file-types">
        <div className="from-file-types">
          <label>From File Types:</label>
          <select
            value={fromFileType}
            onChange={(e) => setFromFileType(e.target.value)}
          >
            <option value="*">Any</option>
            <option value="webp">webp</option>
            <option value="jpeg">jpeg</option>
            <option value="png">png</option>
            <option value="tif">tif</option>
          </select>
        </div>
        <div className="to-file-types">
          <label>To File Type:</label>
          <select
            value={toFileType}
            onChange={(e) => setToFileType(e.target.value)}
          >
            <option value="webp">webp</option>
            <option value="jpeg">jpeg</option>
            <option value="png">png</option>
            <option value="tif">tif</option>
          </select>
        </div>
        <div className="file-quality">
          <label>Quality:</label>
          <input
            type="number"
            min="1"
            max="100"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
          />
        </div>
      </div>
      <div>
        <InformationViewer fileCount={fileCount} totalTime={totalTime} />
      </div>
      <button
        className="convert-button"
        onClick={handleConvertImages}
        disabled={isConverting}
      >
        {isConverting ? "Converting..." : "Convert Images"}
      </button>

      {message && <p className="status-message">{message}</p>}
        </div>
      </div>
  );
}

export default App;
