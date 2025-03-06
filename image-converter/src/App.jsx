// filepath: /Users/danielvoigt/Code/Image_Converter/Image-Converter/image-converter/src/App.jsx
import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog"; // Import the open function from the dialog plugin
import "./App.css";

function App() {
  const [sourcePath, setSourcePath] = useState("");
  const [destinationPath, setDestinationPath] = useState("");

  const handleBrowseSource = async () => {
    console.log("Browser Source Clicked"); // Debugging log
    try {
      const selected = await open({
        directory: true, // Open a directory selector
      });

      if (selected) {
        console.log("Source folder selected:", selected);
        setSourcePath(selected); // Set the path state to selected folder
      } else {
        console.log("No folder selected");
      }
    } catch (error) {
      console.error("Error selecting source folder:", error); // Log any error
    }
  };

  const handleBrowseDestination = async () => {
    console.log("Browser Destination Clicked"); // Debugging log
    try {
      const selected = await open({
        directory: true, // Open a directory selector
        multiple: false, // Allow only one folder to be selected
      });

      if (selected) {
        console.log("Destination folder selected:", selected);
        setDestinationPath(selected); // Set the destination folder path
      } else {
        console.log("No folder selected");
      }
    } catch (error) {
      console.error("Error selecting destination folder:", error);
    }
  };

  return (
    <div className="app-container">
      <h1>Image Converter Pro</h1>

      <div className="path-container">
        <div className="path-input">
          <label>Source Folder:</label>
          <input
            type="text"
            value={sourcePath}
            onChange={(e) => setSourcePath(e.target.value)}
            placeholder="Enter source folder path"
          />
          <button onClick={handleBrowseSource}>Browse</button>
        </div>

        <div className="path-input">
          <label>Destination Folder:</label>
          <input
            type="text"
            value={destinationPath}
            onChange={(e) => setDestinationPath(e.target.value)}
            placeholder="Enter destination folder path"
          />
          <button onClick={handleBrowseDestination}>Browse</button>
        </div>
      </div>

      <button className="convert-button">Convert Images</button>
    </div>
  );
}

export default App;