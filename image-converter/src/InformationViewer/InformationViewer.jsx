import React from 'react'
import "./informationViewer.css"

const InformationViewer = ({ fileCount, totalTime }) => {
  return (
    <div className='information-viewer'>
      <h2>Image Conversion Statistics</h2>
      <p>Total files converted: <span className='data'>{fileCount}</span></p>
      <p>Total time to convert: <span className='data'>{totalTime}</span> seconds </p>

    </div>
  )
}

export default InformationViewer
