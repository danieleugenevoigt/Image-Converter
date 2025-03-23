import React from 'react'
import "./informationViewer.css"

const InformationViewer = ({ fileCount }) => {
  return (
    <div className='information-viewer'>
      <h2>Image Conversion Statistics</h2>
      <p>Total files converted: {fileCount}</p>
    </div>
  )
}

export default InformationViewer
