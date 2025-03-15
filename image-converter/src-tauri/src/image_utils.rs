use std::fs;
use std::fs::File;
use std::io::{BufWriter, Write};  // Corrected import syntax
use std::path::Path;
use image::{ImageFormat, ImageReader, GenericImageView};
use webp::{Encoder, WebPConfig};

/// Converts all PNG images in the input directory to WebP format in the output directory.
#[tauri::command]
pub fn convert_images(input_dir: String, output_dir: String, input_file_type: String, output_file_type: String) -> Result<(), String> {
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
        
        // Process only 'input file types' in the input directory
        if path.extension().and_then(|ext| ext.to_str()) == Some(input_file_type.as_str()) {
            let file_stem = path.file_stem().and_then(|s| s.to_str()).unwrap_or("converted");
            let output_file_path = output_path.join(format!("{}.{}", file_stem, output_file_type));


            match output_file_type.as_str() {
                "png" => match convert_image_to_webp(&path, &output_file_path) {
                    Ok(_) => println!("Converted: {:?}", path),
                    Err(e) => println!("Failed to convert {:?}: {}", path, e),
                },
                "jpeg" => match convert_image_to_jpeg(&path, &output_file_path, 75) {
                    Ok(_) => println!("Converted to jpeg: {:?}", path),
                    Err(e) => println!("Failed to convert {:?}: {}", path, e),
                },
                _ => {
                    println!("Unsupported file type: {:?}", path);
                }
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

    log::info!("Converted {:?} to {:?}", input_path, output_path);
    Ok(())
}

/// Converts a single image file to JPEG format.
fn convert_image_to_jpeg(input_path: &Path, output_path: &Path, quality: u8) -> Result<(), String> {
    // Open and decode the image file
    let img = ImageReader::open(input_path)
        .map_err(|e| e.to_string())?
        .decode()
        .map_err(|e| e.to_string())?;

    // Create the output file
    let output_file = File::create(output_path).map_err(|e| e.to_string())?;
    let writer = BufWriter::new(output_file);

    // Use JPEG encoder with quality setting
    let mut encoder = image::codecs::jpeg::JpegEncoder::new_with_quality(writer, quality);
    encoder.encode_image(&img).map_err(|e| e.to_string())?;

    log::info!("Converted {:?} to {:?}", input_path, output_path);
    Ok(())
}
