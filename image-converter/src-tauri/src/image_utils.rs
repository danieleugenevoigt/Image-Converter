use std::fs;
use std::fs::File;
use std::io::{BufWriter, Write};  // Corrected import syntax
use std::path::Path;
use image::{ImageFormat, ImageReader, GenericImageView};
use webp::{Encoder, WebPConfig};

/// Converts all PNG images in the input directory to WebP format in the output directory.
#[tauri::command]
pub fn convert_images(input_dir: String, output_dir: String, input_file_type: String) -> Result<(), String> {
    let input_path = Path::new(&input_dir);
    let output_path = Path::new(&output_dir);

    // Ensure output directory exists
    if !output_path.exists() {
        fs::create_dir_all(output_path).map_err(|e| e.to_string())?;
    }

    // Read all files in the input directory
    let entries = fs::read_dir(input_path).map_err(|e| e.to_string())?;

    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();
        
        // Process only .png files
        if path.extension().and_then(|ext| ext.to_str()) == Some(input_file_type.as_str()) {
            let file_stem = path.file_stem().and_then(|s| s.to_str()).unwrap_or("converted");
            let output_file_path = output_path.join(format!("{}.webp", file_stem));

            match convert_image_to_webp(&path, &output_file_path) {
                Ok(_) => println!("Converted: {:?}", path),
                Err(e) => println!("Failed to convert {:?}: {}", path, e),
            }
        }
    }

    Ok(())
}

/// Converts a single image file to WebP format.
fn convert_image_to_webp(
    input_path: &std::path::Path, output_path: &std::path::Path) -> Result<(), String> {

    // Open and decode the image file
    let img = ImageReader::open(input_path)
        .map_err(|e| e.to_string())?
        .decode()
        .map_err(|e| e.to_string())?;

    // Convert the image to raw RGBA8 data
    let (width, height) = img.dimensions();
    let img = img.to_rgba8();

    // Encode to WebP with a quality setting (0.0 = lowest, 100.0 = highest)
    let quality = 75.0;
    let encoder = Encoder::from_rgba(&img, width, height);
    let webp_data = encoder.encode(quality);  // Returns WebPMemory (Vec<u8>)

    // Create the output file and write the encoded WebP data
    let output_file = File::create(output_path).map_err(|e| e.to_string())?;
    let mut writer = BufWriter::new(output_file);
    
    // Write the webp_data to the file
    writer.write(&webp_data).map_err(|e| e.to_string())?;

    Ok(())
}
