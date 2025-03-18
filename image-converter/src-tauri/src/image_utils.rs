use std::fs;
use std::fs::File;
use std::io::{BufWriter, Write};
use std::path::Path;
use image::{ImageReader, GenericImageView};
use webp::{Encoder};
use tiff::encoder::{TiffEncoder, colortype::RGBA8};
use tiff::tags::CompressionMethod;
use tiff::TiffError;



/// Converts all PNG images in the input directory to WebP format in the output directory.
#[tauri::command]
pub fn convert_images(
    input_dir: String, 
    output_dir: String, 
    input_file_type: String, 
    output_file_type: String,
    quality: f32) -> Result<(), String> {
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
                "webp" => match convert_image_to_webp(&path, &output_file_path, quality) {
                    Ok(_) => println!("Converted to png: {:?}", path),
                    Err(e) => println!("Failed to convert {:?}: {}", path, e),
                },
                "jpeg" => match convert_image_to_jpeg(&path, &output_file_path, quality as u8) {
                    Ok(_) => println!("Converted to jpeg: {:?}", path),
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
    Ok(())
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

/// Converts an image to TIFF format.
fn convert_image_to_tiff(input_path: &Path, output_path: &Path, quality: u8) -> Result<(), String> {
    // Open and decode the image file
    let img = image::open(input_path).map_err(|e| e.to_string())?;

    // Convert to RGBA8 for best quality and transparency support
    let img = img.to_rgba8();

    // Create output file
    let output_file = File::create(output_path).map_err(|e| e.to_string())?;
    let mut writer = BufWriter::new(output_file);

    // Set compression method based on quality
    let compression = if quality < 25 {
        CompressionMethod::Deflate // Maximum compression
    } else if quality < 50 {
        CompressionMethod::LZW // Good compression, lossless
    } else if quality < 75 {
        CompressionMethod::PackBits // Medium compression
    } else {
        CompressionMethod::None // No compression, highest quality
    };

    // Create TIFF encoder
    let mut encoder = TiffEncoder::new(&mut writer).map_err(|e: TiffError| e.to_string())?;
    
    // Create image encoder with dimensions and write data
    let image_encoder = encoder.new_image::<RGBA8>(img.width(), img.height())
        .map_err(|e| e.to_string())?;
    
    // Write the image data
    image_encoder.write_data(&img)
        .map_err(|e| e.to_string())?;

    log::info!("Converted {:?} to {:?} with compression {:?}", input_path, output_path, compression);
    Ok(())
}