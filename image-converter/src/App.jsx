import { useRef, useState, useEffect } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import InformationViewer from "./InformationViewer/InformationViewer.jsx";
import { Store } from '@tauri-apps/plugin-store';
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
  const [sourceFavorites, setSourceFavorites] = useState([]);
 
  let store = useRef(null);

  async function initStore() {
    store = await Store.load(".settings.dat");
}

  useEffect(() => {
    async function loadFavorites() {
      await initStore();
      const stored = await store.get("favorites");
      if (stored && Array.isArray(stored)) {
        setSourceFavorites(stored);
        console.log("Loaded from Tauri store:", stored);
      }
    }
  
    loadFavorites();
  },[]);
  

  useEffect(() => {
    async function saveFavoritesSource() {
      console.log("Saving source favorites to store:", setSourceFavorites);
      await initStore();
      await store.set("favorites", sourceFavorites);
      await store.save(); // Required to persist to disk
      console.log("Saved to Tauri store:", sourceFavorites);
    }
  
    if (sourceFavorites.length) {
      saveFavoritesSource();
    }
  }, [sourceFavorites]);
  

  const handleBrowseSource = async () => {
    try {
      const selected = await open({ directory: true });

      if (selected) setSourcePath(selected);
    } catch (error) {
      console.error("Error selecting source folder:", error);
    }
  };

  const handleAddToFavoritesSource = async () => {
    if (sourcePath && !sourceFavorites.includes(sourcePath)) {
      setSourceFavorites([...sourceFavorites, sourcePath]);
      setMessage("Added to favorites!");
    } else {
      setMessage("Path is already in favorites or empty.");
    }
  };

  const handleSelectFavoriteSource = (favorite) => {
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
          <button onClick={handleAddToFavoritesSource}>Add to Favorites</button>
          
          <div className="favorites-container">
          <label>Favorites:</label>
          <select
            onChange={(e) => handleSelectFavoriteSource(e.target.value)}
            value={sourcePath}
          >
            <option value="">Select a favorite</option>
            {sourceFavorites.map((favorite, index) => (
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
