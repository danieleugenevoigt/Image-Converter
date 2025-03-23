use std::fs;
use std::path::Path;
use std::fs::File;
use std::io::{BufWriter, Write};
use image::{ImageReader, GenericImageView};
use webp::{Encoder};
use magick_rust::{MagickWand, CompressionType};




/// Converts all PNG images in the input directory to WebP format in the output directory.
#[tauri::command]
pub fn convert_images(
    input_dir: String, 
    output_dir: String, 
    input_file_type: String, 
    output_file_type: String,
    quality: f32) -> Result<usize, String> {
    let input_path = Path::new(&input_dir);
    let output_path = Path::new(&output_dir);
    
    // Ensure output directory exists
    if !output_path.exists() {
        fs::create_dir_all(output_path).map_err(|e| e.to_string())?;
    }

    // Read all files in the input directory
    let entries = fs::read_dir(input_path).map_err(|e| e.to_string())?;
    let mut file_count = 0;

    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();
        

        // Process only 'input file types' in the input directory
        if path.extension().and_then(|ext| ext.to_str()) == Some(input_file_type.as_str()) {
            let file_stem = path.file_stem().and_then(|s| s.to_str()).unwrap_or("converted");
            let output_file_path = output_path.join(format!("{}.{}", file_stem, output_file_type));
            file_count += 1;

            // Convert the image based on the output file type
            match output_file_type.as_str() {
                "webp" => match convert_image_to_webp(&path, &output_file_path, quality) {
                    Ok(_) => println!("Converted to png: {:?}", path),
                    Err(e) => println!("Failed to convert {:?}: {}", path, e),
                },
                "jpeg" => match convert_image_to_jpeg(&path, &output_file_path, quality as u8) {
                    Ok(_) => println!("Converted to jpeg: {:?}", path),
                    Err(e) => println!("Failed to convert {:?}: {}", path, e),
                },
                "png" => match convert_image_to_png(&path, &output_file_path) {
                    Ok(_) => println!("Converted to png: {:?}", path),
                    Err(e) => println!("Failed to convert {:?}: {}", path, e),
                },
                "tiff" | "tif" => match convert_image_to_tiff(&path, &output_file_path, quality as u8) {
                    Ok(_) => println!("Converted to tif: {:?}", path),
                    Err(e) => println!("Failed to convert {:?}: {}", path, e),
                },
                _ => {
                    println!("Unsupported file type: {:?}", path);
                }
            }
        }
    }
    Ok(file_count)
}

/// Converts a single image file to WebP format.
fn convert_image_to_webp(input_path: &Path, output_path: &Path, quality: f32) -> Result<(), String> {
    // Open and decode the image file
    let img = ImageReader::open(input_path)
        .map_err(|e| format!("Failed to open image {}: {}", input_path.display(), e))?
        .decode()
        .map_err(|e| format!("Failed to decode image {}: {}", input_path.display(), e))?;

    // Ensure the image is in RGBA format
    let img = img.to_rgba8(); // This guarantees a consistent type (ImageBuffer<Rgba<u8>>)

    let (width, height) = img.dimensions();
 
    // Encode to WebP with a quality setting (0.0 = lowest, 100.0 = highest)
    let encoder = Encoder::from_rgba(&img, width, height);
    let webp_data = encoder.encode(quality); // Returns WebPMemory (Vec<u8>)

    // Write the WebP file
    let output_file = File::create(output_path)
        .map_err(|e| format!("Failed to create output file {}: {}", output_path.display(), e))?;
    let mut writer = BufWriter::new(output_file);
    
    writer.write_all(&webp_data)
        .map_err(|e| format!("Failed to write WebP data to {}: {}", output_path.display(), e))?;

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

// Converts an image to PNG format.
fn convert_image_to_png(input_path: &Path, output_path: &Path) -> Result<(), String> {
    // Open and decode the image file
    let img = ImageReader::open(input_path)
        .map_err(|e| format!("Failed to open image {}: {}", input_path.display(), e))?
        .decode()
        .map_err(|e| format!("Failed to decode image {}: {}", input_path.display(), e))?;

    // Create the output file
    let output_file = File::create(output_path).map_err(|e| format!("Failed to create output file {}: {}", output_path.display(), e))?;
    let writer = BufWriter::new(output_file);

    // Use PNG encoder
    let mut encoder = png::Encoder::new(writer, img.width(), img.height());
    encoder.set_filter(png::FilterType::NoFilter);

    let mut png_writer = encoder.write_header().map_err(|e| format!("Failed to write PNG header: {}", e))?;
    png_writer.write_image_data(&img.to_rgba8()).map_err(|e| format!("Failed to write PNG data: {}", e))?;

    log::info!("Converted {:?} to {:?}", input_path, output_path);
    Ok(())
}

/// Converts an image to TIFF format.
fn convert_image_to_tiff(input_path: &Path, output_path: &Path, quality: u8) -> Result<(), String> {
    
    magick_rust::magick_wand_genesis();

    // Create a new MagickWand instance
    let mut wand = MagickWand::new();

    // Read the input image
    wand.read_image(input_path.to_str().ok_or("Invalid input path")?)
        .map_err(|e| e.to_string())?;

    // Set image format to TIFF
    wand.set_image_format("tiff").map_err(|e| e.to_string())?;

    // Set compression method based on quality
    let compression = match quality {
        0..=25 => CompressionType::Zip,     // Maximum compression (Deflate)
        26..=50 => CompressionType::LZW,    // Good compression, lossless
        51..=75 => CompressionType::RLE,    // Medium compression (Run-Length Encoding)
        _ => CompressionType::Undefined,

        // No compression, highest quality
    };

    wand.set_compression(compression).map_err(|e| e.to_string())?;

    // Set compression quality (0-100 scale)
    wand.set_compression_quality(quality.into()).map_err(|e| e.to_string())?;

    // Write the output image
    wand.write_image(output_path.to_str().ok_or("Invalid output path")?)
        .map_err(|e| e.to_string())?;

    log::info!(
        "Converted {:?} to {:?} with compression {:?} at quality {}",
        input_path,
        output_path,
        compression,
        quality
    );

    Ok(())
}
