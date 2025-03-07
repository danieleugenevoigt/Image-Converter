use crate::image_utils::convert_pngs_to_webp; // Correct import
use tauri::generate_handler;

pub fn get_commands() -> impl Fn(tauri::ipc::Invoke) {
    generate_handler![convert_pngs_to_webp]
}
