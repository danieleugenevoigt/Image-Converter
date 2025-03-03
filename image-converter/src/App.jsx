import { useState } from 'react';
import './App.css';

function App() {
  const [sourcePath, setSourcePath] = useState('');
  const [destinationPath, setDestinationPath] = useState('');

  const handleBrowseSource = async () => {
    if (window.electron) {
      const path = await window.electron.openDirectory();
      if (path) setSourcePath(path);
    }
  };

  const handleBrowseDestination = async () => {
    if (window.electron) {
      const path = await window.electron.openDirectory();
      if (path) setDestinationPath(path);
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
