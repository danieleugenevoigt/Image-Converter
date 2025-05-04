use image::{GenericImageView, ImageReader};
use magick_rust::{CompressionType, MagickWand};
use std::fs;
use std::fs::File;
use std::io::{BufWriter, Write};
use std::path::Path;
use std::time::Instant;
use webp::Encoder;

/// Converts all PNG images in the input directory to WebP format in the output directory.
#[tauri::command]
pub fn convert_images(
    input_dir: String,
    output_dir: String,
    input_file_type: String,
    output_file_type: String,
    quality: f32,
) -> Result<(usize, f64, f64, f64), String> {
    let input_path = Path::new(&input_dir);
    let output_path = Path::new(&output_dir);

    // Ensure output directory exists
    if !output_path.exists() {
        fs::create_dir_all(output_path).map_err(|e| e.to_string())?;
    }

    // Read all files in the input directory
    let entries = fs::read_dir(input_path).map_err(|e| e.to_string())?;
    let average_starting_file_size = 0u64;
    let mut total_starting_file_size = 0u64;
    let mut total_ending_file_size = 0u64;
    let mut file_count = 0;
    let start_time = Instant::now();

    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();

        // Process only 'input file types' in the input directory
        if input_file_type == "*"
            || path.extension().and_then(|ext| ext.to_str()) == Some(input_file_type.as_str())
        {
            // Get the file size and add it to the total
            let metadata = fs::metadata(&path).map_err(|e| e.to_string())?;
            total_starting_file_size += metadata.len();

            let file_stem = path
                .file_stem()
                .and_then(|s| s.to_str())
                .unwrap_or("converted");
            let output_file_path = output_path.join(format!("{}.{}", file_stem, output_file_type));
            //file_count += 1;

            // Convert the image based on the output file type
            let conversion_result = match output_file_type.as_str() {
                "webp" => convert_image_to_webp(&path, &output_file_path, quality),
                "jpeg" => convert_image_to_jpeg(&path, &output_file_path, quality as u8),
                "png" => convert_image_to_png(&path, &output_file_path),
                "tiff" | "tif" => convert_image_to_tiff(&path, &output_file_path, quality as u8),
                _ => Err(format!("Unsupported file type: {:?}", path)),
            };

            if let Ok(_) = conversion_result {
                // Increment the file count only for successfully converted files
                file_count += 1;

                // Get the file size of the output file and add it to the total
                let output_metadata = fs::metadata(&output_file_path).map_err(|e| e.to_string())?;
                total_ending_file_size += output_metadata.len();
            } else {
                println!("Failed to convert file: {:?}", path);
            }
        }
    }
    let total_time = start_time.elapsed().as_millis() as f64 / 1000.0;

    let average_starting_file_size = if file_count > 0 {
        total_starting_file_size as f64 / file_count as f64
    } else {
        0.0
    };

    let average_ending_file_size = if file_count > 0 {
        total_ending_file_size as f64 / file_count as f64
    } else {
        0.0
    };

    println!("Conversion completed in {:?}", total_time);
    Ok((file_count, total_time, average_starting_file_size, average_ending_file_size))
}

/// Converts a single image file to WebP format.
fn convert_image_to_webp(
    input_path: &Path,
    output_path: &Path,
    quality: f32,
) -> Result<(), String> {
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
    let output_file = File::create(output_path).map_err(|e| {
        format!(
            "Failed to create output file {}: {}",
            output_path.display(),
            e
        )
    })?;
    let mut writer = BufWriter::new(output_file);

    writer.write_all(&webp_data).map_err(|e| {
        format!(
            "Failed to write WebP data to {}: {}",
            output_path.display(),
            e
        )
    })?;

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
    let output_file = File::create(output_path).map_err(|e| {
        format!(
            "Failed to create output file {}: {}",
            output_path.display(),
            e
        )
    })?;
    let writer = BufWriter::new(output_file);

    // Use PNG encoder
    let mut encoder = png::Encoder::new(writer, img.width(), img.height());
    encoder.set_filter(png::FilterType::NoFilter);

    let mut png_writer = encoder
        .write_header()
        .map_err(|e| format!("Failed to write PNG header: {}", e))?;
    png_writer
        .write_image_data(&img.to_rgba8())
        .map_err(|e| format!("Failed to write PNG data: {}", e))?;

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
        0..=25 => CompressionType::Zip,  // Maximum compression (Deflate)
        26..=50 => CompressionType::LZW, // Good compression, lossless
        51..=75 => CompressionType::RLE, // Medium compression (Run-Length Encoding)
        _ => CompressionType::Undefined,
        // No compression, highest quality
    };

    wand.set_compression(compression)
        .map_err(|e| e.to_string())?;

    // Set compression quality (0-100 scale)
    wand.set_compression_quality(quality.into())
        .map_err(|e| e.to_string())?;

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
