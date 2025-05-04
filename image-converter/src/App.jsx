import { useRef, useState, useEffect} from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import InformationViewer from "./InformationViewer/InformationViewer.jsx";
import { Store } from '@tauri-apps/plugin-store';
import { exists, mkdir } from "@tauri-apps/plugin-fs";
import "./App.css";

function App() {
  const [sourcePath, setSourcePath] = useState("");
  const [destinationPath, setDestinationPath] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [message, setMessage] = useState("");
  const [fromFileType, setFromFileType] = useState("png");
  const [toFileType, setToFileType] = useState("webp");
  const [fileCount, setFileCount] = useState(0);
  const [averageStartingFileSize, setAverageStartingFileSize] = useState(0);
  // const [averageEndingFileSize, setAverageEndingFileSize] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [quality, setQuality] = useState(90);
  const [sourceFavorites, setSourceFavorites] = useState([]);
  const [destinationFavorites, setDestinationFavorites] = useState([]);

  let store = useRef(null);

  async function initStore() {
    store = await Store.load(".settings.dat");
}

 // create useEffect to load source favorites from store

  useEffect(() => {
    async function loadSourceFavorites() {
      await initStore();
      const stored = await store.get("favorites");
      if (stored && Array.isArray(stored)) {
        setSourceFavorites(stored);
        console.log("Loaded from Tauri store:", stored);
      }
    }
  
    loadSourceFavorites();
  },[]);
  
  // create useEffect to load destination favorites from store

   useEffect(() => {
    async function loadDestinationFavorites() {
      await initStore();
      const stored = await store.get("destinationFavorites");
      if (stored && Array.isArray(stored)) {
        setDestinationFavorites(stored);
        console.log("Loaded from Tauri store:", stored);
      }
    }
    loadDestinationFavorites();
  }, []);

  // create useEffect to save source favorites to store
  // when sourceFavorites changes
  // and save it to the Tauri store

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
  
  // create useEffect to save destination favorites to store
  // when destinationFavorites changes
  // and save it to the Tauri store

  useEffect(() => {
    async function saveFavoritesDestination() {
      console.log("Saving destination favorites to store:", setDestinationFavorites);
      await initStore();
      await store.set("destinationFavorites", destinationFavorites);
      await store.save(); // Required to persist to disk
      console.log("Saved to Tauri store:", destinationFavorites);
    }
    if (destinationFavorites.length) {
      saveFavoritesDestination(); 
    }
  }, [destinationFavorites]);

 // Function to handle browsing for the source folder

  const handleBrowseSource = async () => {
    try {
      const selected = await open({ directory: true });

      if (selected) setSourcePath(selected);
    } catch (error) {
      console.error("Error selecting source folder:", error);
    }
  };

  // Function to add the current source path to favorites
  // and save it to the Tauri store
  const handleAddToFavoritesSource = async () => {
    if (sourcePath && !sourceFavorites.includes(sourcePath)) {
      setSourceFavorites([...sourceFavorites, sourcePath]);
      setMessage("Added to favorites!");
    } else {
      setMessage("Path is already in favorites or empty.");
    }
  };

  // Function to remove the current source path from favorites
  // and save it to the Tauri store

  const handleRemoveFavoriteSource = () => {
    if (sourcePath && sourceFavorites.includes(sourcePath)) {
      setSourceFavorites(sourceFavorites.filter((item) => item !== sourcePath));
      setMessage("Favorite removed successfully!");
      setSourcePath(""); // Clear the selection after removal
    } else {
      setMessage("No favorite selected to remove.");
    }
  };

  // Function to handle selection of a favorite source path
  // and set it as the current source path
  const handleSelectFavoriteSource = (favorite) => {
    setSourcePath(favorite);
  };

  // Function to handle browsing for the destination folder
  const handleBrowseDestination = async () => {
    try {
      const selected = await open({ directory: true });

      if (selected) setDestinationPath(selected);
    } catch (error) {
      console.error("Error selecting destination folder:", error);
    }
  };

  /// Function to add the current destination path to favorites
  // and save it to the Tauri store

  const handleAddToFavoritesDestination = async () => {
    if (destinationPath && !destinationFavorites.includes(destinationPath)) {
      setDestinationFavorites([...destinationFavorites, destinationPath]);
      setMessage("Added to favorites!");
    } else {
      setMessage("Path is already in favorites or empty.");
    }
  };

  /// Function to remove the current destination path from favorites
  // and save it to the Tauri store

  const handleRemoveFavoriteDestination = () => {
    if (destinationPath && destinationFavorites.includes(destinationPath)) {
      setDestinationFavorites(destinationFavorites.filter((item) => item !== destinationPath));
      setMessage("Favorite removed successfully!");
      setDestinationPath(""); // Clear the selection after removal
    } else {
      setMessage("No favorite selected to remove.");
    }
  };

  // Function to handle selection of a favorite destination path
  
  const handleSelectFavoriteDestination = (favorite) => {
    setDestinationPath(favorite);
  };


  // Function to handle the conversion process
  // It invokes the Rust backend to perform the conversion
  // and updates the UI with the results
  // It also handles errors and updates the message state
  // to display the status of the conversion process
  // It also updates the fileCount and totalTime state
  // to display the number of files converted and the total time taken
  // It also updates the isConverting state to disable the button
  // while the conversion is in progress

  const handleConvertImages = async () => {
    if (!sourcePath || !destinationPath) {
      setMessage("Please select both source and destination folders.");
      return;
    }

    setFileCount(0);
    setTotalTime(0);
    setIsConverting(true);
    setMessage("Converting images...");
  
    try {
      const data = await invoke("convert_images", { 
        inputDir: sourcePath, 
        outputDir: destinationPath, 
        inputFileType: fromFileType, 
        outputFileType: toFileType,
        quality: quality,
       });
       
      setFileCount(data[0]);
      setTotalTime(data[1].toFixed(3)); 
      setAverageStartingFileSize(data[2].toFixed(1));
      setMessage("Conversion completed successfully!");
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
        <div className="from-container">
          <div className="path-input">
            <label>Source Folder:</label>
            <input
              title={sourcePath}
              type="text"
              value={sourcePath}
              placeholder="Select or type source folder"
              onChange={(e) => setSourcePath(e.target.value)} // Allow typing
              onBlur={async () => {
                const folderExists = await exists(sourcePath);
                if (!folderExists) {
                  setMessage("Source folder does not exist. Please enter a valid folder.");
                } else {
                  setMessage(""); // Clear any previous error message
                }
              }}
            />
            <button 
              onClick={handleBrowseSource} 
              title="Browse">
              <span className="material-icons">folder_open</span>
            </button>
            <button 
              onClick={handleAddToFavoritesSource} 
              title="Add To Favorites">
              <span className="material-icons">favorite_border</span>
            </button>
            <button
              onClick={handleRemoveFavoriteSource}
              title="Remove Selected Favorite"
              disabled={!sourcePath || !sourceFavorites.includes(sourcePath)}
            >
              <span className="material-icons">delete</span>
            </button>
          </div>

          <div className="favorites">
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
          <div className="from-file-types">
              <label>File Types:</label>
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
        </div>
        <div className="to-container">
          <div className="path-output">
            <label>Destination Folder:</label>
            <input
              title={destinationPath}
              type="text"
              value={destinationPath}
              placeholder="Select or type destination folder"
              onChange={(e) => setDestinationPath(e.target.value)} // Allow typing
              onBlur={async () => {
                const folderExists = await exists(destinationPath);
                if (!folderExists) {
                  try {
                    await mkdir(destinationPath, { recursive: true });
                    setMessage("Destination folder was created successfully.");
                  } catch (error) {
                    console.error("Error creating destination folder:", error);
                    setMessage("Failed to create destination folder. Check the console for details.");
                  }
                } else {
                  setMessage(""); // Clear any previous message
                }
              }}
            />
            <button 
              onClick={handleBrowseDestination} 
              title="Browse">
              <span className="material-icons">folder_open</span>
            </button>
            <button 
              onClick={handleAddToFavoritesDestination} 
              title="Add To Favorites">
              <span className="material-icons">favorite_border</span>
            </button>
            <button
              onClick={handleRemoveFavoriteDestination}
              title="Remove Selected Favorite"
              disabled={!destinationPath || !destinationFavorites.includes(destinationPath)}
            >
              <span className="material-icons">delete</span>
            </button>

          </div>

          <div className="favorites">
            <label>Favorites:</label>
            <select
              onChange={(e) => handleSelectFavoriteDestination(e.target.value)}
              value={destinationPath}
            >
              <option value="">Select a favorite</option>
              {destinationFavorites.map((favorite, index) => (
                <option key={index} value={favorite}>
                  {favorite}
                </option>
              ))}
            </select>
          </div>
          <div className="to-file-types">
              <label>File Type:</label>
              <select
                value={toFileType}
                onChange={(e) => setToFileType(e.target.value)}
              >
                <option value="webp">webp</option>
                <option value="jpeg">jpeg</option>
                <option value="png">png</option>
                <option value="tif">tif</option>
              </select>
              
              <select
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                title="Select the quality of the output file. Higher values mean better quality but larger file sizes."

                >
                  <option value="100">Best Quality (100%)</option>
                  <option value="95">Very High Quality (95%)</option>
                  <option value="90">High Quality (90%)</option>
                  <option value="80">Medium Quality (80%)</option>
                  <option value="70">Low Quality (70%)</option>
                  <option value="60">Very Low Quality (70%)</option>
                  <option value="50">Extreme Low Quality (50%)</option>
              </select>
          </div>
        </div>
      </div>

      <div>
        <InformationViewer fileCount={fileCount} totalTime={totalTime} avgStartFileSize={averageStartingFileSize} />
      </div>
      <button
        className="convert-button"
        onClick={handleConvertImages}
        disabled={isConverting}
      >
        {isConverting ? "Converting..." : "Convert"}
      </button>

      {message && <p className="status-message">{message}</p>}
  </div>
  );
}

export default App;
