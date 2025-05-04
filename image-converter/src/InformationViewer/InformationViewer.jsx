import React from 'react'
import "./informationViewer.css"

const InformationViewer = ({ fileCount, totalTime, avgStartFileSize, avgEndFileSize}) => {
    // Determine the size and unit of the average start file size
    const isStartMB = avgStartFileSize >= 1024; // Compare to 1024 KB (1 MB)
    const displayStartSize = isStartMB
        ? (avgStartFileSize / 1024).toFixed(2) // Convert to MB
        : avgStartFileSize.toFixed(1); // Keep in KB
    const startUnit = isStartMB ? "MB" : "KB";

    // Determine the size and unit of the average end file size
    const isEndMB = avgEndFileSize >= 1024; // Compare to 1024 KB (1 MB)
    const displayEndSize = isEndMB
        ? (avgEndFileSize / 1024).toFixed(2) // Convert to MB
        : avgEndFileSize.toFixed(1); // Keep in KB
    const endUnit = isEndMB ? "MB" : "KB";
    
  
  return (
    <div className='information-viewer-container'>
      <h2>Image Conversion Statistics</h2>
      <div className='information-viewer'>
        <div className='data-column'>
          <p>Total files converted: <span className='data'>{fileCount}</span></p>
          <p>Total time to convert: <span className='data'>{totalTime}</span> seconds </p>
        </div>
        <div className='data-column'>
          <p>Average start file size: <span className='data'>{displayStartSize} {startUnit}</span></p>
          <p>Average converted file size: <span className='data'>{displayEndSize} {endUnit}</span></p>
        </div>
      </div>
    </div>
  )
}

export default InformationViewer
