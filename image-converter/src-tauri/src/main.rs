#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod image_utils; // Declare the module
use tauri_plugin_fs; 

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_fs::init()) 

        .invoke_handler(tauri::generate_handler![image_utils::convert_images])
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}
