import React from 'react'
import "./informationViewer.css"

const InformationViewer = ({ fileCount, totalTime, avgStartFileSize}) => {
    // Determine the size and unit
    const sizeInKB = avgStartFileSize / 1024;
    const isMB = avgStartFileSize > 999.9;
    const displaySize = isMB ? (sizeInKB / 1024).toFixed(2) : avgStartFileSize.toFixed(1);
    const unit = isMB ? "MB" : "KB";
  
  return (
    <div className='information-viewer'>
      <h2>Image Conversion Statistics</h2>
      <p>Total files converted: <span className='data'>{fileCount}</span></p>
      <p>Total time to convert: <span className='data'>{totalTime}</span> seconds </p>
      <p>Average start file size: <span className='data'>{displaySize} {unit}</span></p>
    </div>
  )
}

export default InformationViewer
